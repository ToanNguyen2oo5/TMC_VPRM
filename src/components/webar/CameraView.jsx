import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceTracker } from './FaceTracker';
import { estimateHeadPose, estimateHeadPoseFromBody } from './headPose';
import { PoseSmoother } from './smoothing';
import { AccessoryRenderer } from './AccessoryRenderer';
import { BodyPoseTracker } from './BodyPoseTracker';
import { CostumeRenderer } from './CostumeRenderer';
import './CameraView.css';

/**
 * CameraView Component
 * Tương thích toàn diện cho cả Laptop / Máy tính để bàn và Điện thoại di động (iOS / Android)
 * Nguyên tắc tối thượng:
 * 1. Mở luồng Camera NGAY LẬP TỨC (< 0.5s) - không chờ đợi AI
 * 2. Nạp AI MediaPipe song song trong nền (background)
 * 3. Fallback đa tầng đảm bảo 100% camera laptop/điện thoại đều nhận được
 */
export default function CameraView({
  selectedAccessory,
  onStateChange,
  isDebug = false,
  onFpsUpdate,
  isMirrored = true,
  onCaptureReady,
  externalCaptureTrigger,
  selectedDeviceId = null,
  onDeviceListAvailable,
  selectedOutfit = null,
  onOutfitTrackingChange
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const streamRef = useRef(null);

  const trackerRef = useRef(null);
  const smootherRef = useRef(null);
  const rendererRef = useRef(null);
  
  const bodyPoseTrackerRef = useRef(null);
  const costumeRendererRef = useRef(null);
  const currentBodyPoseRef = useRef(null);
  const lastPoseInferenceAtRef = useRef(0);
  const outfitTrackingStateRef = useRef('off');
  const faceLostFramesRef = useRef(0);
  const activeHeadSourceRef = useRef('FACE');

  const [errorMessage, setErrorMessage] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [needUserGesture, setNeedUserGesture] = useState(false);
  const [isAiReady, setIsAiReady] = useState(false);

  const animFrameIdRef = useRef(null);
  const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now(), fps: 0 });

  // 1. Khởi tạo Tracker, Smoother và Renderer
  useEffect(() => {
    trackerRef.current = new FaceTracker();
    smootherRef.current = new PoseSmoother({ posAlpha: 0.28, scaleAlpha: 0.25, rotAlpha: 0.22 });
    rendererRef.current = new AccessoryRenderer();
    
    bodyPoseTrackerRef.current = new BodyPoseTracker();
    // Canvas 2D cho lớp áo: ổn định hơn WebGL mesh với asset PNG trong suốt,
    // đồng thời không tạo vòng lặp tải texture ở mỗi khung hình.
    costumeRendererRef.current = new CostumeRenderer();

    // Nạp AI Face Tracker song song trong nền (không chặn việc mở camera!)
    let isMounted = true;
    
    bodyPoseTrackerRef.current.onPoseDetected((pose) => {
      if (isMounted) currentBodyPoseRef.current = pose;
    });

    Promise.allSettled([
      trackerRef.current.init(),
      bodyPoseTrackerRef.current.init()
    ])
      .then((results) => {
        if (isMounted) {
          const faceReady = results[0]?.status === 'fulfilled' && !!results[0]?.value;
          const bodyReady = results[1]?.status === 'fulfilled' && !!results[1]?.value;
          if (faceReady || bodyReady) {
            setIsAiReady(true);
            console.info('✅ AI Trackers đã sẵn sàng!', { faceReady, bodyReady });
          } else {
            console.warn('⚠️ Cả 2 AI Trackers đều không khởi tạo được.');
          }
        }
      })
      .catch((err) => {
        console.warn('⚠️ Lỗi nạp AI tracker:', err);
      });

    return () => {
      isMounted = false;
      if (trackerRef.current) trackerRef.current.dispose();
      trackerRef.current = null;
      if (bodyPoseTrackerRef.current) bodyPoseTrackerRef.current.dispose();
      bodyPoseTrackerRef.current = null;
    };
  }, []);

  // 2. Hàm lấy MediaStream chỉ dành cho Máy tính / Laptop
  const acquireCameraStream = async () => {
    // Nếu người dùng đã chọn đích danh 1 camera qua deviceId
    if (selectedDeviceId) {
      try {
        return await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { 
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      } catch (errDevice) {
        console.warn('Không thể mở camera theo deviceId, chuyển sang tìm kiếm tự động:', errDevice);
      }
    }

    // Ưu tiên chuẩn HD 720p
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
    } catch (errLevel1) {
      console.warn('Không mở được HD 720p, thử độ phân giải cơ bản:', errLevel1.name);
    }

    // Fallback cơ bản nhất
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    });
  };

  // 3. Khởi động Camera và hiển thị NGAY LẬP TỨC
  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    setErrorType(null);
    setNeedUserGesture(false);
    setIsInitializing(true);
    if (onStateChange) onStateChange('starting');

    // Kiểm tra Secure Context (HTTPS hoặc localhost)
    const isLocalhost = window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local');

    if (!window.isSecureContext && !isLocalhost) {
      const msg = 'Trình duyệt yêu cầu kết nối bảo mật HTTPS để mở camera khi truy cập qua mạng IP/điện thoại.';
      setErrorMessage(msg);
      setErrorType('INSECURE_CONTEXT');
      setIsInitializing(false);
      if (onStateChange) onStateChange('error', msg);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Trình duyệt của bạn không hỗ trợ mở camera (API getUserMedia).';
      setErrorMessage(msg);
      setErrorType('UNSUPPORTED');
      setIsInitializing(false);
      if (onStateChange) onStateChange('error', msg);
      return;
    }

    // Dừng stream cũ trước khi cấp stream mới
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    try {
      // 🚀 BƯỚC QUAN TRỌNG: MỞ CAMERA NGAY LẬP TỨC (không chờ AI!)
      const stream = await acquireCameraStream();
      streamRef.current = stream;

      // Cập nhật danh sách thiết bị camera (cho phép người dùng laptop/điện thoại chọn cam)
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        if (onDeviceListAvailable) {
          onDeviceListAvailable(videoInputs);
        }
      } catch (enumErr) {
        console.warn('Không thể liệt kê danh sách thiết bị:', enumErr);
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Đợi video tải metadata xong mới play
        videoRef.current.onloadedmetadata = () => {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsInitializing(false);
                setNeedUserGesture(false);
                if (onStateChange) onStateChange('starting');
              })
              .catch(playErr => {
                console.warn('Autoplay bị trình duyệt chặn, cần cử chỉ người dùng:', playErr);
                setIsInitializing(false);
                setNeedUserGesture(true);
              });
          } else {
            setIsInitializing(false);
          }
        };
      }
    } catch (err) {
      console.error('Lỗi khi mở camera:', err);
      let msg = 'Không thể mở camera. Vui lòng kiểm tra quyền camera trên trình duyệt.';
      let type = 'UNKNOWN';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Vui lòng nhấn vào biểu tượng ổ khóa 🔒 ở thanh địa chỉ và cho phép quyền Camera.';
        type = 'PERMISSION_DENIED';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'Không tìm thấy thiết bị camera trên máy tính của bạn.';
        type = 'NO_DEVICE';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera đang bị ứng dụng khác (Zoom, Meet, Camera app) chiếm dụng hoặc bị khóa.';
        type = 'DEVICE_BUSY';
      } else if (err.name === 'OverconstrainedError') {
        msg = 'Độ phân giải hoặc chế độ camera yêu cầu không được thiết bị hỗ trợ.';
        type = 'OVERCONSTRAINED';
      }

      setErrorMessage(msg);
      setErrorType(type);
      setIsInitializing(false);
      if (onStateChange) onStateChange('error', msg);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  // Kích hoạt lại khi mount hoặc thay đổi camera / thiết bị
  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [startCamera]);

  // Cử chỉ bấm để bắt đầu (cho iOS Safari / trình duyệt chặn autoplay)
  const handleUserPlayGesture = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setNeedUserGesture(false);
        setIsInitializing(false);
      }).catch(err => {
        console.warn('Lỗi khi bấm play:', err);
      });
    }
  };

  // 4. Vòng lặp nhận diện khuôn mặt và vẽ Canvas
  useEffect(() => {
    let isRunning = true;

    const renderLoop = (timestamp) => {
      if (!isRunning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (video && canvas && container && video.readyState >= 2 && !isInitializing && !needUserGesture) {
        const ctx = canvas.getContext('2d');
        const containerWidth = container.clientWidth || 640;
        const containerHeight = container.clientHeight || 480;

        if (canvas.width !== containerWidth || canvas.height !== containerHeight) {
          canvas.width = containerWidth;
          canvas.height = containerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // A. Tính toán tỉ lệ ánh xạ object-fit: cover
        // Tự thích ứng hoàn hảo cho cả Laptop ngang (16:9) và Mobile dọc (9:16)
        const videoW = video.videoWidth || 1280;
        const videoH = video.videoHeight || 720;
        const videoAspect = videoW / videoH;
        const canvasAspect = canvas.width / canvas.height;

        let scale = 1;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasAspect > videoAspect) {
          // Bè ngang hơn video -> fit width, crop height
          scale = canvas.width / videoW;
          offsetY = (canvas.height - videoH * scale) / 2;
        } else {
          // Cao hơn video (Mobile Portrait) -> fit height, crop width
          scale = canvas.height / videoH;
          offsetX = (canvas.width - videoW * scale) / 2;
        }

        // B. Phát hiện khuôn mặt & Cơ thể qua MediaPipe
        let rawLandmarks = null;
        if (trackerRef.current) {
          rawLandmarks = trackerRef.current.detect(video, timestamp);
        }
        
        let bodyPose = currentBodyPoseRef.current;
        // detectForVideo chạy đồng bộ. Giới hạn ở 15 FPS bằng thời gian thực;
        // timestamp % 3 gần như không bao giờ đúng với requestAnimationFrame.
        const shouldTrackBody = selectedOutfit?.image && bodyPoseTrackerRef.current &&
          timestamp - lastPoseInferenceAtRef.current >= 66;
        if (shouldTrackBody) {
            lastPoseInferenceAtRef.current = timestamp;
            const detectedBodyPose = bodyPoseTrackerRef.current.detect(video, timestamp);
            bodyPose = detectedBodyPose || null;
            if (bodyPose) {
                currentBodyPoseRef.current = bodyPose;
            } else {
                currentBodyPoseRef.current = null;
            }
        }

        let rawPose = null;
        if (rawLandmarks) {
          // Ánh xạ tọa độ landmark từ không gian video sang không gian canvas hiển thị
          const mappedLandmarks = rawLandmarks.map(pt => ({
            x: ((pt.x * videoW * scale) + offsetX) / canvas.width,
            y: ((pt.y * videoH * scale) + offsetY) / canvas.height,
            z: pt.z
          }));

          rawPose = estimateHeadPose(mappedLandmarks, canvas.width, canvas.height, isMirrored);
        }

        let mappedBodyPose = null;
        if (bodyPose) {
            // Video được lật bằng CSS trong chế độ gương, canvas thì không.
            // Mọi landmark cơ thể phải được lật trước khi đổi sang tọa độ canvas.
            const mapBodyPoint = (point) => ({
              x: ((((isMirrored ? 1 - point.x : point.x) * videoW * scale) + offsetX) / canvas.width),
              y: ((point.y * videoH * scale) + offsetY) / canvas.height
            });
            mappedBodyPose = {
                ...bodyPose,
                nose: mapBodyPoint(bodyPose.nose),
                leftEye: mapBodyPoint(bodyPose.leftEye),
                rightEye: mapBodyPoint(bodyPose.rightEye),
                leftEar: mapBodyPoint(bodyPose.leftEar),
                rightEar: mapBodyPoint(bodyPose.rightEar),
                midShoulder: mapBodyPoint(bodyPose.midShoulder),
                leftShoulder: mapBodyPoint(bodyPose.leftShoulder),
                rightShoulder: mapBodyPoint(bodyPose.rightShoulder),
                leftHip: mapBodyPoint(bodyPose.leftHip),
                rightHip: mapBodyPoint(bodyPose.rightHip),
                shoulderWidth: (bodyPose.shoulderWidth * videoW * scale) / canvas.width,
                torsoHeight: (bodyPose.torsoHeight * videoH * scale) / canvas.height,
                // Phép phản chiếu theo trục dọc cũng đảo dấu góc nghiêng.
                shoulderRollRad: isMirrored ? -bodyPose.shoulderRollRad : bodyPose.shoulderRollRad
            };
        }

        // Tính toán logic Hysteresis
        if (rawPose) {
          faceLostFramesRef.current = 0;
          if (activeHeadSourceRef.current !== 'FACE') activeHeadSourceRef.current = 'FACE';
        } else {
          faceLostFramesRef.current++;
        }

        // Fallback sang BodyPose nếu mất FaceLandmarker quá ngưỡng (hysteresis = 5 frames) hoặc chưa từng có face
        if ((!rawPose || faceLostFramesRef.current > 5) && mappedBodyPose) {
          const bodyHeadPose = estimateHeadPoseFromBody(mappedBodyPose, canvas.width, canvas.height, isMirrored);
          if (bodyHeadPose) {
            rawPose = bodyHeadPose;
            activeHeadSourceRef.current = 'BODY';
          }
        }

        if (rawPose) {
          const smoothedPose = smootherRef.current?.update(rawPose);
          if (smoothedPose) {
            if (onStateChange) onStateChange('tracking');
            // Gắn nhãn source để debug
            smoothedPose.source = activeHeadSourceRef.current;
            // Render phụ kiện ôm theo tư thế đầu
            rendererRef.current?.render(ctx, smoothedPose, selectedAccessory, timestamp, isDebug);
          }
        } else {
          // Mất mặt trong frame hiện tại -> kích hoạt hiệu ứng fade-out mượt mà
          if (onStateChange) onStateChange(isAiReady ? 'noFace' : 'starting');
          rendererRef.current?.render(ctx, null, selectedAccessory, timestamp, isDebug);
        }
        
        // C. Render trang phục lên người
        const nextOutfitTrackingState = !selectedOutfit?.image || selectedOutfit.id === 'none'
          ? 'off'
          : mappedBodyPose?.hasReliableTorso
            ? 'ready'
            : 'stepBack';
        if (nextOutfitTrackingState !== outfitTrackingStateRef.current) {
          outfitTrackingStateRef.current = nextOutfitTrackingState;
          onOutfitTrackingChange?.(nextOutfitTrackingState);
        }

        if (nextOutfitTrackingState === 'ready') {
            costumeRendererRef.current?.render(ctx, mappedBodyPose, selectedOutfit, timestamp);
        }

        // D. Đo và cập nhật FPS
        const counter = fpsCounterRef.current;
        counter.frames++;
        if (timestamp - counter.lastTime >= 1000) {
          counter.fps = Math.round((counter.frames * 1000) / (timestamp - counter.lastTime));
          counter.frames = 0;
          counter.lastTime = timestamp;
          if (onFpsUpdate) onFpsUpdate(counter.fps);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [selectedAccessory, selectedOutfit, isMirrored, isDebug, isInitializing, isAiReady, needUserGesture, onStateChange, onFpsUpdate, onOutfitTrackingChange]);

  // 5. Chụp ảnh kết hợp (Frame camera + Phụ kiện đúng chiều)
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Vẽ frame video
    tempCtx.save();
    if (isMirrored) {
      tempCtx.translate(tempCanvas.width, 0);
      tempCtx.scale(-1, 1);
    }

    const videoW = video.videoWidth;
    const videoH = video.videoHeight;
    const videoAspect = videoW / videoH;
    const canvasAspect = tempCanvas.width / tempCanvas.height;

    let scale = 1, offsetX = 0, offsetY = 0;
    if (canvasAspect > videoAspect) {
      scale = tempCanvas.width / videoW;
      offsetY = (tempCanvas.height - videoH * scale) / 2;
    } else {
      scale = tempCanvas.height / videoH;
      offsetX = (tempCanvas.width - videoW * scale) / 2;
    }

    tempCtx.drawImage(video, offsetX, offsetY, videoW * scale, videoH * scale);
    tempCtx.restore();

    // Vẽ lớp phụ kiện lên trên
    tempCtx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
    if (onCaptureReady) {
      onCaptureReady(dataUrl);
    }
    return dataUrl;
  }, [isMirrored, onCaptureReady]);

  // Kích hoạt chụp từ ngoài
  useEffect(() => {
    if (externalCaptureTrigger && externalCaptureTrigger > 0) {
      capturePhoto();
    }
  }, [externalCaptureTrigger, capturePhoto]);

  return (
    <div className="camera-view-container" ref={containerRef}>
      {/* Video stream thực tế từ Webcam */}
      <video
        ref={videoRef}
        className={`camera-video ${isMirrored ? 'mirrored' : ''}`}
        playsInline
        webkit-playsinline="true"
        muted
        autoPlay
      />

      {/* Canvas 2D render overlay phụ kiện và debug */}
      <canvas
        ref={canvasRef}
        className="camera-overlay-canvas"
      />

      {/* Thông báo chạm để bật (iOS Safari / Autoplay blocker) */}
      {needUserGesture && (
        <div className="camera-gesture-overlay">
          <span className="gesture-icon">👆</span>
          <h4>Nhấn để xem Camera</h4>
          <p>Trình duyệt yêu cầu xác nhận để hiển thị hình ảnh webcam.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUserPlayGesture}
          >
            Bắt đầu xem
          </button>
        </div>
      )}

      {/* Trạng thái tải camera ban đầu */}
      {isInitializing && (
        <div className="camera-loading-overlay">
          <div className="camera-spinner" />
          <p>Đang mở camera laptop...</p>
        </div>
      )}

      {/* Thông báo lỗi & Hướng dẫn khắc phục */}
      {errorMessage && (
        <div className="camera-error-overlay">
          <span className="error-icon">⚠️</span>
          <h4>Không thể mở camera</h4>
          <p>{errorMessage}</p>
          <div className="camera-troubleshoot-box">
            <small>💡 <strong>Gợi ý nhanh cho Laptop:</strong></small>
            <ul>
              <li>Nhấp vào biểu tượng ổ khóa 🔒 ở thanh địa chỉ để cấp quyền Camera.</li>
              <li>Kiểm tra nắp che camera vật lý (privacy shutter) trên cạnh màn hình laptop.</li>
              <li>Tắt các ứng dụng đang dùng cam như Zoom, Zalo, Teams.</li>
            </ul>
          </div>
          <div className="error-actions" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={startCamera}
            >
              🔄 Thử lại ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
