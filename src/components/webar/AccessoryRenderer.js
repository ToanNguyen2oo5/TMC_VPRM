/**
 * Accessory Renderer (AccessoryRenderer.js)
 * Vẽ phụ kiện lên Canvas 2D theo góc nghiêng, vị trí neo và kích thước đầu
 * Hỗ trợ bộ nhớ đệm ảnh (Image cache), làm mượt khi mất mặt (fade-out 300ms) và vẽ Debug Overlay
 */

export class AccessoryRenderer {
  constructor() {
    this.imageCache = new Map();
    this.lastVisiblePose = null;
    this.lastVisibleTime = 0;
    this.currentOpacity = 0;
    this.fadeDurationMs = 300; // Giữ vị trí cũ và mờ dần trong 300ms
  }

  /**
   * Tải trước ảnh phụ kiện vào bộ nhớ cache
   * @param {object} accessoryConfig
   * @returns {HTMLImageElement}
   */
  getOrLoadImage(accessoryConfig) {
    if (!accessoryConfig || !accessoryConfig.image) return null;

    if (this.imageCache.has(accessoryConfig.id)) {
      return this.imageCache.get(accessoryConfig.id);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = accessoryConfig.image;
    this.imageCache.set(accessoryConfig.id, img);
    return img;
  }

  /**
   * Render phụ kiện lên Canvas 2D
   * @param {CanvasRenderingContext2D} ctx
   * @param {object|null} pose - Head pose (đã được làm mượt)
   * @param {object} accessoryConfig - Cấu hình phụ kiện từ accessoryConfigs
   * @param {number} timestamp - Thời gian hiện tại từ requestAnimationFrame
   * @param {boolean} isDebug - Bật/tắt chế độ debug landmarks
   */
  render(ctx, pose, accessoryConfig, timestamp, isDebug = false) {
    if (!ctx || !accessoryConfig) return;

    const img = this.getOrLoadImage(accessoryConfig);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    // 1. Quản lý trạng thái hiển thị & Fade-out khi mất mặt
    let activePose = pose;
    if (pose) {
      this.lastVisiblePose = pose;
      this.lastVisibleTime = timestamp;
      this.currentOpacity = Math.min(1, this.currentOpacity + 0.15); // Fade in nhanh
    } else if (this.lastVisiblePose && (timestamp - this.lastVisibleTime) < this.fadeDurationMs) {
      // Giữ vị trí cũ trong ~300ms và giảm dần opacity
      const elapsed = timestamp - this.lastVisibleTime;
      this.currentOpacity = Math.max(0, 1 - (elapsed / this.fadeDurationMs));
      activePose = this.lastVisiblePose;
    } else {
      this.currentOpacity = 0;
      this.lastVisiblePose = null;
    }

    if (!activePose || this.currentOpacity <= 0.01) {
      return;
    }

    // 2. Tính toán kích thước phụ kiện dựa trên độ rộng khuôn mặt và tỉ lệ ảnh
    const targetWidth = activePose.headWidth * accessoryConfig.scale;
    const aspect = img.naturalHeight / img.naturalWidth;
    const targetHeight = targetWidth * aspect;

    // 3. Tính toán vị trí neo (Anchor Position)
    // Neo theo đỉnh trán (forehead) kết hợp offset cấu hình
    const roll = activePose.rollRad + (accessoryConfig.rotationOffset || 0);

    const offX = (accessoryConfig.offsetX || 0) * activePose.headWidth;
    const offY = (accessoryConfig.offsetY || 0) * activePose.headHeight;

    const anchorBaseX = activePose.forehead.x;
    const anchorBaseY = activePose.forehead.y;

    // 4. Vẽ ảnh phụ kiện lên Canvas với biến đổi ma trận chuẩn xác
    ctx.save();
    ctx.globalAlpha = this.currentOpacity;
    
    // Đưa gốc tọa độ về điểm trán
    ctx.translate(anchorBaseX, anchorBaseY);
    // Quay theo góc nghiêng của đầu
    ctx.rotate(roll);
    // Tịnh tiến theo offset (âm là đi lên đỉnh đầu, dương là xuống cằm)
    ctx.translate(offX, offY);

    const anchorPixelX = (accessoryConfig.anchorX ?? 0.5) * targetWidth;
    const anchorPixelY = (accessoryConfig.anchorY ?? 0.8) * targetHeight;

    ctx.drawImage(
      img,
      -anchorPixelX,
      -anchorPixelY,
      targetWidth,
      targetHeight
    );
    ctx.restore();

    // 5. Nếu bật chế độ Debug: Vẽ các điểm landmarks và khung neo
    if (isDebug && pose) {
      // Phục hồi lại tọa độ gốc để truyền posX, posY thật cho hàm renderDebug
      const posX = anchorBaseX + offX * Math.cos(roll) - offY * Math.sin(roll);
      const posY = anchorBaseY + offX * Math.sin(roll) + offY * Math.cos(roll);
      this.renderDebug(ctx, pose, posX, posY, targetWidth, targetHeight);
    }
  }

  /**
   * Vẽ lớp phủ kiểm tra kỹ thuật (Debug Overlay)
   */
  renderDebug(ctx, pose, anchorX, anchorY, targetWidth, targetHeight) {
    ctx.save();

    // Điểm neo phụ kiện (Vàng sáng)
    ctx.fillStyle = '#ffea00';
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Trán (Xanh lục)
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(pose.forehead.x, pose.forehead.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Đỉnh đầu ước lượng (Đỏ son)
    ctx.fillStyle = '#ff3366';
    ctx.beginPath();
    ctx.arc(pose.topHead.x, pose.topHead.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Trục mắt (Đường nối hai khóe mắt)
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pose.leftEye.x, pose.leftEye.y);
    ctx.lineTo(pose.rightEye.x, pose.rightEye.y);
    ctx.stroke();

    // Bề rộng hai má
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pose.leftCheek.x, pose.leftCheek.y);
    ctx.lineTo(pose.rightCheek.x, pose.rightCheek.y);
    ctx.stroke();

    ctx.restore();
  }
}
