/**
 * WeatherFX Engine - Hệ thống mô phỏng thời tiết di sản Việt Nam
 * Tích hợp toàn diện các hiệu ứng tự nhiên & họa tiết truyền thống Đại Việt:
 * - Nắng (sunny / nang): Trời xanh rực rỡ, mặt trời 18 tia xoay, mây xoắn cổ truyền, đàn chim hạc bay lượn, lá vàng rơi
 * - Nhiều mây (cloudy / may): Trời dịu mát, mây đa tầng bồng bềnh, chim bay, mây xoắn
 * - Mưa (rain / mua): Mưa 2 tầng sâu nghiêng theo gió, gợn sóng nước chân trời, khóm lá sen dập dềnh
 * - Dông bão (storm / giong): Mưa lớn, sấm sét gãy khúc neon phát sáng, chớp sáng toàn màn hình
 * - Hoàng hôn (sunset / hoanghon): Trời cam tím rực rỡ, mặt trời lặn ấm áp, mây chiều hồng cam, sao sớm, chim bay về tổ, lá rơi
 * - Đêm sao (night / dem): Đêm tím than huyền bí, trăng sáng có hố crater, sao lấp lánh, sao băng vụt qua, đom đóm lập lòe
 * - Tuyết (snow): Tuyết trắng bồng bềnh chao liệng vùng núi cao
 * - Gió (wind) & Độ ẩm (humidity): Ảnh hưởng trực tiếp tới tốc độ mây, độ nghiêng hạt mưa, sương mù
 * - Hiệu ứng kính (glass): Giọt nước đọng và trượt dài trên mặt kính card thời tiết
 */

const R = Math.random;

function lerp(a, b, k) {
  return a + (b - a) * k;
}

function cl(v) {
  return Math.max(0, Math.min(1, v));
}

function rgb(a, al) {
  return `rgba(${Math.round(a[0])},${Math.round(a[1])},${Math.round(a[2])},${al == null ? 1 : al})`;
}

function createBaseState(o = {}) {
  const b = {
    top: [0, 0, 0],
    bot: [0, 0, 0],
    sun: 0,
    sx: 0.2,
    sy: 0.2,
    sc: [255, 236, 170],
    cloud: 0,
    cc: [255, 255, 255],
    swirl: 0,
    rain: 0,
    star: 0,
    bird: 0,
    bc: [255, 240, 200],
    fly: 0,
    bolt: 0,
    moon: 0,
    leaf: 0,
    snow: 0
  };
  return Object.assign(b, o);
}

// Bảng cấu hình các cảnh thời tiết
const SCENE_CONFIGS = {
  sunny: createBaseState({
    top: [40, 104, 186],
    bot: [132, 184, 230],
    sun: 1,
    cloud: 0.35,
    swirl: 0.35,
    bird: 1,
    leaf: 0.5,
    wind: 6,
    humidity: 55
  }),
  cloudy: createBaseState({
    top: [72, 92, 122],
    bot: [150, 164, 184],
    sun: 0.25,
    cloud: 1,
    cc: [238, 242, 248],
    swirl: 0.5,
    bird: 0.4,
    bc: [250, 250, 250],
    leaf: 0.25,
    wind: 8,
    humidity: 70
  }),
  rain: createBaseState({
    top: [34, 48, 70],
    bot: [86, 104, 128],
    sc: [200, 210, 230],
    cloud: 1,
    cc: [150, 162, 180],
    swirl: 0.15,
    rain: 0.85,
    wind: 12,
    humidity: 90
  }),
  storm: createBaseState({
    top: [16, 22, 40],
    bot: [50, 58, 82],
    sc: [200, 210, 230],
    cloud: 1,
    cc: [96, 106, 128],
    rain: 1,
    bolt: 1,
    wind: 24,
    humidity: 94
  }),
  sunset: createBaseState({
    top: [70, 58, 126],
    bot: [246, 150, 92],
    sun: 1,
    sx: 0.74,
    sy: 0.66,
    sc: [255, 176, 96],
    cloud: 0.45,
    cc: [255, 190, 150],
    swirl: 0.5,
    star: 0.12,
    bird: 1,
    bc: [52, 36, 70],
    leaf: 0.7,
    wind: 6,
    humidity: 60
  }),
  night: createBaseState({
    top: [7, 12, 32],
    bot: [26, 44, 88],
    sx: 0.74,
    sy: 0.66,
    cloud: 0.2,
    cc: [120, 140, 190],
    swirl: 0.1,
    star: 1,
    fly: 1,
    moon: 1,
    wind: 4,
    humidity: 75
  }),
  snow: createBaseState({
    top: [65, 84, 108],
    bot: [142, 160, 182],
    cloud: 0.65,
    cc: [230, 236, 245],
    snow: 1,
    wind: 7,
    humidity: 68
  })
};

// Aliases cho tên tiếng Việt
SCENE_CONFIGS.nang = SCENE_CONFIGS.sunny;
SCENE_CONFIGS.may = SCENE_CONFIGS.cloudy;
SCENE_CONFIGS.mua = SCENE_CONFIGS.rain;
SCENE_CONFIGS.giong = SCENE_CONFIGS.storm;
SCENE_CONFIGS.hoanghon = SCENE_CONFIGS.sunset;
SCENE_CONFIGS.dem = SCENE_CONFIGS.night;

export const WEATHER_FX_SCENES = {
  sunny: {
    id: 'sunny',
    nameVi: 'Trời quang nắng đẹp',
    nameEn: 'Sunny & Clear',
    icon: '☀️',
    sky: ['#2868ba', '#84b8e6'],
    defaultWind: 6,
    defaultHum: 55
  },
  cloudy: {
    id: 'cloudy',
    nameVi: 'Nhiều mây dịu mát',
    nameEn: 'Partly / Overcast Cloudy',
    icon: '☁️',
    sky: ['#485c7a', '#96a4b8'],
    defaultWind: 8,
    defaultHum: 70
  },
  rain: {
    id: 'rain',
    nameVi: 'Có mưa rơi',
    nameEn: 'Rainy',
    icon: '🌧️',
    sky: ['#223046', '#566880'],
    defaultWind: 12,
    defaultHum: 90
  },
  storm: {
    id: 'storm',
    nameVi: 'Mưa dông & Sấm chớp',
    nameEn: 'Thunderstorm',
    icon: '⛈️',
    sky: ['#101628', '#323a52'],
    defaultWind: 24,
    defaultHum: 94
  },
  sunset: {
    id: 'sunset',
    nameVi: 'Hoàng hôn rực rỡ',
    nameEn: 'Sunset / Golden Hour',
    icon: '🌅',
    sky: ['#463a7e', '#f6965c'],
    defaultWind: 6,
    defaultHum: 60
  },
  night: {
    id: 'night',
    nameVi: 'Đêm sao quang đãng',
    nameEn: 'Clear Starry Night',
    icon: '🌙',
    sky: ['#070c20', '#1a2c58'],
    defaultWind: 4,
    defaultHum: 75
  },
  snow: {
    id: 'snow',
    nameVi: 'Có tuyết rơi',
    nameEn: 'Snowy',
    icon: '❄️',
    sky: ['#41546c', '#8ea0b6'],
    defaultWind: 7,
    defaultHum: 68
  }
};

// Aliases
WEATHER_FX_SCENES.nang = WEATHER_FX_SCENES.sunny;
WEATHER_FX_SCENES.may = WEATHER_FX_SCENES.cloudy;
WEATHER_FX_SCENES.mua = WEATHER_FX_SCENES.rain;
WEATHER_FX_SCENES.giong = WEATHER_FX_SCENES.storm;
WEATHER_FX_SCENES.hoanghon = WEATHER_FX_SCENES.sunset;
WEATHER_FX_SCENES.dem = WEATHER_FX_SCENES.night;

const LEAF_COLORS = [
  'rgba(224,160,50,',
  'rgba(204,98,42,',
  'rgba(170,64,40,'
];

export class WeatherFXEngine {
  constructor(canvas, options = {}) {
    this.cv = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.glassCv = options.glassCanvas || null;
    this.glassCtx = this.glassCv ? this.glassCv.getContext('2d') : null;

    this.isFullScreen = options.isFullScreen ?? false;
    this.isReducedMotion = options.isReducedMotion ?? false;

    const initialKey = options.initialScene || 'sunny';
    this.currentKey = initialKey;
    this.tgt = SCENE_CONFIGS[initialKey] || SCENE_CONFIGS.sunny;
    this.cur = JSON.parse(JSON.stringify(this.tgt));

    this.wind = options.wind ?? (this.tgt.wind || 6);
    this.hum = options.humidity ?? (this.tgt.humidity || 55);

    this.isRunning = false;
    this.isPaused = options.isPaused || false;
    this.animId = null;
    this.lastTime = 0;
    this.totalTime = 0;

    // Các phần tử thời tiết
    this.clouds = [];
    this.swirls = [];
    this.stars = [];
    this.flies = [];
    this.drops = [];
    this.flakes = [];
    this.flock = [];
    this.farBirds = [];
    this.leaves = [];
    this.mist = [];
    this.ripples = [];

    // Pre-rendered offscreen sprite đệm để tối ưu GC
    this.fireflySprite = null;

    // Sao băng & Sấm sét
    this.shootingStar = null;
    this.flash = 0;
    this.bolt = null;
    this.nextBolt = 2 + R() * 3;

    // Giọt nước trên mặt kính
    this.glassDrops = [];
    this.gw = 0;
    this.gh = 0;

    // Tự động tạm dừng animation loop khi tab trình duyệt bị ẩn/thu nhỏ để tiết kiệm GPU & Pin
    this.handleVisibilityChange = () => {
      if (document.hidden) {
        this.stop();
      } else if (!this.isPaused) {
        this.start();
      }
    };
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.initParticles();
    this.resize();
    if (!this.isPaused) {
      this.start();
    }
  }

  initParticles() {
    this.clouds = [];
    for (let i = 0; i < 10; i++) {
      this.clouds.push({
        x: R() * 1.4 - 0.2,
        y: 0.04 + R() * 0.48,
        s: 0.6 + R() * 1.1,
        v: 0.004 + R() * 0.008,
        l: R()
      });
    }

    this.swirls = [];
    for (let i = 0; i < 4; i++) {
      this.swirls.push({
        x: R() * 1.4 - 0.2,
        y: 0.08 + R() * 0.4,
        s: 0.9 + R() * 0.7,
        v: 0.005 + R() * 0.006
      });
    }

    this.stars = [];
    for (let i = 0; i < 110; i++) {
      this.stars.push({
        x: R(),
        y: R() * 0.7,
        r: 0.4 + R() * 1.2,
        p: R() * 6
      });
    }

    this.flies = [];
    for (let i = 0; i < 28; i++) {
      this.flies.push({
        x: R(),
        y: 0.35 + R() * 0.6,
        p: R() * 6,
        sx: 0.3 + R(),
        sy: 0.2 + R()
      });
    }

    this.drops = [];
    for (let i = 0; i < 240; i++) {
      this.drops.push({
        x: R(),
        y: R(),
        l: 10 + R() * 16,
        v: 0.9 + R() * 0.7,
        z: R() < 0.5 ? 0.6 : 1
      });
    }

    this.flakes = [];
    for (let i = 0; i < 90; i++) {
      this.flakes.push({
        x: R(),
        y: R(),
        r: 1.2 + R() * 2.8,
        v: 0.4 + R() * 1.1,
        p: R() * 6
      });
    }

    this.flock = [];
    for (let i = 0; i < 7; i++) {
      this.flock.push({
        ox: -i * 52,
        oy: (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 20,
        s: 1.05 - i * 0.04,
        p: R() * 6
      });
    }

    this.farBirds = [
      { x: 0.3, y: 0.12, s: 0.5, p: 1 },
      { x: 0.7, y: 0.28, s: 0.42, p: 3 }
    ];

    this.leaves = [];
    for (let i = 0; i < 18; i++) {
      this.leaves.push({
        x: R(),
        y: R(),
        z: 5 + R() * 5,
        r: R() * 6,
        p: R() * 6,
        c: i % 3
      });
    }

    this.mist = [];
    for (let i = 0; i < 6; i++) {
      this.mist.push({
        x: R(),
        y: 0.55 + R() * 0.4,
        r: 0.16 + R() * 0.14,
        v: 0.01 + R() * 0.02
      });
    }

    // Khởi tạo sprite đom đóm 1 lần duy nhất (Offscreen Canvas), loại bỏ 28 lệnh createRadialGradient mỗi frame
    if (!this.fireflySprite) {
      const sp = document.createElement('canvas');
      sp.width = 24;
      sp.height = 24;
      const sc = sp.getContext('2d');
      if (sc) {
        const sg = sc.createRadialGradient(12, 12, 0, 12, 12, 12);
        sg.addColorStop(0, 'rgba(215, 255, 160, 0.95)');
        sg.addColorStop(1, 'rgba(215, 255, 160, 0)');
        sc.fillStyle = sg;
        sc.beginPath();
        sc.arc(12, 12, 12, 0, Math.PI * 2);
        sc.fill();
        this.fireflySprite = sp;
      }
    }
  }

  resize() {
    if (!this.cv) return;
    const parent = this.cv.parentElement;
    const w = this.isFullScreen ? window.innerWidth : (parent ? parent.clientWidth : this.cv.clientWidth) || 800;
    const h = this.isFullScreen ? window.innerHeight : (parent ? parent.clientHeight : this.cv.clientHeight) || 400;

    // Giới hạn DPR tối đa 1.15x cho canvas toàn màn hình giúp giảm 50% tải tính toán GPU mà mắt thường không phân biệt được
    const dpr = Math.min(window.devicePixelRatio || 1, this.isFullScreen ? 1.15 : 1.5);
    this.w = w;
    this.h = h;
    this.dpr = dpr;

    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    this.cv.style.width = w + 'px';
    this.cv.style.height = h + 'px';

    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    this.resizeGlass();
  }

  resizeGlass() {
    if (!this.glassCv) return;
    const parent = this.glassCv.parentElement;
    const gw = parent ? parent.clientWidth : this.glassCv.clientWidth || 300;
    const gh = parent ? parent.clientHeight : this.glassCv.clientHeight || 200;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.gw = gw;
    this.gh = gh;
    this.glassCv.width = Math.round(gw * dpr);
    this.glassCv.height = Math.round(gh * dpr);
    this.glassCv.style.width = gw + 'px';
    this.glassCv.style.height = gh + 'px';

    if (this.glassCtx) {
      this.glassCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  setGlassCanvas(canvas) {
    this.glassCv = canvas;
    this.glassCtx = canvas ? canvas.getContext('2d') : null;
    this.resizeGlass();
  }

  setReducedMotion(reduced) {
    this.isReducedMotion = !!reduced;
  }

  setWind(w) {
    if (typeof w === 'number') this.wind = Math.max(0, Math.min(40, w));
  }

  setHumidity(h) {
    if (typeof h === 'number') this.hum = Math.max(20, Math.min(100, h));
  }

  setScene(key) {
    const config = SCENE_CONFIGS[key];
    if (!config) return;
    this.currentKey = key;
    this.tgt = config;
    if (config.wind != null) this.wind = config.wind;
    if (config.humidity != null) this.hum = config.humidity;

    // Snap cur halfway toward the new target immediately so the scene change
    // is visible within 1-2 frames rather than waiting seconds for lerp.
    for (const k in config) {
      const v = config[k];
      if (Array.isArray(v) && Array.isArray(this.cur[k])) {
        for (let j = 0; j < 3; j++) {
          this.cur[k][j] = (this.cur[k][j] + v[j]) / 2;
        }
      } else if (typeof v === 'number' && typeof this.cur[k] === 'number') {
        this.cur[k] = (this.cur[k] + v) / 2;
      }
    }

    // Make sure the animation loop is still running
    if (!this.isRunning) this.start();
  }

  stepTransition(factor) {
    for (const key in this.tgt) {
      const targetVal = this.tgt[key];
      if (Array.isArray(targetVal)) {
        for (let j = 0; j < 3; j++) {
          this.cur[key][j] = lerp(this.cur[key][j], targetVal[j], factor);
        }
      } else if (typeof targetVal === 'number') {
        this.cur[key] = lerp(this.cur[key], targetVal, factor);
      }
    }
  }

  drawBird(cx, x, y, s, t, p, alpha, bc) {
    if (alpha < 0.02) return;
    const f = Math.sin(t * 6 + p);
    const color = rgb(bc);

    cx.save();
    cx.translate(x, y);
    cx.globalAlpha = alpha;
    cx.fillStyle = cx.strokeStyle = color;
    cx.shadowColor = rgb(bc, 0.6);
    cx.shadowBlur = 8;
    cx.lineCap = 'round';

    // Thân chim
    cx.beginPath();
    cx.ellipse(0, 2 * s, 12 * s, 3.6 * s, 0, 0, Math.PI * 2);
    cx.fill();

    // Cổ & đầu chim
    cx.lineWidth = 2.4 * s;
    cx.beginPath();
    cx.moveTo(10 * s, 1 * s);
    cx.quadraticCurveTo(19 * s, 0, 22 * s, -4 * s);
    cx.stroke();

    cx.beginPath();
    cx.arc(23 * s, -5 * s, 2.2 * s, 0, Math.PI * 2);
    cx.fill();

    // Mỏ chim
    cx.lineWidth = 1 * s;
    cx.beginPath();
    cx.moveTo(25 * s, -5 * s);
    cx.lineTo(32 * s, -4 * s);
    cx.stroke();

    // Đuôi chim
    cx.lineWidth = 1.1 * s;
    cx.beginPath();
    cx.moveTo(-10 * s, 3 * s);
    cx.lineTo(-34 * s, 6 * s);
    cx.moveTo(-10 * s, 4 * s);
    cx.lineTo(-32 * s, 9 * s);
    cx.stroke();

    // Cánh chim xa
    cx.globalAlpha = alpha * 0.6;
    cx.beginPath();
    cx.moveTo(2 * s, -1 * s);
    cx.quadraticCurveTo(-6 * s, -12 * s * f - 2 * s, -26 * s, -24 * s * f + 2 * s);
    cx.quadraticCurveTo(-10 * s, -2 * s * f + 4 * s, -4 * s, 3 * s);
    cx.fill();

    // Cánh chim gần
    cx.globalAlpha = alpha;
    cx.beginPath();
    cx.moveTo(4 * s, -1 * s);
    cx.quadraticCurveTo(-8 * s, -14 * s * f - 2 * s, -36 * s, -30 * s * f + 2 * s);
    cx.quadraticCurveTo(-14 * s, -2 * s * f + 4 * s, -6 * s, 3 * s);
    cx.fill();

    cx.restore();
  }

  drawCloud(cx, c, t, sp, W, H, curCloud, curColor) {
    const x = (((c.x + t * c.v * sp) % 1.5 + 1.5) % 1.5) - 0.25;
    const px = x * W;
    const py = c.y * H;
    const r = 60 * c.s;
    const a = (0.1 + 0.26 * c.l) * curCloud;
    if (a < 0.01) return;

    const ox = [-1.1, -0.4, 0.3, 1, 1.6];
    const oy = [0.2, -0.25, 0, -0.15, 0.25];
    const rr = [0.8, 1.05, 1.1, 0.85, 0.7];

    for (let k = 0; k < 5; k++) {
      const X = px + ox[k] * r * 0.8;
      const Y = py + oy[k] * r;
      const Rr = rr[k] * r;
      const g = cx.createRadialGradient(X, Y, 0, X, Y, Rr);
      g.addColorStop(0, rgb(curColor, a));
      g.addColorStop(1, rgb(curColor, 0));
      cx.fillStyle = g;
      cx.beginPath();
      cx.arc(X, Y, Rr, 0, Math.PI * 2);
      cx.fill();
    }
  }

  drawSwirl(cx, s, t, sp, W, H, curSwirl) {
    const x = (((s.x + t * s.v * sp) % 1.5 + 1.5) % 1.5) - 0.25;
    const k = s.s;
    cx.save();
    cx.translate(x * W, s.y * H);
    cx.scale(k, k);
    cx.strokeStyle = `rgba(255, 226, 160, ${0.42 * curSwirl})`;
    cx.lineWidth = 1.6;
    cx.lineCap = 'round';

    cx.beginPath();
    cx.moveTo(-110, 10);
    cx.bezierCurveTo(-80, 10, -56, 0, -26, 0);

    for (let th = Math.PI; th < Math.PI * 4.2; th += 0.12) {
      const r = 26 * (1 - (th - Math.PI) / (Math.PI * 3.4));
      cx.lineTo(r * Math.cos(th), r * Math.sin(th));
    }
    cx.stroke();

    cx.beginPath();
    cx.moveTo(-70, 18);
    cx.bezierCurveTo(-48, 18, -34, 12, -16, 12);
    cx.globalAlpha = 0.6;
    cx.stroke();
    cx.restore();
  }

  drawLotus(cx, x, y, r, a, t, ph) {
    cx.save();
    cx.translate(x + Math.sin(t * 0.8 + ph) * 4, y);
    cx.globalAlpha = a;

    const g = cx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, 'rgb(70, 128, 96)');
    g.addColorStop(1, 'rgb(30, 76, 62)');
    cx.fillStyle = g;
    cx.beginPath();
    cx.ellipse(0, 0, r, r * 0.3, 0, 0, Math.PI * 2);
    cx.fill();

    cx.strokeStyle = 'rgba(160, 210, 170, 0.35)';
    cx.lineWidth = 1;
    cx.beginPath();
    for (let k = 0; k < 10; k++) {
      const an = (k / 10) * Math.PI * 2;
      cx.moveTo(0, 0);
      cx.lineTo(Math.cos(an) * r * 0.95, Math.sin(an) * r * 0.28);
    }
    cx.stroke();
    cx.restore();
  }

  drawGlass(dt) {
    if (!this.glassCtx || !this.glassCv) return;
    const gx = this.glassCtx;
    const gw = this.gw;
    const gh = this.gh;

    gx.clearRect(0, 0, gw, gh);
    if (this.cur.rain < 0.05 && !this.glassDrops.length) return;

    if (!this.isReducedMotion && this.glassDrops.length < 42 && R() < this.cur.rain * dt * 7) {
      this.glassDrops.push({
        x: R() * gw,
        y: R() * gh * 0.8,
        r: 2 + R() * 3.5,
        vy: 0,
        run: R() < 0.35,
        t0: R() * 3,
        y0: 0,
        a: 0
      });
    }

    for (let k = this.glassDrops.length - 1; k >= 0; k--) {
      const d = this.glassDrops[k];
      d.a += dt;
      if (!d.y0) d.y0 = d.y;

      if (d.run && d.a > d.t0) {
        d.vy = Math.min(70, d.vy + 40 * dt);
        d.y += d.vy * dt;
      }

      if (d.y > gh + 8 || d.a > 16 || (this.cur.rain < 0.05 && d.a > 3)) {
        this.glassDrops.splice(k, 1);
        continue;
      }

      const al = Math.min(1, d.a * 2) * Math.min(1, (16 - d.a) / 2);

      // Vệt nước trượt dài
      if (d.y - d.y0 > 2) {
        gx.strokeStyle = `rgba(210, 230, 255, ${0.14 * al})`;
        gx.lineWidth = d.r * 0.8;
        gx.lineCap = 'round';
        gx.beginPath();
        gx.moveTo(d.x, d.y0);
        gx.lineTo(d.x, d.y);
        gx.stroke();
      }

      // Giọt nước tròn
      gx.fillStyle = `rgba(210, 230, 255, ${0.2 * al})`;
      gx.strokeStyle = `rgba(255, 255, 255, ${0.35 * al})`;
      gx.lineWidth = 1;
      gx.beginPath();
      gx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      gx.fill();
      gx.stroke();

      // Điểm phản chiếu ánh sáng trắng trên giọt nước
      gx.fillStyle = `rgba(255, 255, 255, ${0.75 * al})`;
      gx.beginPath();
      gx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.28, 0, Math.PI * 2);
      gx.fill();
    }
  }

  draw(t, dt) {
    if (!this.ctx || !this.cv) return;
    const cx = this.ctx;
    const W = this.w;
    const H = this.h;
    const cur = this.cur;

    const w = this.wind / 30;
    const m = cl((this.hum - 55) / 45) * Math.min(1, 0.4 + cur.cloud * 0.4 + cur.rain * 0.4);
    const sp = 1 + w * 3.5;

    // Nền trời chuyển sắc Gradient
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgb(cur.top));
    g.addColorStop(1, rgb(cur.bot));
    cx.fillStyle = g;
    cx.fillRect(0, 0, W, H);

    // 1. Sao đêm & Sao băng
    if (cur.star > 0.02) {
      for (const s of this.stars) {
        cx.fillStyle = `rgba(255, 255, 240, ${(0.4 + 0.6 * Math.sin(t * 1.5 + s.p)) * cur.star})`;
        cx.beginPath();
        cx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        cx.fill();
      }

      if (!this.shootingStar && cur.star > 0.7 && R() < 0.005 && !this.isReducedMotion) {
        this.shootingStar = {
          x: W * (0.3 + R() * 0.6),
          y: H * (0.05 + R() * 0.25),
          l: 0
        };
      }

      if (this.shootingStar) {
        this.shootingStar.l += dt * 1.6;
        const sx = this.shootingStar.x - this.shootingStar.l * 200;
        const sy = this.shootingStar.y + this.shootingStar.l * 100;
        const gg = cx.createLinearGradient(sx, sy, sx + 90, sy - 45);
        gg.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gg.addColorStop(1, `rgba(255, 255, 255, ${1 - this.shootingStar.l})`);
        cx.strokeStyle = gg;
        cx.lineWidth = 1.6;
        cx.beginPath();
        cx.moveTo(sx, sy);
        cx.lineTo(sx + 90, sy - 45);
        cx.stroke();
        if (this.shootingStar.l > 1) this.shootingStar = null;
      }
    }

    // 2. Mặt trăng có hố crater
    if (cur.moon > 0.02) {
      const mx = W * 0.8;
      const my = H * 0.22;
      const mr = Math.min(W, H) * (this.isFullScreen ? 0.045 : 0.065);

      const mg = cx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4.5);
      mg.addColorStop(0, `rgba(190, 210, 255, ${0.35 * cur.moon})`);
      mg.addColorStop(1, 'rgba(190, 210, 255, 0)');
      cx.fillStyle = mg;
      cx.fillRect(0, 0, W, H);

      cx.fillStyle = `rgba(238, 242, 255, ${cur.moon})`;
      cx.beginPath();
      cx.arc(mx, my, mr, 0, Math.PI * 2);
      cx.fill();

      // Hố trăng
      cx.fillStyle = `rgba(180, 192, 220, ${0.38 * cur.moon})`;
      [[-0.3, -0.2, 0.22], [0.25, 0.15, 0.3], [-0.1, 0.4, 0.15]].forEach(c => {
        cx.beginPath();
        cx.arc(mx + c[0] * mr, my + c[1] * mr, c[2] * mr, 0, Math.PI * 2);
        cx.fill();
      });
    }

    // 3. Mặt trời tỏa tia 18 cánh xoay
    if (cur.sun > 0.02) {
      const a = cur.sun;
      const x = W * cur.sx;
      const y = H * cur.sy;
      const r = Math.min(W, H) * 0.06;
      const L = Math.max(W, H) * 1.2;

      const sg = cx.createRadialGradient(x, y, 0, x, y, r * 7);
      sg.addColorStop(0, rgb(cur.sc, 0.9 * a));
      sg.addColorStop(0.25, rgb(cur.sc, 0.35 * a));
      sg.addColorStop(1, rgb(cur.sc, 0));
      cx.fillStyle = sg;
      cx.fillRect(0, 0, W, H);

      if (!this.isReducedMotion) {
        cx.save();
        cx.translate(x, y);
        cx.rotate(t * 0.03);
        cx.fillStyle = rgb(cur.sc, 0.1 * a * (0.8 + 0.2 * Math.sin(t * 0.8)));
        for (let i = 0; i < 18; i++) {
          cx.rotate((Math.PI * 2) / 18);
          cx.beginPath();
          cx.moveTo(0, 0);
          cx.lineTo(L, -L * 0.04);
          cx.lineTo(L, L * 0.04);
          cx.fill();
        }
        cx.restore();
      }

      cx.fillStyle = rgb(cur.sc, a);
      cx.beginPath();
      cx.arc(x, y, r, 0, Math.PI * 2);
      cx.fill();
    }

    // 4. Mây bồng bềnh
    for (const c of this.clouds) {
      this.drawCloud(cx, c, t, sp, W, H, cur.cloud, cur.cc);
    }

    // 5. Mây xoắn truyền thống Đại Việt
    if (cur.swirl > 0.02) {
      for (const s of this.swirls) {
        this.drawSwirl(cx, s, t, sp, W, H, cur.swirl);
      }
    }

    // 6. Sương mù trôi lờ lững
    if (m > 0.02) {
      this.mist.forEach(b => {
        const X = (((b.x + t * b.v * sp) % 1.4 + 1.4) % 1.4) * W - 0.2 * W;
        const Y = b.y * H;
        const Rr = b.r * H * 1.6;
        cx.save();
        cx.translate(X, Y);
        cx.scale(3, 1);
        const mg = cx.createRadialGradient(0, 0, 0, 0, 0, Rr);
        mg.addColorStop(0, rgb(cur.cc, 0.2 * m));
        mg.addColorStop(1, rgb(cur.cc, 0));
        cx.fillStyle = mg;
        cx.beginPath();
        cx.arc(0, 0, Rr, 0, Math.PI * 2);
        cx.fill();
        cx.restore();
      });
    }

    // 7. Đàn chim hạc bay qua
    if (cur.bird > 0.02) {
      const fx = ((t * 38 + 200) % (W + 700)) - 350;
      const fy = H * (cur.sy < 0.4 ? 0.2 : 0.3) + Math.sin(t * 0.4) * 14;

      this.flock.forEach(b => {
        this.drawBird(
          cx,
          fx + b.ox,
          fy + b.oy + Math.sin(t * 1.1 + b.p) * 4,
          b.s,
          t,
          b.p,
          cur.bird,
          cur.bc
        );
      });

      this.farBirds.forEach(b => {
        this.drawBird(
          cx,
          ((b.x * W + t * 16) % (W + 200)) - 100,
          b.y * H + Math.sin(t + b.p) * 6,
          b.s,
          t,
          b.p,
          cur.bird * 0.8,
          cur.bc
        );
      });
    }

    // 8. Lá vàng / hoa đào rơi chao đảo
    if (cur.leaf > 0.02) {
      const nl = Math.min(
        this.leaves.length,
        Math.round(this.leaves.length * cur.leaf * (0.5 + w * 1.5))
      );
      for (let i = 0; i < nl; i++) {
        const l = this.leaves[i];
        l.y += (0.05 + 0.03 * (l.z / 10)) * dt;
        l.x += (0.02 + w * 0.12 + Math.sin(t + l.p) * 0.015) * dt;
        l.r += dt * (1 + w * 3);

        if (l.y > 1.05) {
          l.y = -0.05;
          l.x = R();
        }
        if (l.x > 1.05) l.x = -0.05;

        cx.save();
        cx.translate(l.x * W, l.y * H);
        cx.rotate(l.r);
        cx.fillStyle = LEAF_COLORS[l.c] + Math.min(1, cur.leaf * 1.4) + ')';
        cx.beginPath();
        cx.ellipse(
          0,
          0,
          l.z,
          l.z * 0.55 * Math.abs(Math.cos(t * 1.5 + l.p) * 0.6 + 0.4),
          0,
          0,
          Math.PI * 2
        );
        cx.fill();
        cx.restore();
      }
    }

    // 9. Đom đóm lập lòe ban đêm (Tối ưu bằng sprite đệm, không cấp phát gradient mới)
    if (cur.fly > 0.02) {
      const sprite = this.fireflySprite;
      this.flies.forEach(f => {
        const X = f.x * W + Math.sin(t * f.sx + f.p) * 40;
        const Y = f.y * H + Math.cos(t * f.sy + f.p) * 26;
        const pl = Math.pow(0.5 + 0.5 * Math.sin(t * 2 + f.p), 2) * cur.fly;
        if (sprite) {
          cx.globalAlpha = pl;
          cx.drawImage(sprite, X - 12, Y - 12);
        } else {
          cx.fillStyle = `rgba(215, 255, 160, ${pl})`;
          cx.beginPath();
          cx.arc(X, Y, 2, 0, Math.PI * 2);
          cx.fill();
        }
      });
      cx.globalAlpha = 1;
    }

    // 10. Mưa 2 tầng sâu + Gợn sóng elip + Khóm lá sen
    if (cur.rain > 0.02) {
      const n = Math.floor(this.drops.length * Math.min(1, cur.rain));
      const sp2 = 1 + cur.rain * 0.5;
      const sl = 0.1 + w * 0.9;

      for (let pass = 0; pass < 2; pass++) {
        cx.strokeStyle = `rgba(200, 220, 245, ${(pass ? 0.42 : 0.22) * Math.min(1, cur.rain * 1.4)})`;
        cx.lineWidth = pass ? 1.3 : 0.8;
        cx.beginPath();

        for (let i = 0; i < n; i++) {
          const d = this.drops[i];
          if ((d.z > 0.8) !== (pass === 1)) continue;
          d.y += d.v * d.z * dt * sp2 * 1.1;
          d.x -= sl * d.v * dt * 0.12;

          if (d.y > 1.05) {
            d.y = -0.05;
            d.x = R() + w * 0.3;
          }
          if (d.x < -0.1) d.x += 1.2;

          const px = d.x * W;
          const py = d.y * H;
          const ln = d.l * d.z;
          cx.moveTo(px, py);
          cx.lineTo(px - ln * sl, py + ln);
        }
        cx.stroke();
      }

      if (!this.isReducedMotion && R() < cur.rain * dt * 14) {
        this.ripples.push({ x: R() * W, y: H * (0.9 + R() * 0.09), l: 0 });
      }

      for (let i = this.ripples.length - 1; i >= 0; i--) {
        const rp = this.ripples[i];
        rp.l += dt * 1.2;
        if (rp.l > 1) {
          this.ripples.splice(i, 1);
          continue;
        }
        cx.strokeStyle = `rgba(200, 225, 245, ${(1 - rp.l) * 0.5 * cur.rain})`;
        cx.lineWidth = 1.2;
        cx.beginPath();
        cx.ellipse(rp.x, rp.y, rp.l * 34, rp.l * 9, 0, 0, Math.PI * 2);
        cx.stroke();
      }

      // Hai bụi lá sen dập dềnh chân màn hình
      this.drawLotus(cx, W * 0.06, H + 4, H * 0.11, cur.rain * 0.85, t, 0);
      this.drawLotus(cx, W * 0.95, H + 10, H * 0.09, cur.rain * 0.85, t, 2);
    }

    // 11. Tuyết rơi
    if (cur.snow > 0.02) {
      cx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      for (const f of this.flakes) {
        f.y += f.v * dt * 0.8;
        f.x += Math.sin(t + f.p) * 0.003;
        if (f.y > 1.05) {
          f.y = -0.05;
          f.x = R();
        }
        cx.beginPath();
        cx.arc(f.x * W, f.y * H, f.r, 0, Math.PI * 2);
        cx.fill();
      }
    }

    // 12. Tia sét sấm chớp gãy khúc
    if (cur.bolt > 0.5 && !this.isReducedMotion) {
      this.nextBolt -= dt;
      if (this.nextBolt <= 0) {
        this.flash = 1;
        this.nextBolt = 3 + R() * 5;
        let bx = W * (0.15 + R() * 0.7);
        let by = 0;
        const pts = [[bx, 0]];
        while (by < H * 0.55) {
          by += 18 + R() * 30;
          bx += (R() - 0.5) * 50;
          pts.push([bx, by]);
        }
        this.bolt = { pts, l: 1 };
      }
    }

    if (this.bolt) {
      cx.strokeStyle = `rgba(235, 240, 255, ${this.bolt.l})`;
      cx.lineWidth = 2.2;
      cx.shadowColor = '#bcd';
      cx.shadowBlur = 16;
      cx.beginPath();
      this.bolt.pts.forEach((p, j) => {
        j ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1]);
      });
      cx.stroke();
      cx.shadowBlur = 0;
      this.bolt.l -= dt * 4;
      if (this.bolt.l <= 0) this.bolt = null;
    }

    if (this.flash > 0) {
      cx.fillStyle = `rgba(220, 230, 255, ${this.flash * 0.28})`;
      cx.fillRect(0, 0, W, H);
      this.flash -= dt * 3;
    }

    // 13. Giọt nước đọng chảy trên mặt kính card (nếu có glassCanvas)
    this.drawGlass(dt);
  }

  setPaused(paused) {
    this.isPaused = Boolean(paused);
    if (this.isPaused) {
      this.stop();
      if (this.ctx && this.cv) {
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
      }
    } else {
      if (!document.hidden) {
        this.start();
      }
    }
  }

  start() {
    if (this.isRunning || this.isPaused) return;
    this.isRunning = true;
    this.lastTime = performance.now();

    const loop = (now) => {
      if (!this.isRunning || this.isPaused) return;
      const dt = Math.min((now - this.lastTime) / 1000 || 0, 0.05);
      this.lastTime = now;
      this.totalTime += dt;

      // Nội suy trạng thái mượt mà — base 0.02 cho chuyển cảnh nhanh ~1.5s
      this.stepTransition(1 - Math.pow(0.02, dt));

      try {
        this.draw(this.totalTime, dt);
      } catch (e) {
        // Lỗi render không được làm dừng loop — chỉ log để debug
        console.warn('[WeatherFX] draw error:', e);
      }
      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
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
    if (this.handleVisibilityChange) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    this.fireflySprite = null;
    this.clouds = [];
    this.swirls = [];
    this.stars = [];
    this.flies = [];
    this.drops = [];
    this.flakes = [];
    this.flock = [];
    this.leaves = [];
    this.mist = [];
    this.ripples = [];
    this.glassDrops = [];
  }
}
