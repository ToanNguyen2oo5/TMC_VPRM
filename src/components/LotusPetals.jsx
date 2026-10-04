import { useState, useEffect, useMemo } from 'react';
import './LotusPetals.css';

export default function LotusPetals({ enabled = true }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [isScrollingFast, setIsScrollingFast] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check mobile screen
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });

    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Pause on visibility change
    const handleVisibilityChange = () => setIsTabHidden(document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Pause on fast scroll to prevent any frame drops
    let scrollTimer = null;
    let lastScrollTop = window.scrollY;
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      const speed = Math.abs(currentScrollTop - lastScrollTop);
      lastScrollTop = currentScrollTop;

      if (speed > 40 && !isScrollingFast) {
        setIsScrollingFast(true);
      }

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrollingFast(false);
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [isScrollingFast]);

  // Mobile: 8 petals, Desktop: 20 petals
  const count = isMobile ? 8 : 20;

  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count) + (i % 3) * 2).toFixed(1)}%`,
      delay: `${((i * 0.7) % 6).toFixed(1)}s`,
      duration: `${(8 + (i % 4) * 1.5).toFixed(1)}s`,
      size: `${isMobile ? 12 + (i % 2) * 3 : 14 + (i % 3) * 4}px`,
      rotationStart: `${(i * 37) % 360}deg`,
      swayAmount: `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 15)}px`
    }));
  }, [count, isMobile]);

  if (!enabled || prefersReducedMotion) return null;

  const isPaused = isTabHidden || isScrollingFast;

  return (
    <div
      className={`lotus-petals-container ${isPaused ? 'lotus-petals--paused' : ''}`}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="lotus-petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: `calc(${petal.size} * 1.35)`,
            '--sway': petal.swayAmount,
            '--rot': petal.rotationStart
          }}
        >
          <span className="petal-leaf" />
        </div>
      ))}
    </div>
  );
}
