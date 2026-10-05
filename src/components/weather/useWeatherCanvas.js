// src/components/weather/useWeatherCanvas.js
import { useEffect, useRef } from 'react';
import { REG, MODES, hexRGB } from './weatherThemes';

const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function useWeatherCanvas(canvasRef, region, mode, isReducedMotion) {
  const animationRef = useRef(null);

  // States
  const K = useRef({ fog: 0, clouds: 0, rain: 0, ripple: 0, rays: 0, motes: 0, leaves: 0, petals: 0, daisy: 0 });
  const T = useRef({ ...K.current });
  const S = useRef({ style: 1, wind: .2 });
  const TS = useRef({ style: 1, wind: .2 });
  
  const fogCol = useRef([201, 216, 214]);
  const fogT = useRef([201, 216, 214]);
  const rayCol = useRef([255, 214, 150]);
  const rayT = useRef([255, 214, 150]);
  const time = useRef(0);

  // Particles
  const FOG = useRef([]);
  const CLOUDS = useRef([]);
  const MOTES = useRef([]);
  const LEAVES = useRef([]);
  const PETALS = useRef([]);
  const DAISIES = useRef([]);
  const RAIN = useRef([]);
  const RIPPLES = useRef([]);

  const LEAF_COL = ['#D9A33A', '#C0701E', '#9C4A1A', '#E8C25A'];
  const PET_COL = ['#E0457B', '#F29BC0', '#FFFFFF', '#C2276A'];
  const DAISY_COL = ['#F2C230', '#E8A92A', '#F7DA6A'];

  const mkPart = (init, cols, w, h) => ({ 
    x: rnd(-.05, 1.05) * w, 
    y: init ? rnd(-.1, 1) * h : -30, 
    s: rnd(7, 15), 
    ph: rnd(0, 6.3), 
    vy: rnd(26, 52), 
    rot: rnd(0, 6.3), 
    vr: rnd(-.8, .8), 
    z: rnd(.55, 1), 
    col: pick(cols) 
  });

  const newDrop = (init, i, w, h) => {
    const layer = i % 3;
    const P = [{ l: [10, 18], w: .8, sp: [520, 680], al: .24 }, { l: [18, 30], w: 1.1, sp: [820, 1000], al: .32 }, { l: [40, 70], w: 1.9, sp: [1300, 1700], al: .16 }][layer];
    return { x: rnd(-.3, 1.15) * (w || 1200), y: init ? rnd(-.1, 1) * (h || 800) : -rnd(0, 80), l: rnd(...P.l), w: P.w, sp: rnd(...P.sp), al: P.al, layer };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let W = window.innerWidth;
    let H = window.innerHeight;
    let DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let perf = W < 700 ? 0.5 : 1;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      perf = W < 700 ? 0.5 : 1;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    };
    window.addEventListener('resize', resize);
    resize();

    // Init particles
    if (FOG.current.length === 0) {
      FOG.current = Array.from({ length: 6 }, (_, i) => ({ x: rnd(-.2, 1.2), y: rnd(.3, .95), r: rnd(.3, .6), v: rnd(.004, .012) * (i % 2 ? 1 : -1), a: rnd(.1, .19) }));
      CLOUDS.current = Array.from({ length: 5 }, () => ({ x: rnd(-.2, 1.2), y: rnd(.02, .34), r: rnd(.22, .4), a: rnd(.12, .2) }));
      MOTES.current = Array.from({ length: 30 }, () => ({ x: rnd(0, 1), y: rnd(0, 1), r: rnd(1.2, 3.4), vy: rnd(6, 18), vx: rnd(-6, 6), ph: rnd(0, 6.3) }));
      LEAVES.current = Array.from({ length: 18 }, () => mkPart(true, LEAF_COL, W, H));
      PETALS.current = Array.from({ length: 18 }, () => mkPart(true, PET_COL, W, H));
      DAISIES.current = Array.from({ length: 14 }, () => mkPart(true, DAISY_COL, W, H));
      RAIN.current = Array.from({ length: 320 }, (_, i) => newDrop(true, i, W, H));
    }

    const spr = document.createElement('canvas'); spr.width = 4; spr.height = 64;
    { const c = spr.getContext('2d'), g = c.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, 'rgba(225,238,255,0)'); g.addColorStop(1, 'rgba(225,238,255,1)');
      c.fillStyle = g; c.fillRect(0, 0, 4, 64); 
    }

    const drawBlob = (cx, cy, rad, col, a, flat) => {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(1, flat);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
      g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = g; ctx.fillRect(-rad, -rad, rad * 2, rad * 2); ctx.restore();
    };

    const drawClouds = (dt) => {
      if (K.current.clouds < .01) return;
      const sp = (.006 + S.current.wind * .05) * dt;
      CLOUDS.current.forEach(c => {
        c.x += sp; if (c.x > 1.45) c.x = -.45;
        const rad = Math.max(220, c.r * W);
        [[0, 0], [-.55, .12], [.5, .1]].forEach(o => drawBlob(c.x * W + o[0] * rad, c.y * H + o[1] * rad, rad, '150,160,170', c.a * K.current.clouds, .5));
      });
    };

    const drawFog = (dt) => {
      if (K.current.fog < .01) return;
      const col = fogCol.current.map(Math.round).join(',');
      FOG.current.forEach(f => {
        f.x += f.v * (1 + S.current.wind * 2) * dt; if (f.x > 1.5) f.x = -.5; if (f.x < -.5) f.x = 1.5;
        drawBlob(f.x * W, f.y * H, Math.max(240, f.r * W), col, f.a * K.current.fog, .55);
      });
    };

    const drawRays = () => {
      if (K.current.rays < .01) return;
      const col = rayCol.current.map(Math.round).join(',');
      ctx.globalCompositeOperation = 'lighter';
      const sx = W * .86, sy = -H * .12;
      drawBlob(sx, sy, H * .95, col, .24 * K.current.rays, 1);
      for (let i = 0; i < 7; i++) {
        const a = 1.95 + i * .1 + Math.sin(time.current * .15 + i) * .03, L = H * 1.7, w = 60 + (i % 3) * 38;
        const ex = sx + Math.cos(a) * L, ey = sy + Math.sin(a) * L, nx = -Math.sin(a), ny = Math.cos(a);
        const g = ctx.createLinearGradient(sx, sy, ex, ey);
        g.addColorStop(0, `rgba(${col},${.15 * K.current.rays})`); g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex + nx * w, ey + ny * w); ctx.lineTo(ex - nx * w, ey - ny * w); ctx.closePath(); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawMotes = (dt) => {
      if (K.current.motes < .01) return;
      ctx.globalCompositeOperation = 'lighter';
      const n = Math.round(MOTES.current.length * perf);
      for (let i = 0; i < n; i++) {
        const m = MOTES.current[i];
        m.y -= m.vy * dt / H; m.x += m.vx * dt / W; if (m.y < -.05) { m.y = 1.05; m.x = rnd(0, 1); } if (m.x < -.05) m.x = 1.05; if (m.x > 1.05) m.x = -.05;
        const a = (.15 + .35 * (Math.sin(time.current * 1.2 + m.ph) * .5 + .5)) * K.current.motes;
        ctx.fillStyle = `rgba(255,200,120,${a * .35})`; ctx.beginPath(); ctx.arc(m.x * W, m.y * H, m.r * 3.2, 0, 6.3); ctx.fill();
        ctx.fillStyle = `rgba(255,226,170,${a})`; ctx.beginPath(); ctx.arc(m.x * W, m.y * H, m.r, 0, 6.3); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const leafPath = s => { ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * .85, -s * .2, 0, s); ctx.quadraticCurveTo(-s * .85, -s * .2, 0, -s); ctx.fill(); };

    const drawFall = (arr, key, type, dt) => {
      const k = K.current[key]; if (k < .01) return;
      const n = Math.round(arr.length * clamp(k) * perf);
      for (let i = 0; i < n; i++) {
        const p = arr[i];
        if (type === 'petal') {
          p.x += (50 + S.current.wind * 110) * p.z * dt; p.y += (Math.sin(time.current * 1.3 + p.ph) * 18 + 8) * dt; p.rot += p.vr * 2 * dt;
          if (p.x > W + 30) { p.x = -30; p.y = rnd(.05, .85) * H; }
        } else {
          p.y += p.vy * p.z * dt * (type === 'daisy' ? .6 : 1); p.x += (Math.sin(time.current * .9 + p.ph) * 26 + S.current.wind * 36 + 6) * dt; p.rot += p.vr * dt;
          if (p.y > H + 30) { p.y = -30; p.x = rnd(-.05, 1.05) * W; } if (p.x > W + 40) p.x = -40;
        }
        ctx.save(); ctx.translate(p.x, p.y); ctx.globalAlpha = clamp(k * 1.4) * (.55 + .4 * p.z); ctx.fillStyle = p.col;
        const s = p.s * p.z;
        if (type === 'leaf') { ctx.rotate(Math.sin(time.current * 1.1 + p.ph) * .9 + p.rot * .3); leafPath(s); ctx.strokeStyle = 'rgba(60,30,10,.35)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke(); }
        else if (type === 'petal') { ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, s * .8, s * .4, 0, 0, 6.3); ctx.fill(); }
        else { ctx.rotate(p.rot); for (let j = 0; j < 5; j++) { ctx.rotate(1.2566); ctx.beginPath(); ctx.ellipse(s * .38, 0, s * .4, s * .2, 0, 0, 6.3); ctx.fill(); } ctx.fillStyle = '#7A4A12'; ctx.beginPath(); ctx.arc(0, 0, s * .16, 0, 6.3); ctx.fill(); }
        ctx.restore();
      }
    };

    const drawRain = (dt) => {
      const k = K.current.rain; if (k < .01) return;
      const n = Math.round(RAIN.current.length * clamp(k) * perf);
      const th = .05 + S.current.wind * .2, c = Math.cos(th), s = Math.sin(th);
      const lenMul = .5 + .5 * S.current.style, spMul = .6 + .4 * S.current.style;
      for (let i = 0; i < n; i++) {
        const d = RAIN.current[i];
        d.x += s * d.sp * spMul * dt; d.y += c * d.sp * spMul * dt;
        if (d.y > H + 90 || d.x > W + 140) { d.y = -rnd(0, 80); d.x = rnd(-.3, 1.1) * W; }
        ctx.globalAlpha = d.al * clamp(k * 1.3);
        ctx.setTransform(DPR * c, -DPR * s, DPR * s, DPR * c, DPR * d.x, DPR * d.y);
        ctx.drawImage(spr, -d.w / 2, 0, d.w, d.l * lenMul);
      }
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalAlpha = 1;
    };

    const drawRipples = (dt) => {
      if (K.current.ripple > .05 && Math.random() < dt * K.current.ripple * 26) RIPPLES.current.push({ x: rnd(0, W), y: H * rnd(.9, 1), r: 2, life: 0, max: rnd(.6, 1) });
      if (K.current.ripple > .01) {
        const g = ctx.createLinearGradient(0, H * .84, 0, H);
        g.addColorStop(0, 'rgba(170,190,215,0)'); g.addColorStop(1, `rgba(170,190,215,${.1 * K.current.ripple})`);
        ctx.fillStyle = g; ctx.fillRect(0, H * .84, W, H * .16);
      }
      for (let i = RIPPLES.current.length - 1; i >= 0; i--) {
        const r = RIPPLES.current[i]; r.life += dt; r.r += 60 * dt;
        if (r.life > r.max) { RIPPLES.current.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(220,235,255,${(1 - r.life / r.max) * .32 * clamp(K.current.ripple + .3)})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * .28, 0, 0, 6.3); ctx.stroke();
      }
    };

    let last = performance.now();
    const frame = ts => {
      if (document.hidden) {
        last = ts;
        animationRef.current = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; time.current += dt;
      const e = Math.min(1, dt * 2.2);

      // Interpolate states
      for (const k in K.current) K.current[k] += (T.current[k] - K.current[k]) * e;
      S.current.style += (TS.current.style - S.current.style) * e; 
      S.current.wind += (TS.current.wind - S.current.wind) * e;
      for (let i = 0; i < 3; i++) { 
        fogCol.current[i] += (fogT.current[i] - fogCol.current[i]) * e; 
        rayCol.current[i] += (rayT.current[i] - rayCol.current[i]) * e; 
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0); 
      ctx.clearRect(0, 0, cv.width, cv.height);
      
      if (!isReducedMotion) {
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        drawClouds(dt); drawFog(dt); drawRays(); drawMotes(dt);
        drawFall(LEAVES.current, 'leaves', 'leaf', dt); 
        drawFall(PETALS.current, 'petals', 'petal', dt); 
        drawFall(DAISIES.current, 'daisy', 'daisy', dt);
        drawRain(dt); drawRipples(dt);
      }
      
      // We will handle glass droplets on cards separately in another component
      animationRef.current = requestAnimationFrame(frame);
    };

    animationRef.current = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isReducedMotion]);

  // Update target states when region or mode changes
  useEffect(() => {
    const R = REG[region] || REG['bac'];
    const M = MODES[mode] || MODES['clear'];
    const fx = { ...M.fx };
    
    // AutoFx if using auto
    if (mode === R.auto && R.autoFx) Object.assign(fx, R.autoFx);
    
    const rainy = fx.rain > .3;
    const f = rainy ? .15 : 1;
    
    T.current.fog = fx.fog; 
    T.current.clouds = fx.clouds; 
    T.current.rain = fx.rain; 
    T.current.ripple = fx.ripple; 
    T.current.rays = fx.rays; 
    T.current.motes = fx.motes;
    
    T.current.leaves = R.flavor === 'leaves' ? .7 * f : 0;
    T.current.petals = R.flavor === 'petals' ? .8 * f : 0;
    T.current.daisy = R.flavor === 'daisy' ? .6 * f : 0;
    
    TS.current.style = fx.style; 
    TS.current.wind = clamp(R.w + (mode === 'shower' ? .2 : 0));
    
    if (R.fog) {
      fogT.current.splice(0, 3, ...hexRGB(R.fog));
    }
    if (R.glow) {
      rayT.current.splice(0, 3, ...R.glow.split(',').map(Number));
    } else {
      rayT.current.splice(0, 3, 255, 226, 170);
    }
    
    // Set CSS variable for tint
    document.documentElement.style.setProperty('--tint', R.tint);
    
  }, [region, mode]);
}
