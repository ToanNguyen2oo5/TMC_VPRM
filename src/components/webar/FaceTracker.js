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
   * Khởi tạo FaceLandmarker với cơ chế fallback đa tầng
   */
  async init() {
    if (this.landmarker) return this.landmarker;
    if (this.isLoading) return null;

    this.isLoading = true;

    const createLandmarker = async (visionResolver, delegate, modelPath) => {
      return await FaceLandmarker.createFromOptions(visionResolver, {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: delegate
        },
        outputFaceBlendshapes: false,
        runningMode: 'VIDEO',
        numFaces: 1
      });
    };

    try {
      // 1. Thử tải với local WASM & local model
      try {
        const localVision = await FilesetResolver.forVisionTasks(LOCAL_WASM_PATH);
        try {
          this.landmarker = await createLandmarker(localVision, 'GPU', LOCAL_MODEL_PATH);
          this.activeDelegate = 'GPU';
          console.info('🚀 MediaPipe FaceLandmarker khởi tạo thành công với [GPU]');
        } catch (gpuErr) {
          console.warn('⚠️ FaceLandmarker GPU local không thành công, thử [CPU]:', gpuErr?.message || gpuErr);
          this.landmarker = await createLandmarker(localVision, 'CPU', LOCAL_MODEL_PATH);
          this.activeDelegate = 'CPU';
          console.info('✅ MediaPipe FaceLandmarker khởi tạo thành công với [CPU]');
        }
      } catch (localErr) {
        console.warn('⚠️ Thử FaceLandmarker local thất bại, chuyển sang CDN:', localErr?.message || localErr);
        // 2. Fallback hoàn toàn sang CDN (cả WASM lẫn model)
        const cdnVision = await FilesetResolver.forVisionTasks(CDN_WASM_PATH);
        try {
          this.landmarker = await createLandmarker(cdnVision, 'GPU', CDN_MODEL_PATH);
          this.activeDelegate = 'GPU (CDN)';
          console.info('🚀 MediaPipe FaceLandmarker khởi tạo thành công với [GPU (CDN)]');
        } catch (cdnGpuErr) {
          console.warn('⚠️ FaceLandmarker CDN GPU thất bại, thử [CPU (CDN)]:', cdnGpuErr?.message || cdnGpuErr);
          this.landmarker = await createLandmarker(cdnVision, 'CPU', CDN_MODEL_PATH);
          this.activeDelegate = 'CPU (CDN)';
          console.info('✅ MediaPipe FaceLandmarker khởi tạo thành công với [CPU (CDN)]');
        }
      }
    } catch (finalErr) {
      console.error('❌ Không thể khởi tạo MediaPipe FaceLandmarker:', finalErr?.message || finalErr);
    } finally {
      this.isLoading = false;
    }

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
