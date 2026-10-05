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

  render(ctx, pose, outfitConfig, timestamp) {
    if (!ctx || !pose || !outfitConfig) return;

    ctx.save();
    
    const img = this.getOrLoadImage(outfitConfig);
    if (img && img.complete && img.naturalWidth > 0) {
      // Bounding box for mapping image
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      
      const pxX = pose.midShoulder.x * canvasWidth;
      const pxY = pose.midShoulder.y * canvasHeight;
      
      // Scale theo chiều rộng vai
      const shoulderPixelW = pose.shoulderWidth * canvasWidth;
      
      // Image scale factor (thường vai người rộng hơn cổ áo một chút)
      const scaleFactor = 2.0; 
      const targetW = shoulderPixelW * scaleFactor;
      const aspect = img.naturalHeight / img.naturalWidth;
      const targetH = targetW * aspect;

      ctx.translate(pxX, pxY);
      ctx.rotate(pose.shoulderRollRad);
      
      // Vẽ căn giữa ngực
      ctx.drawImage(img, -targetW/2, 0, targetW, targetH);
    } else {
        // Mock T-Shirt Label
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Playfair Display"';
        ctx.textAlign = 'center';
        ctx.fillText('Đang giả lập Trang phục...', pose.midShoulder.x * ctx.canvas.width, (pose.midShoulder.y + pose.torsoHeight/2) * ctx.canvas.height);
    }
    
    ctx.restore();
  }
}
