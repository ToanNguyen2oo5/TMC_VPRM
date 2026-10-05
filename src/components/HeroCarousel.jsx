import React, { useState, useEffect } from 'react';
import { getAllOutfits } from '../services/cultureData';
import { useTranslation } from '../services/i18n';
import './HeroCarousel.css';

const ERAS = [
  { 
    id: 'ly-tran', 
    eraTitle: 'Thế kỷ 11 – 18', 
    place: 'Lý – Trần – Lê', 
    name: 'Áo giao lĩnh',
    timelineLabel: 'Giao lĩnh',
    desc: 'Hai vạt áo bắt chéo trước ngực, thắt lại bằng dải lụa. Dáng áo giản dị mà trang nghiêm, còn thấy trong tranh, tượng và phù điêu cổ.',
    outfitId: 'ao_giao_linh',
    bgImage: '/images/bg_thang_long.jpg'
  },
  {
    id: 'kinh-bac', 
    eraTitle: 'Thế kỷ 12 – 20', 
    place: 'Kinh Bắc', 
    name: 'Áo tứ thân',
    timelineLabel: 'Tứ thân',
    desc: 'Bốn mảnh vải ghép thành hai vạt trước, hai vạt sau, buộc nút ở bụng, bên trong là yếm đỏ. Gắn với hội làng và làn điệu quan họ.',
    outfitId: 'ao_tu_than',
    bgImage: '/images/bg_kinh_bac.jpg'
  },
  {
    id: 'nguyen',
    eraTitle: '1802 – 1945', 
    place: 'Triều Nguyễn', 
    name: 'Áo Nhật Bình',
    timelineLabel: 'Nhật Bình',
    desc: 'Trang phục lễ của hoàng gia, nổi bật với phần cổ áo bản rộng thêu hoa văn và sắc vàng dành riêng cho cung đình.',
    outfitId: 'ao_nhat_binh',
    bgImage: '/images/bg_dai_noi_hue.jpg'
  },
  {
    id: 'nam-bo',
    eraTitle: 'Thế kỷ 19 đến nay', 
    place: 'Nam Bộ', 
    name: 'Áo bà ba',
    timelineLabel: 'Bà ba',
    desc: 'Áo ngắn, tay hẹp, cài khuy giữa, hợp khí hậu sông nước. Thường đi cùng khăn rằn và nón lá.',
    outfitId: 'ao_ba_ba_nam_bo',
    bgImage: '/images/bg_nam_bo.jpg'
  },
  {
    id: 'duong-dai',
    eraTitle: 'Thế kỷ 21', 
    place: 'Đương đại', 
    name: 'Áo dài cách tân',
    timelineLabel: 'Cách tân',
    desc: 'Giữ dáng áo dài, đổi chất liệu, màu sắc và đường cắt để mặc đi cà phê, đi làm, chụp ảnh phố.',
    outfitId: 'ao_dai_cach_tan',
    bgImage: '/images/bg_duong_dai.jpg'
  }
];

export default function HeroCarousel({ onSelectOutfit }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();
  const allOutfits = getAllOutfits();

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % ERAS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + ERAS.length) % ERAS.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 8000); // 8 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="hero-carousel">
      {/* Backgrounds - rendered outside the sliding content for smooth fading */}
      {ERAS.map((era, idx) => (
        <div 
          key={era.id + '_bg'}
          className={`hero-carousel__bg ${idx === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${era.bgImage})` }}
        />
      ))}
      <div className="hero-carousel__ambient-glow" />

      {/* Sliding Content Track */}
      <div className="hero-carousel__track-container">
        <div 
          className="hero-carousel__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {ERAS.map((era, idx) => {
            const outfitData = allOutfits.find(o => o.id === era.outfitId);
            return (
              <div className="hero-carousel__slide" key={era.id}>
                <div className="container hero-carousel__split-container">
                  {/* LEFT COLUMN: BRANDING & CALL TO ACTION */}
                  <div className={`hero-carousel__left ${idx === activeIndex ? 'animate-fade-in-up' : ''}`}>
                    <div className="hero-carousel__badge-row">
                      <span className="hero-carousel__badge-highlight">
                        🌸 {era.eraTitle} • {era.place}
                      </span>
                    </div>

                    <h1 className="hero-carousel__title">
                      <span className="text-gradient">{era.name}</span>
                    </h1>

                    <p className="hero-carousel__desc">
                      {era.desc}
                    </p>

                    <div className="hero-carousel__actions" style={{ justifyContent: 'flex-start' }}>
                      <button 
                        className="btn btn-primary btn-lg hero-cta-pulse"
                        onClick={() => onSelectOutfit(outfitData)}
                        style={{ minWidth: '180px', fontSize: '1.05rem', boxShadow: '0 4px 25px rgba(218, 165, 32, 0.5)' }}
                      >
                        ✨ Phối Bộ Này
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: DYNAMIC 3D COSTUME SHOWCASE */}
                  <div className={`hero-carousel__right ${idx === activeIndex ? 'animate-fade-in-up stagger-1' : ''}`}>
                    <div className="hero-carousel-stage">
                      <div className="stage-glow" />
                      <div 
                        className="stage-card" 
                        onClick={() => onSelectOutfit(outfitData)}
                        title="Chạm để phối bộ này"
                        style={{ cursor: 'pointer' }}
                      >
                        <img 
                          src={outfitData?.anh_dai_dien || '/images/hero_costumes_trio.jpg'} 
                          alt={era.name} 
                          className="stage-img stage-img--carousel"
                        />
                        <div className="stage-floating-tag">
                          <span className="tag-sparkle">✨</span>
                          <span>Chạm vào trang phục để phối đồ với AI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TIMELINE CONTROLS */}
      <div className="hero-carousel__timeline-wrapper container">
        <div className="hero-carousel__timeline-container">
          <button className="carousel-control-btn timeline-nav-btn" onClick={handlePrev} aria-label="Previous Era">❮</button>
          
          <div className="timeline-track">
            <div className="timeline-line"></div>
            {ERAS.map((era, idx) => (
              <div 
                key={era.id + '_timeline'}
                className={`timeline-point ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <div className="timeline-dot">
                  {idx === activeIndex && <div className="timeline-diamond" />}
                </div>
                <span className="timeline-label">{era.timelineLabel}</span>
              </div>
            ))}
          </div>

          <button className="carousel-control-btn timeline-nav-btn" onClick={handleNext} aria-label="Next Era">❯</button>
        </div>
      </div>
    </header>
  );
}
