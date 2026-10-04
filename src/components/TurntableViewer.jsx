import { useState, useRef, useCallback, useEffect } from 'react';
import './TurntableViewer.css';

const ANGLES = [
  { label: 'Trước', angle: 0 },
  { label: 'Phải', angle: 90 },
  { label: 'Sau', angle: 180 },
  { label: 'Trái', angle: 270 }
];

export default function TurntableViewer({ 
  images, 
  isLoading, 
  progress,
  angleMode = 'single',
  isGeneratingRemaining = false,
  remainingProgress = null,
  onGenerateRemaining = null
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [preloaded, setPreloaded] = useState({});

  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const rafId = useRef(null);
  const pendingIndex = useRef(0);
  const tiltRef = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  // Reset on new image set
  useEffect(() => {
    if (!images || images.length === 0) {
      setActiveIndex(0);
      setPreloaded({});
    }
  }, [images]);

  // Preload images into browser cache
  useEffect(() => {
    if (!images) return;
    images.forEach((src, i) => {
      if (preloaded[i]) return;
      const img = new Image();
      img.onload = () => setPreloaded(prev => ({ ...prev, [i]: true }));
      img.src = src.startsWith('http') ? src : `data:image/png;base64,${src}`;
    });
  }, [images]);

  // Apply tilt via rAF (no re-renders)
  const applyTilt = useCallback(() => {
    if (wrapperRef.current) {
      const { x, y } = tiltRef.current;
      wrapperRef.current.style.transform =
        `perspective(800px) rotateX(${x}deg) rotateY(${y}deg)`;
    }
    rafId.current = null;
  }, []);

  const scheduleTilt = useCallback(() => {
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(applyTilt);
    }
  }, [applyTilt]);

  // Parallax on hover (only when not dragging)
  const handleMouseMove = useCallback((e) => {
    if (isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current = { x: -yPct * 20, y: xPct * 20 };
    scheduleTilt();
  }, [isDragging, scheduleTilt]);

  const resetTilt = useCallback(() => {
    tiltRef.current = { x: 0, y: 0 };
    scheduleTilt();
  }, [scheduleTilt]);

  // Drag to spin
  const handlePointerDown = (e) => {
    if (!images || images.length <= 1) return;
    setIsDragging(true);
    dragStartX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragStartIndex.current = activeIndex;
    pendingIndex.current = activeIndex;
    resetTilt();
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !images || images.length <= 1) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const diff = clientX - dragStartX.current;
    const sensitivity = 60;
    const steps = Math.floor(Math.abs(diff) / sensitivity);

    if (steps > 0) {
      const dir = diff > 0 ? -1 : 1;
      let newIdx = (dragStartIndex.current + steps * dir) % images.length;
      if (newIdx < 0) newIdx += images.length;

      if (newIdx !== pendingIndex.current) {
        pendingIndex.current = newIdx;
        setActiveIndex(newIdx);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="turntable" id="turntable-viewer">
        <div className="turntable__header">
          <h2 className="turntable__title">
            Đang <span className="text-gradient">thử đồ</span> cho bạn…
          </h2>
          <p className="turntable__subtitle">AI đang may đo và áp dụng trang phục lên vóc dáng của bạn</p>
        </div>
        <div className="turntable__skeleton-frame">
          <div className="skeleton-shimmer" />
          <div className="turntable__skeleton-info">
            <span className="spinner" />
            <span>
              {progress ? `${Math.round((progress.current / progress.total) * 100)}%` : 'Đang xử lý…'}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (!images || images.length === 0) return null;

  const isMulti = angleMode === 'multi' || images.length > 1 || isGeneratingRemaining;
  const activeImg = images[activeIndex] || images[0];
  const imgSrc = activeImg && (activeImg.startsWith('http') ? activeImg : `data:image/png;base64,${activeImg}`);

  return (
    <section className="turntable" id="turntable-viewer">
      <div className="turntable__header">
        <h2 className="turntable__title">
          {images.length > 1 ? (
            <><span className="text-gradient">Kéo ngang</span> để xoay nhân vật 360°</>
          ) : (
            <>Ảnh trang phục <span className="text-gradient">Góc chính diện</span></>
          )}
        </h2>
        {images.length === 1 && !isMulti && (
          <p className="turntable__subtitle">
            Chế độ 1 góc nhìn (0°). Bạn có thể bấm tạo thêm 3 góc để xoay 360° bất cứ lúc nào.
          </p>
        )}
        {images.length > 1 && (
          <p className="turntable__subtitle">
            Vuốt kéo chuột hoặc bấm chọn các góc bên dưới để ngắm trang phục từ 4 hướng.
          </p>
        )}
      </div>

      <div
        className={`turntable__frame ${isDragging ? 'is-dragging' : ''}`}
        ref={containerRef}
        onMouseDown={handlePointerDown}
        onMouseMove={(e) => { handlePointerMove(e); handleMouseMove(e); }}
        onMouseUp={handlePointerUp}
        onMouseLeave={() => { handlePointerUp(); resetTilt(); }}
        onTouchStart={(e) => handlePointerDown(e.touches[0])}
        onTouchMove={(e) => handlePointerMove(e.touches[0])}
        onTouchEnd={handlePointerUp}
        style={{ cursor: images.length > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <div className="turntable__image-wrapper" ref={wrapperRef}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={`Góc nhìn ${ANGLES[activeIndex]?.label || 'Chính diện'}`}
              className="turntable__image"
              draggable={false}
            />
          ) : (
            <div className="turntable__placeholder">
              <span className="spinner" /> Đang tải…
            </div>
          )}
        </div>

        {/* Navigation dots or single angle info */}
        {isMulti ? (
          <nav className="turntable__dots">
            {ANGLES.map((a, i) => {
              const available = i < images.length;
              return (
                <button
                  key={i}
                  className={`turntable__dot ${i === activeIndex ? 'active' : ''} ${!available ? 'pending' : ''}`}
                  onClick={(e) => { e.stopPropagation(); if (available) setActiveIndex(i); }}
                  disabled={!available}
                  aria-label={a.label}
                >
                  {a.label} ({a.angle}°)
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="turntable__single-actions">
            <div className="turntable__angle-tag">
              <span className="tag-dot" />
              <span>Góc chính diện (0°)</span>
            </div>
            {onGenerateRemaining && (
              <button
                type="button"
                className="turntable__expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerateRemaining();
                }}
                disabled={isGeneratingRemaining}
              >
                🔄 Tạo thêm 3 góc còn lại để xoay 360°
              </button>
            )}
          </div>
        )}

        {/* Status of generating remaining angles */}
        {isGeneratingRemaining && (
          <div className="turntable__status-wrap">
            <span className="spinner spinner--sm" />
            <p className="turntable__status">
              Đang tạo ngầm các góc còn lại… ({images.length}/4
              {remainingProgress?.angle ? ` — Đang xử lý góc ${remainingProgress.angle}°` : ''})
            </p>
          </div>
        )}

        {images.length === 4 && (
          <p className="turntable__status turntable__status--complete">
            ✨ Đã hoàn tất trọn bộ 4 góc xoay 360° (Trước, Phải, Sau, Trái)!
          </p>
        )}
      </div>
    </section>
  );
}
