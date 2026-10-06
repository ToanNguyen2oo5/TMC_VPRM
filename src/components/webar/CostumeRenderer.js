/**
 * Costume Renderer (CostumeRenderer.js)
 * Vẽ trang phục 2D lên thân hình (Body Pose) qua Canvas 2D
 */
export class CostumeRenderer {
  constructor() {
    this.imageCache = new Map();
    this.currentOpacity = 0;
  }

  getOrLoadImage(outfitConfig) {
    if (!outfitConfig || !outfitConfig.image) return null;

    if (this.imageCache.has(outfitConfig.id)) {
      return this.imageCache.get(outfitConfig.id);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = outfitConfig.image;
    this.imageCache.set(outfitConfig.id, img);
    return img;
  }

  render(ctx, pose, config, _timestamp) {
    if (!ctx || !pose || !config || !pose.hasReliableTorso) {
      this.currentOpacity = Math.max(0, this.currentOpacity - 0.1);
      if (this.currentOpacity <= 0) return;
    } else {
      this.currentOpacity = Math.min(1, this.currentOpacity + 0.1);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    
    // Fade out when turning too much (yaw > 45 degrees)
    let yawFactor = 1;
    let yawFade = 1;
    if (pose && pose.shoulderYawRad !== undefined) {
      const absYaw = Math.abs(pose.shoulderYawRad);
      yawFactor = Math.cos(pose.shoulderYawRad); // Squeeze horizontally
      if (absYaw > Math.PI / 3.5) {
        yawFade = Math.max(0, 1 - (absYaw - Math.PI / 3.5) * 2);
      }
    }
    
    ctx.globalAlpha = this.currentOpacity * yawFade;

    const img = this.getOrLoadImage(config);
    if (img && img.complete && img.naturalWidth > 0 && pose) {
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      
      const pxX = pose.midShoulder.x * canvasWidth;
      const pxY = pose.midShoulder.y * canvasHeight;
      const shoulderPixelW = pose.shoulderWidth * canvasWidth;
      const torsoPixelH = pose.torsoHeight * canvasHeight;

      // Tính tỷ lệ scale dựa trên config tham chiếu
      let scaleX = 1;
      let scaleY = 1;
      const kps = config.keypoints || config;
      let imgMidX = img.naturalWidth / 2;
      let imgMidY = img.naturalHeight * 0.2;

      if (kps.shoulderL && kps.shoulderR) {
        // Khoảng cách vai trên ảnh (pixel)
        const imgShoulderDx = Math.abs(kps.shoulderR.x - kps.shoulderL.x) * img.naturalWidth;
        // Scale ngang để vai trên ảnh khớp vai thật (kèm widthScale)
        const wScale = config.widthScale || 1.0;
        scaleX = (shoulderPixelW * wScale) / (imgShoulderDx || 1);

        // Tâm vai trên ảnh
        imgMidX = ((kps.shoulderL.x + kps.shoulderR.x) / 2) * img.naturalWidth;
        imgMidY = ((kps.shoulderL.y + kps.shoulderR.y) / 2) * img.naturalHeight;

        // Căn riêng theo chiều cao thân, thay vì phóng đều toàn ảnh. Điều này giữ
        // cổ áo bám vai và hạn chế tà áo giãn bất thường khi người dùng di chuyển.
        const hemY = kps.hem?.y ?? kps.waist?.y ?? config.hemY;
        if (hemY) {
          const imgTorsoH = (hemY - ((kps.shoulderL.y + kps.shoulderR.y) / 2)) * img.naturalHeight;
          const coverage = config.bodyHeightScale || (config.category === 'dress' ? 2.35 : 1.05);
          scaleY = (torsoPixelH * coverage) / (imgTorsoH || 1);
        } else {
          // Giữ nguyên tỷ lệ ảnh nếu không có cấu hình chiều cao
          scaleY = scaleX;
        }
      } else {
        // Fallback an toàn cho asset cũ không có keypoint.
        scaleX = (shoulderPixelW * 1.2) / img.naturalWidth;
        scaleY = scaleX;
      }

      // Apply yaw squeeze
      scaleX *= Math.max(0.4, Math.abs(yawFactor));

      ctx.translate(pxX, pxY);
      ctx.rotate(pose.shoulderRollRad);

      const targetW = img.naturalWidth * scaleX;
      const targetH = img.naturalHeight * scaleY;
      
      const drawX = -imgMidX * scaleX + (config.offsetX || 0) * targetW;
      const drawY = -imgMidY * scaleY + (config.offsetY || 0) * targetH;

      ctx.drawImage(img, drawX, drawY, targetW, targetH);
    } else {
        // Mock fallback text
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Playfair Display"';
        ctx.textAlign = 'center';
        ctx.fillText('Đang tải trang phục...', pose.midShoulder.x * ctx.canvas.width, (pose.midShoulder.y + pose.torsoHeight/2) * ctx.canvas.height);
    }

    ctx.restore();
  }
}
