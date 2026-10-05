import * as PIXI from 'pixi.js';

/**
 * WebGL Costume Renderer using PixiJS for Mesh Deformation
 */
export class WebGLCostumeRenderer {
  constructor() {
    this.app = new PIXI.Application();
    
    this.mesh = null;
    this.texture = null;
    this.currentOutfitId = null;
    this.isReady = false;
    
    // Create a 8x12 grid mesh
    this.cols = 8;
    this.rows = 12;
  }

  async init() {
    await this.app.init({
      backgroundAlpha: 0,
      width: 1280,
      height: 720,
      resolution: window.devicePixelRatio || 1,
    });
    this.isReady = true;
  }

  resize(width, height) {
    if (this.app && this.app.renderer) {
      this.app.renderer.resize(width, height);
    }
  }

  async loadOutfit(config) {
    if (!config || !config.image || !this.isReady) return null;
    
    // Ngăn chặn gọi load nhiều lần cho cùng 1 config.id
    if (this.currentOutfitId === config.id) return this.texture;
    this.currentOutfitId = config.id;

    try {
      this.texture = await PIXI.Assets.load(config.image);
      
      if (this.mesh) {
        this.app.stage.removeChild(this.mesh);
        this.mesh.destroy();
      }

      const uvs = new Float32Array((this.cols + 1) * (this.rows + 1) * 2);
      const indices = new Uint32Array(this.cols * this.rows * 6);
      
      let index = 0;
      for (let i = 0; i <= this.cols; i++) {
        for (let j = 0; j <= this.rows; j++) {
          uvs[index * 2] = i / this.cols;
          uvs[index * 2 + 1] = j / this.rows;
          index++;
        }
      }

      let indicesIndex = 0;
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          const a = i * (this.rows + 1) + j;
          const b = a + 1;
          const c = (i + 1) * (this.rows + 1) + j;
          const d = c + 1;

          indices[indicesIndex++] = a;
          indices[indicesIndex++] = b;
          indices[indicesIndex++] = c;
          indices[indicesIndex++] = b;
          indices[indicesIndex++] = c;
          indices[indicesIndex++] = d;
        }
      }

      this.mesh = new PIXI.MeshSimple({
          texture: this.texture,
          vertices: new Float32Array((this.cols + 1) * (this.rows + 1) * 2),
          uvs: uvs,
          indices: indices,
          topology: 'triangle-list'
      });

      this.app.stage.addChild(this.mesh);
      return this.texture;
    } catch (e) {
      console.error("Error loading texture:", e);
      return null;
    }
  }

  render(ctx, pose, config) {
    if (!pose || !config || !this.isReady) return;

    if (this.currentOutfitId !== config.id) {
        this.loadOutfit(config); // Async, but we don't wait here to avoid blocking render loop
        // If texture isn't ready, we draw placeholder text
        if (!this.mesh) {
            ctx.fillStyle = '#fff';
            ctx.font = '20px "Playfair Display"';
            ctx.textAlign = 'center';
            ctx.fillText('Đang tải trang phục chân thật...', pose.midShoulder.x * ctx.canvas.width, (pose.midShoulder.y + pose.torsoHeight/2) * ctx.canvas.height);
            return;
        }
    }

    if (!this.mesh) return;

    const canvasW = this.app.renderer.width;
    const canvasH = this.app.renderer.height;

    // Cập nhật kích thước canvas Pixi nếu canvas 2D thay đổi
    if (ctx.canvas.width !== canvasW || ctx.canvas.height !== canvasH) {
        this.resize(ctx.canvas.width, ctx.canvas.height);
    }

    const kps = config.keypoints || {
        shoulderL: config.shoulderL,
        shoulderR: config.shoulderR,
        neck: { x: (config.shoulderL.x + config.shoulderR.x) / 2, y: config.shoulderL.y - 0.1 },
        waist: { x: (config.shoulderL.x + config.shoulderR.x) / 2, y: config.hemY || 0.8 }
    };

    const shoulderL = { x: kps.shoulderL.x * this.texture.width, y: kps.shoulderL.y * this.texture.height };
    const shoulderR = { x: kps.shoulderR.x * this.texture.width, y: kps.shoulderR.y * this.texture.height };
    
    // Tỉ lệ scale thực tế
    const realShoulderW = pose.shoulderWidth * canvasW;
    const imgShoulderW = Math.abs(shoulderR.x - shoulderL.x);
    const scale = (realShoulderW * (config.widthScale || 1.1)) / imgShoulderW;

    // Mỏ neo ở giữa hai vai trên ảnh
    const imgMidX = (shoulderL.x + shoulderR.x) / 2;
    const imgMidY = (shoulderL.y + shoulderR.y) / 2;

    const realMidX = pose.midShoulder.x * canvasW;
    let realMidY = pose.midShoulder.y * canvasH;
    
    // Áp dụng dịch chuyển dọc (nếu có) để người dùng có thể tự chỉnh áo lên/xuống
    if (config.verticalOffset) {
        realMidY += config.verticalOffset * canvasH;
    }
    
    let index = 0;
    for (let i = 0; i <= this.cols; i++) {
      for (let j = 0; j <= this.rows; j++) {
        const u = i / this.cols;
        const v = j / this.rows;
        
        // Tọa độ pixel trong texture gốc
        const px = u * this.texture.width;
        const py = v * this.texture.height;

        // Vector từ mỏ neo
        const dx = px - imgMidX;
        const dy = py - imgMidY;

        // Rotate
        const cosAngle = Math.cos(pose.shoulderRollRad);
        const sinAngle = Math.sin(pose.shoulderRollRad);

        let rx = dx * cosAngle - dy * sinAngle;
        let ry = dx * sinAngle + dy * cosAngle;

        // Simple stretch (Nội suy mượt có thể áp dụng ở đây với Thin-Plate Spline)
        if (py > imgMidY) {
            // Phần bụng/tà áo: Kéo giãn theo chiều dọc
            const torsoImgH = (kps.waist.y - kps.neck.y) * this.texture.height;
            const torsoRealH = pose.torsoHeight * canvasH;
            const stretchY = torsoRealH / (torsoImgH || 1);
            ry *= stretchY;
        } else {
            ry *= scale; // Phần cổ/vai: Scale đều
        }
        rx *= scale;

        const vertices = this.mesh.vertices;
        vertices[index * 2] = realMidX + rx;
        vertices[index * 2 + 1] = realMidY + ry;
        index++;
      }
    }

    // Gán lại vertices để trigger setter của PixiJS (nếu cần thiết) hoặc nó đã tự động update
    // Render cảnh bằng WebGL
    this.app.renderer.render(this.app.stage);

    // Vẽ kết quả từ canvas WebGL lên canvas 2D chính
    if (this.app.canvas) {
        ctx.drawImage(this.app.canvas, 0, 0);
    } else {
        ctx.drawImage(this.app.view, 0, 0); // fallback v7
    }
  }
}
