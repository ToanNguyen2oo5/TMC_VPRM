import { useState, useMemo } from 'react';
import CostumeDetailModal from './CostumeDetailModal';
import './OutfitSuggestions.css';

function getRegionBadgeClass(region) {
  const r = (region || '').toLowerCase();
  if (r.includes('bắc') || r === 'bắc') return 'badge-bac';
  if (r.includes('trung') || r === 'trung') return 'badge-trung';
  if (r.includes('nam') || r === 'nam') return 'badge-nam';
  return 'badge-chung';
}

export default function OutfitSuggestions({ 
  outfits, 
  onSelect, 
  selectedId, 
  selectedScene, 
  realtimeWeather 
}) {
  const [modalOutfit, setModalOutfit] = useState(null);

  // Sắp xếp outfit gợi ý phù hợp nhất theo bối cảnh & thời tiết thực tế
  const sortedOutfits = useMemo(() => {
    if (!outfits) return [];
    return [...outfits].sort((a, b) => {
      const aSceneMatch = selectedScene && a.boi_canh_phu_hop.some(s => s.toLowerCase().includes(selectedScene.toLowerCase()));
      const bSceneMatch = selectedScene && b.boi_canh_phu_hop.some(s => s.toLowerCase().includes(selectedScene.toLowerCase()));

      const aWeatherMatch = realtimeWeather?.recommendation?.outfitIds?.includes(a.id);
      const bWeatherMatch = realtimeWeather?.recommendation?.outfitIds?.includes(b.id);

      const scoreA = (aSceneMatch ? 3 : 0) + (aWeatherMatch ? 2 : 0);
      const scoreB = (bSceneMatch ? 3 : 0) + (bWeatherMatch ? 2 : 0);

      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return 0;
    });
  }, [outfits, selectedScene, realtimeWeather]);

  if (!sortedOutfits || sortedOutfits.length === 0) {
    return (
      <section className="outfit-suggestions" id="outfit-suggestions">
        <div className="outfit-suggestions__empty animate-fade-in">
          <p className="empty-tip">Vui lòng chọn bối cảnh phù hợp để khám phá các mẫu Việt phục tương ứng</p>
        </div>
      </section>
    );
  }

  return (
    <section className="outfit-suggestions" id="outfit-suggestions">
      <div className="outfit-suggestions__header animate-fade-in-up">
        <span className="outfit-suggestions__label">Bước 2 / 4</span>
        <h2 className="outfit-suggestions__title">
          Danh mục <span className="text-gradient">Việt Phục tiêu biểu</span>
        </h2>
        <p className="outfit-suggestions__subtitle">
          {sortedOutfits.length} di sản y phục đặc trưng — Chọn bộ trang phục bạn yêu thích nhất để bắt đầu phối đồ
        </p>
      </div>

      {/* Real-time Weather Recommendation Callout Pill */}
      {realtimeWeather && (
        <div className="outfit-weather-callout-pill animate-fade-in">
          <div className="weather-pill-main">
            <span className="weather-pill-icon">{realtimeWeather.condition.icon}</span>
            <span className="weather-pill-title">
              Khí hậu {realtimeWeather.city} ({realtimeWeather.temp}°C, {realtimeWeather.condition.textVi}):
            </span>
            <span className="weather-pill-text">{realtimeWeather.recommendation.adviceVi}</span>
          </div>
          {realtimeWeather.recommendation.recommendedFabricsVi?.length > 0 && (
            <span className="weather-pill-tag">
              🧵 Vải khuyên dùng: {realtimeWeather.recommendation.recommendedFabricsVi.join(', ')}
            </span>
          )}
        </div>
      )}

      <div className="outfit-grid">
        {sortedOutfits.map((outfit, index) => {
          const isSelected = selectedId === outfit.id;
          const isModern = outfit.category === 'hien_dai' || outfit.id.includes('cach_tan');
          const isTopRecommended = selectedScene && outfit.boi_canh_phu_hop.some(s => s.toLowerCase().includes(selectedScene.toLowerCase()));
          const isWeatherRecommended = realtimeWeather?.recommendation?.outfitIds?.includes(outfit.id);

          return (
            <div
              key={outfit.id}
              className={`outfit-card glass-card animate-fade-in-up stagger-${(index % 4) + 1} ${
                isSelected ? 'outfit-card--active' : ''
              }`}
              id={`outfit-${outfit.id}`}
            >
              {/* Highlight badge for top recommendation */}
              {isTopRecommended && (
                <div className="top-recommend-badge">
                  ✨ Gợi ý cho dịp này
                </div>
              )}

              {/* Real-time Weather matching badge */}
              {isWeatherRecommended && (
                <div className="weather-recommend-badge" title={realtimeWeather?.recommendation?.adviceVi}>
                  <span>{realtimeWeather?.condition?.icon} Chuẩn thời tiết ({realtimeWeather?.temp}°C)</span>
                </div>
              )}

              {/* Card Image Thumbnail */}
              <div
                className="outfit-card__img-wrap"
                onClick={() => onSelect(outfit)}
              >
                <div className="outfit-card__placeholder">
                  <span className="outfit-card__placeholder-icon">👘</span>
                  <span className="outfit-card__placeholder-title">{outfit.ten}</span>
                  <span className="outfit-card__placeholder-era">{outfit.era || 'Di sản Việt Nam'}</span>
                </div>
                <img
                  src={outfit.anh_dai_dien}
                  alt={outfit.ten}
                  className="outfit-card__img"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="outfit-card__img-overlay">
                  <span>✨ Chạm để chọn phối</span>
                </div>
              </div>

              {/* Top row with badges */}
              <div className="outfit-card__top">
                <div className="outfit-card__badges">
                  <span className={`badge ${isModern ? 'badge-modern' : 'badge-heritage'}`}>
                    {isModern ? 'Cách tân' : 'Cổ truyền'}
                  </span>
                  <span className={`badge ${getRegionBadgeClass(outfit.vung_mien)}`}>
                    {outfit.vung_mien}
                  </span>
                </div>
                <span className="outfit-card__gender-badge">
                  {outfit.gioi_tinh === 'nữ' ? 'Nữ' : outfit.gioi_tinh === 'nam' ? 'Nam' : 'Unisex'}
                </span>
              </div>

              {/* Title & short info */}
              <div className="outfit-card__info" onClick={() => onSelect(outfit)}>
                <h3 className="outfit-card__name">{outfit.ten}</h3>
                {outfit.era && <span className="outfit-card__era">{outfit.era}</span>}
                <p className="outfit-card__desc-line">{outfit.mo_ta_ngan}</p>
              </div>

              {/* Color swatches */}
              <div className="outfit-card__colors">
                {outfit.mau_dac_trung.slice(0, 4).map((color, i) => (
                  <span
                    key={i}
                    className="outfit-card__swatch"
                    title={color}
                    style={{ backgroundColor: colorNameToHex(color) }}
                  />
                ))}
              </div>

              {/* Actions Footer */}
              <div className="outfit-card__actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm outfit-learn-btn"
                  onClick={() => setModalOutfit(outfit)}
                  title="Xem lịch sử và ý nghĩa văn hóa"
                >
                  📖 Tìm hiểu
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'} outfit-select-btn`}
                  onClick={() => onSelect(outfit)}
                >
                  {isSelected ? '✓ Đang chọn' : 'Chọn phối đồ'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cultural Detail Modal */}
      <CostumeDetailModal
        outfit={modalOutfit}
        isOpen={Boolean(modalOutfit)}
        onClose={() => setModalOutfit(null)}
        onSelectForMixer={onSelect}
      />
    </section>
  );
}

function colorNameToHex(name) {
  const map = {
    'tím Huế': '#7A3B7A',
    'trắng ngà': '#FAF7F0',
    'xanh ngọc bích': '#2E8B57',
    'đỏ thắm': '#B22222',
    'đỏ son': '#C83838',
    'pastel hồng': '#F4C2C2',
    'be': '#F5F5DC',
    'trắng kem': '#FFFDD0',
    'đen classic': '#1A1A1A',
    'xanh cobalt': '#0047AB',
    'nâu non': '#8B5A2B',
    'vàng mỡ gà': '#FFDF73',
    'đen': '#1A1A1A',
    'trắng': '#FFFFFF',
    'xanh thẫm': '#1B365D',
    'nâu gụ': '#4A2E18',
    'vàng hoàng gia': '#DAA520',
    'nâu đất': '#5C4033',
    'xanh lá đậm': '#2E5A27',
    'vàng đồng': '#B8860B'
  };
  return map[name] || '#888888';
}
