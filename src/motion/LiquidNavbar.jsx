import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { springs } from './tokens';
import AppLogo from '../components/AppLogo';
import MusicPlayer from '../components/MusicPlayer';
import './liquid-glass.css';

export default function LiquidNavbar({
  activeTab,
  setActiveTab,
  logoVariant,
  t,
  comparedOutfits,
  savedLookbooks,
  realtimeWeather,
  petalsEnabled,
  handleTogglePetals,
  lang,
  toggleLang,
  theme,
  toggleTheme,
  showToast
}) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1080);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1080);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > 50 && y > lastY) {
      setHidden(true);
      setShowMoreMenu(false);
    } else {
      setHidden(false);
    }
    setLastY(y);
  });

  const tabs = [
    { id: 'home', label: t('nav_home') },
    { id: 'mixer', label: t('nav_mixer') },
    { id: 'webar', label: t('nav_webar') },
    { id: 'explore', label: t('nav_explore') },
    { id: 'compare', label: t('nav_compare'), count: comparedOutfits?.length || 0 },
    { id: 'lookbook', label: t('nav_lookbook'), count: savedLookbooks?.length || 0 },
    { id: 'culture', label: t('nav_culture') },
  ];

  const toggleMoreMenu = () => setShowMoreMenu(!showMoreMenu);

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="liquid-refraction">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <motion.nav 
        className="liquid-navbar-wrapper"
        variants={{
          visible: { y: 0 },
          hidden: { y: '-120%' }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="liquid-glass-navbar" style={{ filter: 'url(#liquid-refraction)' }}>
          <div className="nav-brand" onClick={() => setActiveTab('home')} title="Việt Phục Remix" style={{ cursor: 'pointer' }}>
            <AppLogo size="sm" variant={logoVariant} />
            <span className="brand-name">Việt Phục <span className="text-gradient">Remix</span></span>
          </div>

          {!isMobile && (
            <div className="liquid-nav-links">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`liquid-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTabDroplet"
                      className="nav-btn-droplet"
                      transition={springs.liquid}
                    />
                  )}
                  <span className="nav-btn-content">
                    {tab.label}
                    {tab.count > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={springs.bouncy}
                        className="nav-badge"
                      >
                        {tab.count}
                      </motion.span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="nav-controls-group">
            {isMobile ? (
               <button className="control-btn" onClick={toggleMoreMenu}>
                 <span>⚙️</span>
               </button>
            ) : (
               <div className="liquid-nav-controls">
                  {realtimeWeather && (
                    <button
                      type="button"
                      className="control-btn control-btn--weather"
                      onClick={() => setActiveTab('mixer')}
                      title={`Thời tiết thực tế: ${realtimeWeather.city}`}
                    >
                      <span className="live-dot" style={{ width: '8px', height: '8px', background: '#38ef7d', borderRadius: '50%' }} />
                      <span>{realtimeWeather.condition?.icon || '☀️'}</span>
                      <span className="control-btn-label">{realtimeWeather.temp}°C</span>
                    </button>
                  )}
                  <MusicPlayer />
                  <button
                    type="button"
                    className={`control-btn ${petalsEnabled ? 'control-btn--active' : ''}`}
                    onClick={handleTogglePetals}
                  >
                    <span>🌸</span>
                  </button>
                  <button
                    type="button"
                    className="control-btn control-btn--lang"
                    onClick={() => {
                      toggleLang();
                      showToast(lang === 'vi' ? '🇬🇧 EN' : '🇻🇳 VN');
                    }}
                  >
                    <span>{lang === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
                  </button>
                  <button
                    type="button"
                    className="control-btn"
                    onClick={toggleTheme}
                  >
                    <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
                  </button>
               </div>
            )}
            
            <AnimatePresence>
              {showMoreMenu && isMobile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={springs.soft}
                  className="liquid-more-menu"
                >
                  <MusicPlayer />
                  <button className="control-btn" onClick={handleTogglePetals}>🌸 Cánh sen</button>
                  <button className="control-btn" onClick={toggleLang}>{lang === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</button>
                  <button className="control-btn" onClick={toggleTheme}>{theme === 'dark' ? '🌙 Tối' : '☀️ Sáng'}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
