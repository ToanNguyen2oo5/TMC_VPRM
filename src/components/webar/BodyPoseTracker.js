import { Pose } from '@mediapipe/pose';

/**
 * BodyPoseTracker
 * Quản lý khởi tạo và xử lý MediaPipe Pose AI.
 */
export class BodyPoseTracker {
  constructor() {
    this.pose = null;
    this.isInitialized = false;
    this.callbacks = [];
  }

  async init() {
    if (this.isInitialized) return;

    this.pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    this.pose.setOptions({
      modelComplexity: 1, // 0 = nhanh, 1 = cân bằng, 2 = độ chính xác cao
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.pose.onResults(this.onResults.bind(this));
    this.isInitialized = true;
  }

  onResults(results) {
    // results.poseLandmarks là mảng 33 tọa độ (x, y, z, visibility)
    const processedPose = this.processLandmarks(results.poseLandmarks);
    this.callbacks.forEach(cb => cb(processedPose, results));
  }

  processLandmarks(landmarks) {
    if (!landmarks || landmarks.length < 33) return null;

    // Lấy các điểm quan trọng cho trang phục (vai, hông)
    // 11: vai trái, 12: vai phải
    // 23: hông trái, 24: hông phải
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null;

    // Tính điểm giữa vai (để làm neo gốc)
    const midShoulder = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
      z: (leftShoulder.z + rightShoulder.z) / 2
    };

    // Tính điểm giữa hông
    const midHip = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    // Chiều rộng vai thực tế trên màn hình (để scale trang phục)
    const dx = rightShoulder.x - leftShoulder.x;
    const dy = rightShoulder.y - leftShoulder.y;
    const shoulderWidth = Math.sqrt(dx * dx + dy * dy);

    // Chiều cao thân (để scale chiều dài áo)
    const torsoDx = midHip.x - midShoulder.x;
    const torsoDy = midHip.y - midShoulder.y;
    const torsoHeight = Math.sqrt(torsoDx * torsoDx + torsoDy * torsoDy);

    // Góc nghiêng của vai
    const shoulderRollRad = Math.atan2(dy, dx);

    return {
      raw: landmarks,
      leftShoulder,
      rightShoulder,
      leftHip,
      rightHip,
      midShoulder,
      midHip,
      shoulderWidth,
      torsoHeight,
      shoulderRollRad
    };
  }

  async send(imageElement) {
    if (!this.pose || !this.isInitialized) return;
    await this.pose.send({ image: imageElement });
  }

  onPoseDetected(callback) {
    this.callbacks.push(callback);
  }

  dispose() {
    if (this.pose) {
      this.pose.close();
      this.pose = null;
    }
    this.callbacks = [];
    this.isInitialized = false;
  }
}
