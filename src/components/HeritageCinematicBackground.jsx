import { useState, useEffect } from 'react';
import './HeritageCinematicBackground.css';

const MOUNTAINS_BG = '/src/assets/images/vietnam_mountains_bg_1791042196691.jpg';
const BOAT_ROWER_IMG = '/src/assets/images/boat_rower_silhouette_1791042210691.jpg';

export default function HeritageCinematicBackground({ enabled = true }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = ((e.clientX / innerWidth) - 0.5) * 16;
      targetY = ((e.clientY / innerHeight) - 0.5) * 12;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      setMouseOffset({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="heritage-cinematic-bg" aria-hidden="true">
      {/* 1. Panoramic Mountains Layer with Mouse Parallax */}
      <div
        className="cinematic-mountain-layer"
        style={{
          backgroundImage: `url(${MOUNTAINS_BG})`,
          transform: `scale(1.05) translate3d(${mouseOffset.x * -0.6}px, ${mouseOffset.y * -0.6}px, 0)`,
        }}
      />

      {/* Atmospheric Vignette & Contrast Overlay */}
      <div className="cinematic-overlay-vignette" />

      {/* 2. Drifting Mist & Clouds */}
      <div className="cinematic-mist-layer" />
      <div className="cinematic-mist-layer cinematic-mist-layer--high" />

      {/* 3. Đàn Chim Hạc / Cò Bay Lả (Flying Cranes in V-formation) */}
      <div className="cinematic-birds-flock">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg
            key={i}
            viewBox="0 0 32 16"
            className="flock-bird"
            style={{ width: `${18 + (i % 2) * 4}px`, height: `${9 + (i % 2) * 2}px` }}
          >
            <path
              d="M 1 8 Q 8 1 16 7 Q 24 1 31 8 Q 22 5 16 11 Q 10 5 1 8 Z"
              fill="currentColor"
            />
          </svg>
        ))}
      </div>

      {/* 4. Thuyền Tam Bản & Người Chèo Thuyền trên Sông (Traditional Sampan & Rower) */}
      <div className="cinematic-boat-track">
        <div className="cinematic-boat-hull">
          <img
            src={BOAT_ROWER_IMG}
            alt=""
            className="cinematic-boat-image"
            referrerPolicy="no-referrer"
          />
          <div className="boat-wake-ripple" />
          <div className="boat-wake-ripple" />
        </div>
      </div>

      {/* 5. Hoa Đăng Trôi Sông (Floating Lotus Lanterns) */}
      <div className="cinematic-lantern lantern-1">
        <div className="lantern-glow" />
        <div className="lantern-reflection" />
      </div>
      <div className="cinematic-lantern lantern-2">
        <div className="lantern-glow" />
        <div className="lantern-reflection" />
      </div>
      <div className="cinematic-lantern lantern-3">
        <div className="lantern-glow" />
        <div className="lantern-reflection" />
      </div>
      <div className="cinematic-lantern lantern-4">
        <div className="lantern-glow" />
        <div className="lantern-reflection" />
      </div>

      {/* 6. Glowing Fireflies / Golden Stardust (Đom đóm & bụi vàng) */}
      {[
        { bottom: '20%', left: '15%', delay: '0s', duration: '12s' },
        { bottom: '25%', left: '35%', delay: '3s', duration: '15s' },
        { bottom: '18%', left: '55%', delay: '1.5s', duration: '14s' },
        { bottom: '22%', left: '78%', delay: '4s', duration: '16s' },
        { bottom: '30%', left: '88%', delay: '2s', duration: '13s' },
      ].map((f, idx) => (
        <div
          key={idx}
          className="cinematic-firefly"
          style={{
            bottom: f.bottom,
            left: f.left,
            animationDelay: f.delay,
            animationDuration: f.duration,
          }}
        />
      ))}
    </div>
  );
}
