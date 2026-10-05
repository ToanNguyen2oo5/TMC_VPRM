/**
 * MediaPipe FaceLandmarker Tracker (FaceTracker.js)
 * Tải model FaceLandmarker từ @mediapipe/tasks-vision
 * Thử GPU delegate trước, nếu lỗi WebGL tự động fallback sang CPU
 * Tải model local (/models/face_landmarker.task) với cơ chế fallback CDN
 */

import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

const LOCAL_WASM_PATH = '/wasm';
const CDN_WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';

const LOCAL_MODEL_PATH = '/models/face_landmarker.task';
const CDN_MODEL_PATH = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export class FaceTracker {
  constructor() {
    this.landmarker = null;
    this.isLoading = false;
    this.lastTimestamp = -1;
    this.lastVideoTime = -1;
    this.activeDelegate = 'GPU';
  }

  /**
   * Khởi tạo FaceLandmarker
   */
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
      return await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: delegate
        },
        outputFaceBlendshapes: false,
        runningMode: 'VIDEO',
        numFaces: 1
      });
    };

    let modelPath = LOCAL_MODEL_PATH;
    try {
      this.landmarker = await createWithDelegate('GPU', modelPath);
      this.activeDelegate = 'GPU';
      console.info('🚀 MediaPipe FaceLandmarker khởi tạo thành công với [GPU]');
    } catch (gpuError) {
      console.warn('⚠️ Lỗi khởi tạo GPU delegate, đang thử lại với [CPU]:', gpuError.message);
      try {
        this.landmarker = await createWithDelegate('CPU', modelPath);
        this.activeDelegate = 'CPU';
        console.info('✅ MediaPipe FaceLandmarker khởi tạo thành công với [CPU]');
      } catch (cpuError) {
        console.warn('⚠️ Lỗi model local, chuyển sang CDN fallback:', cpuError.message);
        modelPath = CDN_MODEL_PATH;
        try {
          this.landmarker = await createWithDelegate('GPU', modelPath);
          this.activeDelegate = 'GPU';
        } catch {
          this.landmarker = await createWithDelegate('CPU', modelPath);
          this.activeDelegate = 'CPU';
        }
      }
    }

    this.isLoading = false;
    return this.landmarker;
  }

  /**
   * Nhận diện landmarks từ frame video hiện tại
   * @param {HTMLVideoElement} video
   * @param {number} timestamp - timestamp dạng ms
   * @returns {Array<{x, y, z}>|null}
   */
  detect(video, timestamp) {
    if (!this.landmarker || !video || video.readyState < 2) {
      return null;
    }

    // Đảm bảo video đã có frame mới
    if (video.currentTime === this.lastVideoTime) {
      return null;
    }
    this.lastVideoTime = video.currentTime;

    // Đảm bảo timestamp truyền vào MediaPipe luôn tăng dần
    let safeTimestamp = Math.round(timestamp);
    if (safeTimestamp <= this.lastTimestamp) {
      safeTimestamp = this.lastTimestamp + 1;
    }
    this.lastTimestamp = safeTimestamp;

    try {
      const results = this.landmarker.detectForVideo(video, safeTimestamp);
      if (results && results.faceLandmarks && results.faceLandmarks.length > 0) {
        // Lấy mặt đầu tiên / lớn nhất
        return results.faceLandmarks[0];
      }
    } catch (err) {
      console.warn('Lỗi detectForVideo:', err);
    }

    return null;
  }

  /**
   * Dọn dẹp tài nguyên
   */
  dispose() {
    if (this.landmarker) {
      try {
        this.landmarker.close();
      } catch (e) {
        // ignore
      }
      this.landmarker = null;
    }
    this.lastTimestamp = -1;
    this.lastVideoTime = -1;
  }
}
