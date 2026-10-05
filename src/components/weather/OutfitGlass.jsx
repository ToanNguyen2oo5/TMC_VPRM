// src/components/weather/OutfitGlass.jsx
import React, { useRef, useEffect } from 'react';

const rnd = (a, b) => a + Math.random() * (b - a);

export default function OutfitGlass({ weatherType, isReducedMotion }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w = canvas.parentElement.offsetWidth;
    let h = canvas.parentElement.offsetHeight;
    let DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const drops = [];
    let animationId;
    let lastTime = performance.now();

    const draw = (ts) => {
      const dt = Math.min(0.05, (ts - lastTime) / 1000 || 0.016);
      lastTime = ts;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (isReducedMotion) {
        drops.length = 0;
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Rain intensity logic based on weather type
      const isRaining = weatherType === 'shower' || weatherType === 'drizzle';
      const rainIntensity = weatherType === 'shower' ? 1 : (weatherType === 'drizzle' ? 0.45 : 0);

      if (rainIntensity > 0.12 && drops.length < 30 && Math.random() < rainIntensity * dt * 5) {
        const r = rnd(1.6, 4.6);
        drops.push({ x: rnd(8, w - 8), y: rnd(8, h * 0.9), r, y0: 0, vy: 0, life: 0, slide: false });
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const p = drops[i];
        p.life += dt;
        if (!p.slide && p.r > 3.1 && Math.random() < dt * 0.7) {
          p.slide = true;
          p.y0 = p.y;
          p.vy = 14 + p.r * 5;
        }
        if (p.slide) {
          p.y += p.vy * dt;
          p.r *= (1 - 0.02 * dt);
          if (p.r < 1.5) p.slide = false;
        }
        
        const fade = rainIntensity < 0.1 ? Math.min(1, Math.max(0, 1 - p.life * 0.02 - (0.1 - rainIntensity) * 8)) : 1;
        
        if (p.y > h + 6 || p.life > 16 || fade <= 0) {
          drops.splice(i, 1);
          continue;
        }
        
        if (p.slide) {
          ctx.strokeStyle = `rgba(255,255,255,${0.07 * fade})`;
          ctx.lineWidth = p.r * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y0);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        
        ctx.fillStyle = `rgba(255,255,255,${0.1 * fade})`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * 1.25, 0, 0, 6.3);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255,255,255,${0.5 * fade})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(p.x - p.r * 0.2, p.y - p.r * 0.3, p.r * 0.6, 3.4, 4.8);
        ctx.stroke();
        
        ctx.strokeStyle = `rgba(0,0,0,${0.22 * fade})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0.4, 2.7);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [weatherType, isReducedMotion]);

  return <canvas ref={canvasRef} className="glass-overlay-drops" />;
}
