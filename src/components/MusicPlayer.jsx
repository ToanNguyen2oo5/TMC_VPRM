import { useState, useEffect, useRef } from 'react';
import { musicEngine, TRACK_LIST } from '../services/musicEngine';
import { useTranslation } from '../services/i18n';
import './MusicPlayer.css';

export default function MusicPlayer() {
  const { lang, t } = useTranslation();
  const [engineState, setEngineState] = useState(() => musicEngine.getState());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Subscribe to engine state changes
  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((newState) => {
      setEngineState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Play only on explicit user interaction
  useEffect(() => {
    let unmounted = false;

    const onFirstInteraction = () => {
      if (!unmounted && !musicEngine.hasExplicitlyPaused) {
        musicEngine.play().catch(() => {});
      }
      ['pointerdown', 'click', 'keydown', 'touchstart', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, onFirstInteraction, true);
      });
    };

    ['pointerdown', 'click', 'keydown', 'touchstart', 'scroll'].forEach((evt) => {
      window.addEventListener(evt, onFirstInteraction, { once: true, passive: true, capture: true });
    });

    return () => {
      unmounted = true;
      ['pointerdown', 'click', 'keydown', 'touchstart', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, onFirstInteraction, true);
      });
    };
  }, []);

  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    musicEngine.toggle();
  };

  const handleSelectTrack = (index) => {
    musicEngine.selectTrack(index);
    if (!engineState.isPlaying) {
      musicEngine.play().catch(() => {});
    }
  };

  const handleVolumeChange = (e) => {
    musicEngine.setVolume(parseFloat(e.target.value));
  };

  const { isPlaying, currentTrack, currentTrackIndex, volume } = engineState;

  return (
    <div className="music-player-wrap" ref={containerRef}>
      {/* Navbar Split Pill Controls */}
      <div className={`music-pill-group ${isPlaying ? 'music-pill-group--playing' : ''}`}>
        {/* Main ON / OFF Toggle Button */}
        <button
          type="button"
          className={`music-toggle-btn ${isPlaying ? 'music-toggle-btn--playing' : ''}`}
          onClick={handleTogglePlay}
          title={
            isPlaying
              ? (lang === 'en'
                  ? `Playing: ${currentTrack?.title} • Click to Mute / Pause`
                  : `Đang phát: ${currentTrack?.title} • Bấm để Tắt nhạc`)
              : (lang === 'en'
                  ? 'Click to Play Background Music (Lanterns on the River)'
                  : 'Bấm để Bật nhạc nền (Lanterns on the River)')
          }
          aria-label={isPlaying ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
        >
          <span className={`music-equalizer ${isPlaying ? 'music-equalizer--active' : ''}`}>
            <span className="music-bar" />
            <span className="music-bar" />
            <span className="music-bar" />
          </span>
          <span className="music-btn-label">
            {isPlaying
              ? (currentTrack?.id === 'lanterns-on-the-river'
                  ? 'Lanterns on River'
                  : currentTrack?.title || (lang === 'en' ? 'Music ON' : 'Đang phát'))
              : (lang === 'en' ? '🎵 Play BGM' : '🎵 Bật Nhạc')}
          </span>
          <span className={`music-status-dot ${isPlaying ? 'music-status-dot--active' : ''}`} />
        </button>

        {/* Options / Playlist Menu Trigger */}
        <button
          type="button"
          className={`music-menu-btn ${isOpen ? 'music-menu-btn--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          title={lang === 'en' ? 'Playlist & Volume Settings' : 'Danh sách nhạc & Âm lượng'}
          aria-label="Cài đặt nhạc"
        >
          <span className="music-menu-icon">{isOpen ? '▲' : '▾'}</span>
        </button>
      </div>

      {/* Music Drawer */}
      {isOpen && (
        <div className="music-drawer animate-scale-up">
          <div className="music-drawer-header">
            <span className="music-drawer-title">
              🎶 {lang === 'en' ? 'Heritage BGM & Court Music' : 'Nhạc Nền & Cổ Nhạc Việt'}
            </span>
            <button
              type="button"
              className="music-drawer-close"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Currently Playing Card */}
          <div className="now-playing-box">
            <div className="now-playing-header">
              <span className="now-playing-label">
                {isPlaying ? (lang === 'en' ? '● Playing' : '● Đang phát') : (lang === 'en' ? '○ Paused' : '○ Tạm dừng')}
              </span>
              {currentTrack?.isAudioFile && (
                <span className="now-playing-badge">🏮 BGM Gốc</span>
              )}
            </div>
            <h4 className="now-playing-title">{currentTrack?.title}</h4>
            <span className="now-playing-scale">{currentTrack?.scaleName}</span>
          </div>

          {/* Main Controls Row */}
          <div className="music-controls-row">
            <button
              type="button"
              className="music-ctrl-btn"
              onClick={() => musicEngine.prevTrack()}
              title="Bài trước"
            >
              ⏮
            </button>
            <button
              type="button"
              className="music-ctrl-btn music-ctrl-btn--main"
              onClick={handleTogglePlay}
              title={isPlaying ? 'Tạm dừng nhạc' : 'Bật phát nhạc'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              type="button"
              className="music-ctrl-btn"
              onClick={() => musicEngine.nextTrack()}
              title="Bài kế tiếp"
            >
              ⏭
            </button>
          </div>

          {/* Volume Slider */}
          <div className="volume-control-wrap">
            <span>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              title="Âm lượng"
            />
            <span style={{ fontSize: '0.75rem', opacity: 0.7, minWidth: '30px' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Track List */}
          <div className="music-track-list">
            {TRACK_LIST.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  type="button"
                  className={`music-track-item ${isCurrent ? 'music-track-item--active' : ''}`}
                  onClick={() => handleSelectTrack(idx)}
                >
                  <span className="track-item-icon">
                    {isCurrent && isPlaying ? '🔊' : isCurrent ? '⏸' : track.isAudioFile ? '🏮' : '🎵'}
                  </span>
                  <div className="track-item-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="track-item-title">{track.title}</span>
                      {track.isAudioFile && <span className="track-tag-bgm">BGM</span>}
                    </div>
                    <span className="track-item-desc">{track.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
