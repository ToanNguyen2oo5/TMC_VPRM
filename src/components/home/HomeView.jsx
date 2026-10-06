import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceTier } from '../../motion/useDeviceTier';
import HeroCarousel from '../HeroCarousel'; // we can keep it inside or replace it
import './HomeView.css';

gsap.registerPlugin(ScrollTrigger);

export default function HomeView({ EVENT_SHORTCUTS, handleQuickEventSelect, handleSelectFromOtherViews, t }) {
  const container = useRef(null);
  const tier = useDeviceTier();

  const [isMotionEnabled, setIsMotionEnabled] = React.useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (tier === 'low' || prefersReducedMotion) {
      setIsMotionEnabled(false);
      return;
    }
    setIsMotionEnabled(true);

    let ctx = gsap.context(() => {
      // 1. Hero Text Reveal (Masking)
      gsap.from('.hero-carousel__title, .hero-carousel__desc', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.2
      });

      // 2. Parallax Background
      gsap.to('.hero-carousel__bg', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-carousel',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // 3. Pinned Section
      const pinSection = document.querySelector('.story-pin-section');
      if (pinSection) {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.story-pin-section',
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1,
          }
        });

        pinTl.to('.pin-image-wrapper', {
          scale: 1,
          clipPath: 'inset(0% 0% 0% 0%)',
          borderRadius: '0px',
          ease: 'power2.inOut'
        })
        .to('.pin-text-1', { opacity: 0, y: -20, duration: 0.5 }, 0)
        .fromTo('.pin-text-2', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
      }

      // 4. Sequential Shortcuts
      gsap.from('.event-shortcut-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.event-shortcuts-grid',
          start: 'top 85%'
        }
      });

    }, container);

    return () => ctx.revert();
  }, [tier]);

  const handleMouseMove = (e) => {
    const cards = document.querySelectorAll('.event-shortcut-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  return (
    <div ref={container} className="home-view" onMouseMove={handleMouseMove}>
      <HeroCarousel onSelectOutfit={handleSelectFromOtherViews} />

      {/* GSAP Pinned Story Section */}
      <section className={`story-pin-section ${!isMotionEnabled ? 'static-story-section' : ''}`}>
        <div className="pin-content-wrapper">
           <div className="pin-text-container">
              <h2 className="pin-text-1 text-gradient">Khám Phá Di Sản</h2>
              <h2 className="pin-text-2 text-gradient" style={isMotionEnabled ? { position: 'absolute', top: 0 } : {}}>Qua Lăng Kính Thời Đại</h2>
           </div>
           <div className="pin-image-wrapper glass-panel">
              <img src="/images/hero_costumes_trio.jpg" alt="Việt Phục" className="pin-image" />
              <div className="pin-svg-overlay">
                 {/* Trống đồng SVG strokes drawing effect */}
                 <svg viewBox="0 0 100 100" className="trong-dong-svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(201, 161, 90, 0.4)" strokeWidth="1" strokeDasharray="300" strokeDashoffset="300" />
                 </svg>
              </div>
           </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="container event-shortcuts-section">
        <div className="section-header text-center" style={{ marginBottom: '1.25rem' }}>
          <span className="section-badge">{t('event_shortcuts_badge')}</span>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '0.25rem 0' }}>
            {t('event_shortcuts_title')}<span className="text-gradient">{t('event_shortcuts_question')}</span>
          </h3>
        </div>
        <div className="event-shortcuts-grid">
          {EVENT_SHORTCUTS.map(sc => {
            const scTitle = sc.id === 'tet' ? t('event_tet_title') :
              sc.id === 'tot-nghiep' ? t('event_grad_title') :
                sc.id === 'dam-cuoi' ? t('event_wedding_title') :
                  t('event_yearbook_title');
            const scDesc = sc.id === 'tet' ? t('event_tet_desc') :
              sc.id === 'tot-nghiep' ? t('event_grad_desc') :
                sc.id === 'dam-cuoi' ? t('event_wedding_desc') :
                  t('event_yearbook_desc');
            return (
              <button
                key={sc.id}
                type="button"
                className="event-shortcut-card glass-panel liquid-hover-card"
                onClick={() => handleQuickEventSelect(sc.id)}
              >
                <div className="liquid-glow-effect" />
                <span className="shortcut-icon">{sc.icon}</span>
                <div className="shortcut-text">
                  <h4>{scTitle}</h4>
                  <p>{scDesc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
