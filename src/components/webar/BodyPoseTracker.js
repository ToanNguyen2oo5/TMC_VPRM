/**
 * MediaPipe PoseLandmarker Tracker (BodyPoseTracker.js)
 * Sử dụng @mediapipe/tasks-vision thay cho @mediapipe/pose cũ.
 */
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

const LOCAL_WASM_PATH = '/wasm';
const CDN_WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';

// Bản Full ổn định hơn Lite khi người dùng đứng xa, bị che một phần, hoặc ánh sáng yếu.
// Vẫn chạy hoàn toàn trên thiết bị; không gửi khung hình camera lên máy chủ.
const LOCAL_MODEL_PATH = '/models/pose_landmarker_full.task';
const CDN_MODEL_PATH = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task';

export class BodyPoseTracker {
  constructor() {
    this.landmarker = null;
    this.isLoading = false;
    this.lastTimestamp = -1;
    this.lastVideoTime = -1;
    this.activeDelegate = 'GPU';
    this.callbacks = [];
  }

  async init() {
    if (this.landmarker) return this.landmarker;
    if (this.isLoading) return null;

    this.isLoading = true;

    // 1. Tải WASM files
    let vision = null;
    try {
      vision = await FilesetResolver.forVisionTasks(LOCAL_WASM_PATH);
    } catch (e) {
      console.warn('⚠️ Không thể tải WASM local, chuyển sang CDN:', e.message);
      vision = await FilesetResolver.forVisionTasks(CDN_WASM_PATH);
    }

    // 2. Thử khởi tạo với GPU delegate
    const createWithDelegate = async (delegate, modelPath) => {
      return await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: delegate
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.55,
        minPosePresenceConfidence: 0.55,
        minTrackingConfidence: 0.55
      });
    };

    let modelPath = LOCAL_MODEL_PATH;
    try {
      this.landmarker = await createWithDelegate('GPU', modelPath);
      this.activeDelegate = 'GPU';
      console.info('🚀 MediaPipe PoseLandmarker khởi tạo thành công với [GPU]');
    } catch (e) {
      console.warn('⚠️ Lỗi GPU Delegate PoseLandmarker, thử lại bằng CPU:', e.message);
      try {
        this.landmarker = await createWithDelegate('CPU', modelPath);
        this.activeDelegate = 'CPU';
        console.info('✅ MediaPipe PoseLandmarker khởi tạo thành công với [CPU]');
      } catch (cpuError) {
        console.warn('⚠️ Không tải được model Pose local, thử tải từ CDN...');
        modelPath = CDN_MODEL_PATH;
        try {
          this.landmarker = await createWithDelegate('GPU', modelPath);
          this.activeDelegate = 'GPU (CDN)';
        } catch (cdnGpuError) {
          this.landmarker = await createWithDelegate('CPU', modelPath);
          this.activeDelegate = 'CPU (CDN)';
        }
      }
    }

    this.isLoading = false;
    return this.landmarker;
  }

  /**
   * Phát hiện pose trên khung hình video
   * Sử dụng API detectForVideo của tasks-vision (chạy đồng bộ)
   */
  detect(videoElement, timestamp) {
    if (!this.landmarker || !videoElement || videoElement.readyState < 2) return null;
    
    if (videoElement.currentTime !== this.lastVideoTime) {
      this.lastVideoTime = videoElement.currentTime;
      try {
        // Đảm bảo timestamp luôn tăng
        const ts = Math.max(timestamp, this.lastTimestamp + 1);
        this.lastTimestamp = ts;
        
        const result = this.landmarker.detectForVideo(videoElement, ts);
        
        if (result && result.landmarks && result.landmarks.length > 0) {
          const processedPose = this.processLandmarks(result.landmarks[0]);
          if (processedPose) {
            this.callbacks.forEach(cb => cb(processedPose, result));
          }
          return processedPose;
        }
      } catch (e) {
        console.error('Lỗi detectForVideo Pose:', e);
      }
    }
    return null;
  }

  onPoseDetected(callback) {
    this.callbacks.push(callback);
  }

  processLandmarks(landmarks) {
    if (!landmarks || landmarks.length < 33) return null;

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    
    // Thêm các điểm phụ để tính toán đầu khi đứng xa
    const nose = landmarks[0];
    const leftEye = landmarks[2];
    const rightEye = landmarks[5];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];

    // Chỉ dùng điểm có visibility đủ cao. Không suy đoán thân người khi camera
    // chỉ thấy cận cảnh phần vai: suy đoán đó khiến áo bị phóng đại như ảnh lỗi.
    // tasks-vision trả về {x, y, z, visibility}
    if (!leftShoulder || !rightShoulder || leftShoulder.visibility < 0.55 || rightShoulder.visibility < 0.55) return null;

    const midShoulder = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
      z: (leftShoulder.z + rightShoulder.z) / 2
    };

    const dx = rightShoulder.x - leftShoulder.x;
    const dy = rightShoulder.y - leftShoulder.y;
    const shoulderWidth = Math.sqrt(dx * dx + dy * dy);

    // Xử lý Hips bị khuất (khi ngồi/đứng gần)
    let torsoHeight = 0.5; // Giá trị mặc định (normalized)
    let midHip = { x: midShoulder.x, y: midShoulder.y + torsoHeight };

    // Kiểm tra xem hip có thực sự tồn tại và đủ tin cậy (visibility > 0.5)
    const hasReliableTorso = leftHip && rightHip && leftHip.visibility > 0.55 && rightHip.visibility > 0.55;
    if (hasReliableTorso) {
      midHip = {
        x: (leftHip.x + rightHip.x) / 2,
        y: (leftHip.y + rightHip.y) / 2
      };
      const torsoDx = midHip.x - midShoulder.x;
      const torsoDy = midHip.y - midShoulder.y;
      torsoHeight = Math.sqrt(torsoDx * torsoDx + torsoDy * torsoDy);
      
      // Giới hạn max torsoHeight để tránh spike
      if (torsoHeight > 0.85 || torsoHeight < 0.08) return null;
    } else {
      // Ước lượng torsoHeight bằng khoảng 2-2.5 lần shoulderWidth nếu mất Hip
      torsoHeight = shoulderWidth * 2.2;
      midHip = { x: midShoulder.x, y: midShoulder.y + torsoHeight };
    }

    // Đường vai không có chiều. Chuẩn hóa về ±90° để không quay áo 180°.
    const rawRoll = Math.atan2(dy, dx);
    const shoulderRollRad = rawRoll > Math.PI / 2
      ? rawRoll - Math.PI
      : rawRoll < -Math.PI / 2
        ? rawRoll + Math.PI
        : rawRoll;

    // Tính Yaw (xoay ngang) dựa trên trục Z của 2 vai
    const dz = rightShoulder.z - leftShoulder.z;
    // dx đã tính ở trên. dz và dx ở cùng hệ toạ độ tương đối.
    // Nếu dz dương, vai phải xa hơn vai trái -> người xoay sang trái màn hình.
    const shoulderYawRad = Math.atan2(dz, dx);

    return {
      raw: landmarks,
      leftShoulder,
      rightShoulder,
      leftHip,
      rightHip,
      nose,
      leftEye,
      rightEye,
      leftEar,
      rightEar,
      midShoulder,
      midHip,
      shoulderWidth,
      torsoHeight,
      shoulderRollRad,
      shoulderYawRad,
      hasReliableTorso
    };
  }

  dispose() {
    if (this.landmarker) {
      this.landmarker.close();
      this.landmarker = null;
    }
    this.callbacks = [];
    this.isInitialized = false;
  }
}
