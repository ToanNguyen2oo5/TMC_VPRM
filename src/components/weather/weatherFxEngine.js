/**
 * WeatherFX Engine
 * Mô phỏng hiệu ứng thời tiết thực tế dựa trên weather-fx_1.html:
 * - Nắng (sunny): Nền trời xanh rạng rỡ, 14 tia nắng xoay chậm quanh tâm, quầng sáng radial mặt trời, mây trôi bồng bềnh
 * - Nhiều mây (cloudy): Bầu trời u buồn, mây bạc nhiều lớp trôi chậm
 * - Mưa (rain): Bầu trời u tối, 120-200 vệt mưa rơi nghiêng theo vận tốc
 * - Dông bão (storm): Bầu trời xám đen đe dọa, mưa mau hạt, sấm sét chớp sáng ngẫu nhiên rực bầu trời
 * - Tuyết (snow): Bầu trời băng giá se lạnh, bông tuyết chao lượn hình sin rơi nhẹ
 * - Đêm sao (night): Bầu trời đêm huyền ảo, mặt trăng toả quầng sáng dịu, 90-120 ngôi sao lấp lánh tuần hoàn
 */

export const WEATHER_FX_SCENES = {
  sunny: {
    id: 'sunny',
    nameVi: 'Trời quang nắng đẹp',
    nameEn: 'Sunny & Clear',
    icon: '☀️',
    sky: ['#1a6ab5', '#6cbbf2'],
    clouds: { n: 6, a: 0.55, c: '255,255,255' },
    hasSun: true,
    rain: 0,
    snow: 0,
    stars: 0,
    lightning: false
  },
  cloudy: {
    id: 'cloudy',
    nameVi: 'Nhiều mây dịu mát',
    nameEn: 'Partly / Overcast Cloudy',
    icon: '☁️',
    sky: ['#435467', '#8395a7'],
    clouds: { n: 10, a: 0.7, c: '235,240,245' },
    hasSun: false,
    rain: 0,
    snow: 0,
    stars: 0,
    lightning: false
  },
  rain: {
    id: 'rain',
    nameVi: 'Có mưa rơi',
    nameEn: 'Rainy',
    icon: '🌧️',
    sky: ['#202934', '#3f4f5f'],
    clouds: { n: 10, a: 0.75, c: '120,132,145' },
    hasSun: false,
    rain: 180,
    snow: 0,
    stars: 0,
    lightning: false
  },
  storm: {
    id: 'storm',
    nameVi: 'Mưa dông & Sấm chớp',
    nameEn: 'Thunderstorm',
    icon: '⛈️',
    sky: ['#13171d', '#27323f'],
    clouds: { n: 12, a: 0.85, c: '80,90,102' },
    hasSun: false,
    rain: 280,
    snow: 0,
    stars: 0,
    lightning: true
  },
  snow: {
    id: 'snow',
    nameVi: 'Có tuyết rơi',
    nameEn: 'Snowy',
    icon: '❄️',
    sky: ['#4b5e72', '#94a7b9'],
    clouds: { n: 8, a: 0.6, c: '230,236,242' },
    hasSun: false,
    rain: 0,
    snow: 110,
    stars: 0,
    lightning: false
  },
  night: {
    id: 'night',
    nameVi: 'Đêm sao quang đãng',
    nameEn: 'Clear Starry Night',
    icon: '🌙',
    sky: ['#06091a', '#18224d'],
    clouds: { n: 4, a: 0.25, c: '120,140,200' },
    hasSun: false,
    hasMoon: true,
    rain: 0,
    snow: 0,
    stars: 100,
    lightning: false
  }
};

export class WeatherFXEngine {
  constructor(canvas, options = {}) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.isFullScreen = options.isFullScreen ?? false;
    this.isReducedMotion = options.isReducedMotion ?? false;
    this.type = options.initialScene || 'sunny';
    this.t = 0;
    this.flash = 0;
    this.nextFlash = 120 + Math.random() * 200;
    this.isRunning = false;
    this.animId = null;

    this.clouds = [];
    this.drops = [];
    this.flakes = [];
    this.stars = [];

    this.resize();
    this.build();
    this.start();
  }

  resize() {
    if (!this.cv) return;
    const parent = this.cv.parentElement;
    const w = this.isFullScreen ? window.innerWidth : (parent ? parent.clientWidth : this.cv.clientWidth) || 800;
    const h = this.isFullScreen ? window.innerHeight : (parent ? parent.clientHeight : this.cv.clientHeight) || 300;

    const dpr = Math.min(window.devicePixelRatio || 1, this.isFullScreen ? 1.5 : 2);
    this.w = w;
    this.h = h;
    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    this.cv.style.width = w + 'px';
    this.cv.style.height = h + 'px';

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.type) this.build();
  }

  setReducedMotion(reduced) {
    this.isReducedMotion = !!reduced;
  }

  setScene(type) {
    if (!WEATHER_FX_SCENES[type] || type === this.type) return;
    this.cv.style.opacity = '0';
    setTimeout(() => {
      this.type = type;
      this.build();
      this.cv.style.opacity = '1';
    }, 240);
  }

  build() {
    const s = WEATHER_FX_SCENES[this.type] || WEATHER_FX_SCENES.sunny;
    const R = Math.random;
    const { w, h } = this;
    this.s = s;

    // Scale counts for card vs fullscreen
    const scale = this.isFullScreen ? 1.2 : 0.8;
    const rainCount = Math.round((s.rain || 0) * (this.isReducedMotion ? 0.4 : scale));
    const snowCount = Math.round((s.snow || 0) * (this.isReducedMotion ? 0.4 : scale));
    const starCount = Math.round((s.stars || 0) * scale);
    const cloudCount = Math.max(3, Math.round(s.clouds.n * (this.isReducedMotion ? 0.6 : 1)));

    const maxCloudR = this.isFullScreen ? 140 : 80;
    const minCloudR = this.isFullScreen ? 60 : 40;

    this.clouds = Array.from({ length: cloudCount }, () => ({
      x: R() * w * 1.4 - w * 0.2,
      y: R() * h * 0.6,
      r: minCloudR + R() * (maxCloudR - minCloudR),
      v: (0.1 + R() * 0.25) * (this.isReducedMotion ? 0.4 : 1),
      p: R() * 6
    }));

    this.drops = Array.from({ length: rainCount }, () => ({
      x: R() * (w + 100) - 50,
      y: R() * h,
      l: 12 + R() * 18,
      v: 9 + R() * 8
    }));

    this.flakes = Array.from({ length: snowCount }, () => ({
      x: R() * w,
      y: R() * h,
      r: 1.2 + R() * 2.8,
      v: 0.5 + R() * 1.2,
      p: R() * 6
    }));

    this.stars = Array.from({ length: starCount }, () => ({
      x: R() * w,
      y: R() * h * 0.85,
      r: 0.5 + R() * 1.4,
      p: R() * 6
    }));
  }

  draw() {
    if (!this.s || !this.ctx) return;
    const { ctx: c, w, h, s } = this;
    this.t += this.isReducedMotion ? 0.008 : 0.016;

    // Nền trời chuyển sắc gradient
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, s.sky[0]);
    g.addColorStop(1, s.sky[1]);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);

    if (this.type === 'sunny') this.drawSun();
    if (this.type === 'night') this.drawMoonStars();
    this.drawClouds();
    if (this.drops.length > 0) this.drawRain();
    if (this.flakes.length > 0) this.drawSnow();
    if (s.lightning) this.drawLightning();
  }

  drawSun() {
    const c = this.ctx;
    const x = this.w * (this.isFullScreen ? 0.16 : 0.14);
    const y = Math.min(this.h * 0.28, 260);
    const p = 1 + Math.sin(this.t * 1.2) * 0.06;
    const rayLen = Math.max(this.w, this.h) * 0.75;

    // Tia nắng xoay chậm
    if (!this.isReducedMotion) {
      c.save();
      c.translate(x, y);
      c.rotate(this.t * 0.06);
      for (let i = 0; i < 14; i++) {
        c.rotate((Math.PI * 2) / 14);
        const rg = c.createLinearGradient(0, 0, 0, rayLen);
        rg.addColorStop(0, 'rgba(255, 240, 180, 0.26)');
        rg.addColorStop(1, 'rgba(255, 240, 180, 0)');
        c.fillStyle = rg;
        c.beginPath();
        c.moveTo(-7, 0);
        c.lineTo(7, 0);
        c.lineTo(40, rayLen);
        c.lineTo(-40, rayLen);
        c.fill();
      }
      c.restore();
    }

    // Quầng sáng mặt trời radial
    const rg = c.createRadialGradient(x, y, 0, x, y, (this.isFullScreen ? 180 : 130) * p);
    rg.addColorStop(0, 'rgba(255, 252, 225, 1)');
    rg.addColorStop(0.18, 'rgba(255, 235, 150, 0.9)');
    rg.addColorStop(0.5, 'rgba(255, 210, 100, 0.25)');
    rg.addColorStop(1, 'rgba(255, 200, 80, 0)');
    c.fillStyle = rg;
    c.fillRect(0, 0, this.w, this.h);
  }

  drawMoonStars() {
    const c = this.ctx;

    // Các ngôi sao lấp lánh
    for (const s of this.stars) {
      c.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 1.3 + s.p));
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      c.fill();
    }
    c.globalAlpha = 1;

    // Mặt trăng toả quầng sáng
    const x = this.w * (this.isFullScreen ? 0.84 : 0.85);
    const y = Math.min(this.h * 0.28, 220);
    const rg = c.createRadialGradient(x, y, 0, x, y, this.isFullScreen ? 90 : 65);
    rg.addColorStop(0, 'rgba(255, 255, 235, 1)');
    rg.addColorStop(0.3, 'rgba(240, 240, 210, 0.9)');
    rg.addColorStop(0.4, 'rgba(200, 210, 255, 0.25)');
    rg.addColorStop(1, 'rgba(200, 210, 255, 0)');
    c.fillStyle = rg;
    c.fillRect(x - 100, y - 100, 200, 200);
  }

  drawClouds() {
    const c = this.ctx;
    const { a, c: col } = this.s.clouds;

    for (const k of this.clouds) {
      k.x += k.v;
      if (k.x - k.r * 2 > this.w) k.x = -k.r * 2;

      // Mỗi đám mây gồm 4 vệt tròn mờ đan xen
      for (let i = 0; i < 4; i++) {
        const cx = k.x + i * k.r * 0.55;
        const cy = k.y + Math.sin(this.t * 0.4 + k.p + i) * 6;
        const r = k.r * (1 - i * 0.08);
        const rg = c.createRadialGradient(cx, cy, 0, cx, cy, r);
        rg.addColorStop(0, `rgba(${col},${a * 0.55})`);
        rg.addColorStop(1, `rgba(${col},0)`);
        c.fillStyle = rg;
        c.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    }
  }

  drawRain() {
    const c = this.ctx;
    c.strokeStyle = 'rgba(200, 220, 255, 0.45)';
    c.lineWidth = this.isFullScreen ? 1.4 : 1.2;
    c.beginPath();

    for (const d of this.drops) {
      c.moveTo(d.x, d.y);
      c.lineTo(d.x - d.l * 0.2, d.y + d.l);
      d.y += d.v;
      d.x -= d.v * 0.2;
      if (d.y > this.h) {
        d.y = -20;
        d.x = Math.random() * (this.w + 80);
      }
    }
    c.stroke();
  }

  drawSnow() {
    const c = this.ctx;
    c.fillStyle = 'rgba(255, 255, 255, 0.9)';

    for (const f of this.flakes) {
      f.y += f.v;
      f.x += Math.sin(this.t + f.p) * 0.6;
      if (f.y > this.h) {
        f.y = -5;
        f.x = Math.random() * this.w;
      }
      c.beginPath();
      c.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      c.fill();
    }
  }

  drawLightning() {
    if (--this.nextFlash <= 0) {
      this.flash = 1;
      this.nextFlash = 140 + Math.random() * 320;
    }
    if (this.flash > 0.01) {
      this.ctx.fillStyle = `rgba(220, 230, 255, ${this.flash * 0.6})`;
      this.ctx.fillRect(0, 0, this.w, this.h);
      this.flash *= 0.88;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      if (!this.isRunning) return;
      this.draw();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  destroy() {
    this.stop();
    this.clouds = [];
    this.drops = [];
    this.flakes = [];
    this.stars = [];
  }
}
