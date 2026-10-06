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
        .to('.pin-text-1', { opacity: 0, y: -15, duration: 0.5 }, 0)
        .fromTo('.pin-text-2', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
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
              <span className="pin-kicker">VIỆT PHỤC REMIX · DI SẢN SỐNG</span>
              <div className="pin-heading-wrap">
                <h2 className="pin-text-1">Khám Phá Di Sản</h2>
                <h2 className="pin-text-2">Qua Lăng Kính Thời Đại</h2>
              </div>
              <p className="pin-hero-copy">Từ nét xưa đến chất riêng của bạn.</p>
              <button
                type="button"
                className="pin-hero-cta"
                onClick={() => document.querySelector('.event-shortcuts-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Khám phá bộ sưu tập <span aria-hidden="true">→</span>
              </button>
           </div>
           <div className="pin-image-wrapper glass-panel">
              <div className="landmark-columns" aria-label="Hành trình danh lam Việt Nam">
                {[
                  ['/images/bg_thang_long.jpg', 'Hoàng thành', 'Thăng Long'],
                  ['/images/bg_kinh_bac.jpg', 'Hội Lim', 'Kinh Bắc'],
                  ['/images/bg_dai_noi_hue.jpg', 'Đại Nội', 'Huế'],
                  ['/images/bg_nam_bo.jpg', 'Chợ nổi', 'Miền Tây'],
                  ['/images/bg_duong_dai.jpg', 'Phố cổ', 'Hội An']
                ].map(([image, title, place], index) => (
                  <div className={`landmark-column landmark-column--${index + 1}`} key={place} style={{ '--landmark-image': `url(${image})` }}>
                    <span className="landmark-index">0{index + 1}</span>
                    <div className="landmark-column-copy">
                      <span>{title}</span>
                      <strong>{place}</strong>
                    </div>
                    <span className="landmark-line" />
                  </div>
                ))}
              </div>
              <div className="pin-svg-overlay">
                 {/* Trống đồng SVG strokes drawing effect */}
                 <svg viewBox="0 0 100 100" className="trong-dong-svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(201, 161, 90, 0.4)" strokeWidth="1" strokeDasharray="300" strokeDashoffset="300" />
                 </svg>
              </div>
              <div className="pin-image-vignette" />
              <div className="pin-floating-tag pin-floating-tag--left">THỦ CÔNG · TINH XẢO</div>
              <div className="pin-floating-tag pin-floating-tag--right">XƯA GẶP NAY</div>
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
