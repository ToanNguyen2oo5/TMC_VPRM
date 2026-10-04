import { useState, useRef, useCallback, useEffect } from 'react';
import { COSTUME_META } from '../data/costumeMeta';
import './TurntableViewer.css';

const ANGLES = [
  { label: 'Trước', angle: 0 },
  { label: 'Phải', angle: 90 },
  { label: 'Sau', angle: 180 },
  { label: 'Trái', angle: 270 }
];

const CULTURAL_STAGES = [
  { id: 1, title: 'Tuyển chọn tơ lụa di sản', desc: 'Lụa Vạn Phúc & gấm tơ tằm theo điển chế triều đại', icon: '🧵' },
  { id: 2, title: 'Hòa sắc Ngũ Hành tương sinh', desc: 'Cân bằng Kim - Mộc - Thủy - Hỏa - Thổ mang lại cát tường', icon: '🎨' },
  { id: 3, title: 'Gemini AI may đo & ướm tà', desc: 'Bóc tách vóc dáng và dựng dáng áo chuẩn tỷ lệ nhân vật', icon: '✨' },
  { id: 4, title: 'Đính cúc ngũ thường & phụ kiện', desc: 'Hoàn thiện nếp áo, khăn vấn, hài thêu và chuỗi ngọc', icon: '🪷' }
];

const FOLK_TRIVIA = [
  { quote: 'Năm hạt nút cài áo ngũ thân tượng trưng cho Ngũ thường Nho gia: Nhân, Lễ, Nghĩa, Trí, Tín.', author: 'Trần Quang Đức — Ngàn Năm Áo Mũ' },
  { quote: 'Viền cổ áo Nhật Bình mang 5 sắc Ngũ hành tương sinh, biểu trưng cho phúc thọ miên trường của hoàng tộc.', author: 'Đại Nam Hội Điển Sự Lệ' },
  { quote: 'Áo tứ thân mớ ba mớ bảy, yếm đào thắm sắc cùng nón quai thao dập dờn trong câu ca Quan họ Kinh Bắc.', author: 'Di sản UNESCO Quan Họ' },
  { quote: 'Khăn rằn đen trắng sông nước phương Nam gửi gắm nghĩa tình sắt son trước sau như một của người miệt vườn.', author: 'Bảo tàng Phụ nữ Nam Bộ' },
  { quote: 'Vạt áo Hữu Nhậm Đại Việt vắt chéo từ trái sang phải, biểu trưng cho lẽ thuận hòa âm dương đất trời.', author: 'Viện Khảo cổ học Việt Nam' }
];

export default function TurntableViewer({ 
  images, 
  isLoading, 
  progress,
  angleMode = 'single',
  isGeneratingRemaining = false,
  remainingProgress = null,
  onGenerateRemaining = null,
  selectedOutfit = null,
  customizationData = null
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [preloaded, setPreloaded] = useState({});
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);

  const isUsingSampleAvatar = !customizationData?.userPhoto;
  const avatarName = customizationData?.avatarLabel || (isUsingSampleAvatar ? 'Nữ mẫu 1' : 'ảnh của bạn');

  const containerRef = useRef(null);
  const dragStartX = useRef(0);
  const dragStartIndex = useRef(0);
  const rafId = useRef(null);
  const pendingIndex = useRef(0);
  const tiltRef = useRef({ x: 0, y: 0 });
  const wrapperRef = useRef(null);

  // Cycling stages & trivia during loading
  useEffect(() => {
    if (!isLoading) return;
    const stageTimer = setInterval(() => {
      setCurrentStageIdx(prev => (prev + 1) % CULTURAL_STAGES.length);
    }, 2800);
    const triviaTimer = setInterval(() => {
      setCurrentTriviaIdx(prev => (prev + 1) % FOLK_TRIVIA.length);
    }, 3800);

    return () => {
      clearInterval(stageTimer);
      clearInterval(triviaTimer);
    };
  }, [isLoading]);

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
  }, [images, preloaded]);

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

  // Get costume persona metadata
  const costumeMeta = selectedOutfit?.id ? COSTUME_META[selectedOutfit.id] : null;

  // Sensory Cultural Loading Screen
  if (isLoading) {
    const baseStage = CULTURAL_STAGES[currentStageIdx];
    const stage = baseStage.id === 3 ? {
      ...baseStage,
      title: isUsingSampleAvatar ? `Gemini AI tạo mockup trên ${avatarName}` : 'Gemini AI may đo & ướm tà',
      desc: isUsingSampleAvatar
        ? `Dựng nếp áo và tỷ lệ chuẩn mực trên nhân vật mẫu ${avatarName}`
        : 'Bóc tách vóc dáng và dựng dáng áo chuẩn tỷ lệ trên ảnh chân dung của bạn'
    } : baseStage;
    const trivia = FOLK_TRIVIA[currentTriviaIdx];

    return (
      <section className="turntable" id="turntable-viewer">
        <div className="turntable__header text-center">
          <span className="section-badge animate-pulse">✨ AI Di Sản Đang May Đo</span>
          <h2 className="turntable__title" style={{ marginTop: '0.5rem' }}>
            Hành Trình <span className="text-gradient">Ướm Việt Phục Số</span>
          </h2>
          <p className="turntable__subtitle">
            {isUsingSampleAvatar
              ? `Hệ thống đang kết hợp Google Gemini AI với điển chế cổ phục để tạo mockup trên ${avatarName}`
              : 'Hệ thống đang kết hợp Google Gemini AI với điển chế cổ phục để ướm thử trang phục lên ảnh chân dung của bạn'}
          </p>
        </div>

        <div className="turntable__cultural-loader glass-panel animate-fade-in">
          {/* Circular Progress & Spinner */}
          <div className="loader-center-ring">
            <div className="lotus-pulse-core">
              <span className="core-icon">{stage.icon}</span>
            </div>
            <div className="loader-spinner-orbit" />
          </div>

          {/* Stepper Status */}
          <div className="loader-stage-info animate-fade-in-up" key={stage.id}>
            <span className="stage-step-tag">Giai đoạn {stage.id}/4</span>
            <h3 className="stage-title">{stage.title}</h3>
            <p className="stage-desc">{stage.desc}</p>
          </div>

          {/* Progress bar */}
          <div className="loader-progress-track">
            <div 
              className="loader-progress-fill" 
              style={{ width: progress ? `${Math.round((progress.current / progress.total) * 100)}%` : `${(currentStageIdx + 1) * 25}%` }}
            />
          </div>

          {/* Folklore Trivia Card */}
          <div className="loader-trivia-box animate-fade-in" key={currentTriviaIdx}>
            <div className="trivia-header">
              <span className="trivia-icon">📖</span>
              <span className="trivia-badge">Giai thoại di sản bạn có biết?</span>
            </div>
            <p className="trivia-quote">"{trivia.quote}"</p>
            <span className="trivia-author">— {trivia.author}</span>
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
        <div className="ai-mockup-tag">
          <span className="ai-tag-dot" />
          <span>Minh họa AI • {isUsingSampleAvatar ? `Mockup ${avatarName}` : 'Ảnh thử đồ cá nhân'}</span>
        </div>

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
