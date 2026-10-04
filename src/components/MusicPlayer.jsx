import { useState, useEffect, useRef } from 'react';
import { musicEngine, TRACK_LIST } from '../services/musicEngine';
import { useTranslation } from '../services/i18n';
import './MusicPlayer.css';

export default function MusicPlayer() {
  const { lang, t } = useTranslation();
  const [engineState, setEngineState] = useState(() => musicEngine.getState());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = musicEngine.subscribe((newState) => {
      setEngineState(newState);
    });
    return () => unsubscribe();
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
      musicEngine.play();
    }
  };

  const handleVolumeChange = (e) => {
    musicEngine.setVolume(parseFloat(e.target.value));
  };

  const { isPlaying, currentTrack, currentTrackIndex, volume } = engineState;

  return (
    <div className="music-player-wrap" ref={containerRef}>
      {/* Navbar Button */}
      <button
        type="button"
        className={`music-toggle-btn ${isPlaying ? 'music-toggle-btn--playing' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isPlaying ? (lang === 'en' ? `Playing: ${currentTrack?.title} • Click to adjust` : `Đang phát: ${currentTrack?.title} • Bấm để chỉnh nhạc`) : (lang === 'en' ? 'Play Vietnamese Heritage Music' : 'Bật Nhạc Cổ Phong Cung Đình')}
        aria-label="Nhạc Cung Đình"
      >
        <span
          className={`music-equalizer ${isPlaying ? 'music-equalizer--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePlay(e);
          }}
          title={isPlaying ? (lang === 'en' ? 'Pause music' : 'Tạm dừng nhạc') : (lang === 'en' ? 'Play music' : 'Phát nhạc')}
        >
          <span className="music-bar" />
          <span className="music-bar" />
          <span className="music-bar" />
        </span>
        <span className="music-btn-label">
          {isPlaying ? (lang === 'en' ? 'Court Music' : 'Nhã Nhạc') : (lang === 'en' ? '🎵 Music' : '🎵 Nhạc')}
        </span>
      </button>

      {/* Music Drawer */}
      {isOpen && (
        <div className="music-drawer animate-scale-up">
          <div className="music-drawer-header">
            <span className="music-drawer-title">
              🎶 {lang === 'en' ? 'Vietnamese Court & Folk Music' : 'Nhã Nhạc & Cổ Nhạc Việt'}
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
            <span className="now-playing-label">
              {isPlaying ? (lang === 'en' ? '● Playing' : '● Đang ngân nga') : (lang === 'en' ? '○ Paused' : '○ Tạm dừng')}
            </span>
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
              title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
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
                    {isCurrent && isPlaying ? '🔊' : isCurrent ? '⏸' : '🎵'}
                  </span>
                  <div className="track-item-info">
                    <span className="track-item-title">{track.title}</span>
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
