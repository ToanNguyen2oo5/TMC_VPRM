/**
 * Smoothing Filter (smoothing.js)
 * Bộ lọc làm mượt chuyển động khử rung giật (jitter) cho vị trí, scale và góc xoay
 * Sử dụng thuật toán EMA thích ứng (Adaptive Exponential Moving Average)
 */

export class PoseSmoother {
  constructor(options = {}) {
    // Alpha cơ bản: số càng nhỏ càng mượt (0.15 - 0.35)
    this.posAlpha = options.posAlpha ?? 0.28;
    this.scaleAlpha = options.scaleAlpha ?? 0.25;
    this.rotAlpha = options.rotAlpha ?? 0.22;
    this.prevPose = null;
  }

  reset() {
    this.prevPose = null;
  }

  /**
   * Làm mượt góc xoay radian để tránh hiện tượng giật khi quay qua biên PI / -PI
   */
  smoothAngle(prevAngle, targetAngle, alpha) {
    let diff = targetAngle - prevAngle;
    // Chuẩn hóa chênh lệch về khoảng [-PI, PI]
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    return prevAngle + diff * alpha;
  }

  /**
   * Cập nhật pose mới và trả về pose đã được làm mượt
   * @param {object} newPose - Pose từ estimateHeadPose
   * @returns {object} Smoothed pose
   */
  update(newPose) {
    if (!newPose) {
      return null;
    }

    if (!this.prevPose) {
      this.prevPose = { ...newPose };
      return this.prevPose;
    }

    const prev = this.prevPose;

    // Tính toán khoảng cách dịch chuyển để tự động tăng alpha khi đầu di chuyển nhanh
    const moveDist = Math.hypot(newPose.centerX - prev.centerX, newPose.centerY - prev.centerY);
    const speedBoost = Math.min(0.4, moveDist / 60); // Nếu cử động nhanh, tăng độ nhạy phản hồi
    const effectivePosAlpha = Math.min(0.85, this.posAlpha + speedBoost);

    // 1. Làm mượt vị trí tâm và đỉnh đầu
    const smoothedCenterX = prev.centerX + (newPose.centerX - prev.centerX) * effectivePosAlpha;
    const smoothedCenterY = prev.centerY + (newPose.centerY - prev.centerY) * effectivePosAlpha;
    const smoothedTopX = prev.topHead.x + (newPose.topHead.x - prev.topHead.x) * effectivePosAlpha;
    const smoothedTopY = prev.topHead.y + (newPose.topHead.y - prev.topHead.y) * effectivePosAlpha;
    const smoothedForeheadX = prev.forehead.x + (newPose.forehead.x - prev.forehead.x) * effectivePosAlpha;
    const smoothedForeheadY = prev.forehead.y + (newPose.forehead.y - prev.forehead.y) * effectivePosAlpha;

    // 2. Làm mượt kích thước khuôn mặt
    const smoothedWidth = prev.headWidth + (newPose.headWidth - prev.headWidth) * this.scaleAlpha;
    const smoothedHeight = prev.headHeight + (newPose.headHeight - prev.headHeight) * this.scaleAlpha;

    // 3. Làm mượt góc nghiêng Roll
    const smoothedRoll = this.smoothAngle(prev.rollRad, newPose.rollRad, this.rotAlpha);

    this.prevPose = {
      ...newPose,
      centerX: smoothedCenterX,
      centerY: smoothedCenterY,
      headWidth: smoothedWidth,
      headHeight: smoothedHeight,
      rollRad: smoothedRoll,
      forehead: { x: smoothedForeheadX, y: smoothedForeheadY },
      topHead: { x: smoothedTopX, y: smoothedTopY }
    };

    return this.prevPose;
  }
}
