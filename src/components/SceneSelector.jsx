import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../services/i18n';
import { getRegionWeather, getWeatherByCoords } from '../services/weatherService';
import './SceneSelector.css';

const SCENES_DATA = {
  vi: [
    { id: 'tet', name: 'Tết Nguyên Đán', icon: '🏮', desc: 'Xuân về sum vầy, đón sắc đỏ may mắn' },
    { id: 'tot-nghiep', name: 'Lễ tốt nghiệp', icon: '🎓', desc: 'Dấu mốc thanh xuân, nghiêm trang áo tấc' },
    { id: 'dam-cuoi', name: 'Đám cưới / Hỷ sự', icon: '💒', desc: 'Ngày trọng đại lứa đôi, vương giả Nhật Bình' },
    { id: 'ky-yeu', name: 'Kỷ yếu & Thanh xuân', icon: '📸', desc: 'Lưu giữ khoảnh khắc học đường rực rỡ' },
    { id: 'chup-anh-di-san', name: 'Chụp ảnh di sản', icon: '🏛️', desc: 'Cố đô, đền chùa, phố cổ hoài niệm' },
    { id: 'le-hoi', name: 'Lễ hội truyền thống', icon: '🎊', desc: 'Hội Lim, hội chùa Hương, trẩy hội đầu năm' },
    { id: 'dao-pho', name: 'Dạo phố & Hàng ngày', icon: '🌆', desc: 'Thanh lịch, hiện đại, năng động Gen Z' },
  ],
  en: [
    { id: 'tet', name: 'Lunar New Year (Tết)', icon: '🏮', desc: 'Family reunion & auspicious crimson red' },
    { id: 'tot-nghiep', name: 'Graduation Ceremony', icon: '🎓', desc: 'Milestone of youth, dignified Áo Tấc' },
    { id: 'dam-cuoi', name: 'Weddings & Nuptials', icon: '💒', desc: 'Sacred matrimony, majestic Nhật Bình' },
    { id: 'ky-yeu', name: 'Yearbook & Memories', icon: '📸', desc: 'Vibrant youth and school nostalgia' },
    { id: 'chup-anh-di-san', name: 'Heritage Photoshoot', icon: '🏛️', desc: 'Ancient capitals, temples, and old towns' },
    { id: 'le-hoi', name: 'Traditional Festivals', icon: '🎊', desc: 'Spring festivals & cultural gatherings' },
    { id: 'dao-pho', name: 'Everyday & Promenade', icon: '🌆', desc: 'Elegant, modern, and energetic Gen Z' },
  ]
};

const WEATHERS_DATA = {
  vi: [
    { id: 'warm', name: 'Nắng ấm', icon: '☀️', tip: 'Lụa tơ tằm, voan nhẹ thoáng' },
    { id: 'cool', name: 'Se lạnh', icon: '🍂', tip: 'Gấm hoa chìm, áo tấc dày dặn' },
    { id: 'rain', name: 'Mưa phùn', icon: '🌧️', tip: 'Vải đũi bền màu, guốc mộc' },
    { id: 'hot', name: 'Nắng nóng', icon: '🌴', tip: 'Lụa mỏng mát, áo bà ba thoáng' },
  ],
  en: [
    { id: 'warm', name: 'Mild & Sunny', icon: '☀️', tip: 'Mulberry silk, lightweight chiffon' },
    { id: 'cool', name: 'Crisp & Chilly', icon: '🍂', tip: 'Subtle floral brocade, layered Áo Tấc' },
    { id: 'rain', name: 'Gentle Drizzle', icon: '🌧️', tip: 'Raw tussah silk, wooden clogs' },
    { id: 'hot', name: 'Warm & Tropical', icon: '🌴', tip: 'Breathable linen, light Áo Bà Ba' },
  ]
};

const STYLES_DATA = {
  vi: [
    { id: 'classic', name: 'Thanh lịch cổ điển', icon: '🪷', desc: 'Chuẩn quy chế cổ phong' },
    { id: 'modern', name: 'Cách tân Gen Z', icon: '✨', desc: 'Tà áo phối phụ kiện hiện đại' },
    { id: 'retro', name: 'Retro hoài niệm', icon: '📜', desc: 'Màu phim xưa, trầm mặc' },
    { id: 'dynamic', name: 'Năng động phóng khoáng', icon: '⚡', desc: 'Dễ dàng di chuyển, hoạt bát' },
  ],
  en: [
    { id: 'classic', name: 'Classic Elegance', icon: '🪷', desc: 'Strict historical etiquette' },
    { id: 'modern', name: 'Gen Z Remix', icon: '✨', desc: 'Traditional cuts with contemporary accents' },
    { id: 'retro', name: 'Vintage Nostalgia', icon: '📜', desc: 'Muted film tones, soulful mood' },
    { id: 'dynamic', name: 'Dynamic & Breezy', icon: '⚡', desc: 'Comfortable movement, spirited vibe' },
  ]
};

const REGIONS_DATA = {
  vi: [
    { id: 'all', name: 'Tất cả vùng miền', emoji: '🇻🇳' },
    { id: 'bac', name: 'Bắc Bộ (Kinh Bắc)', emoji: '🏔️' },
    { id: 'trung', name: 'Trung Bộ (Cung đình Huế)', emoji: '🌊' },
    { id: 'nam', name: 'Nam Bộ (Sông nước)', emoji: '🌴' },
    { id: 'taynguyen', name: 'Tây Nguyên & Dân tộc', emoji: '🌲' },
  ],
  en: [
    { id: 'all', name: 'All Regions', emoji: '🇻🇳' },
    { id: 'bac', name: 'Northern (Kinh Bắc)', emoji: '🏔️' },
    { id: 'trung', name: 'Central (Imperial Huế)', emoji: '🌊' },
    { id: 'nam', name: 'Southern (Mekong Delta)', emoji: '🌴' },
    { id: 'taynguyen', name: 'Highlands & Minorities', emoji: '🌲' },
  ]
};

export default function SceneSelector({
  onSceneSelect,
  onRegionSelect,
  selectedScene,
  selectedRegion,
  selectedWeather = 'warm',
  onWeatherSelect,
  selectedStyle = 'classic',
  onStyleSelect,
  onRealtimeWeatherChange
}) {
  const { lang, t } = useTranslation();
  const scenes = SCENES_DATA[lang] || SCENES_DATA.vi;
  const weathers = WEATHERS_DATA[lang] || WEATHERS_DATA.vi;
  const styles = STYLES_DATA[lang] || STYLES_DATA.vi;
  const regions = REGIONS_DATA[lang] || REGIONS_DATA.vi;

  const [activeWeatherTab, setActiveWeatherTab] = useState('bac');
  const [liveWeather, setLiveWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [isManualWeather, setIsManualWeather] = useState(false);

  // Sync region selection if already set
  useEffect(() => {
    if (selectedRegion && ['bac', 'trung', 'nam'].includes(selectedRegion.toLowerCase())) {
      setActiveWeatherTab(selectedRegion.toLowerCase());
    }
  }, [selectedRegion]);

  // Fetch real-time weather on change
  const fetchWeather = useCallback(async (tabKey) => {
    setIsWeatherLoading(true);
    try {
      if (tabKey === 'gps') {
        if (!navigator.geolocation) {
          setIsWeatherLoading(false);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const data = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude, 'Vị trí của bạn');
            if (data) {
              setLiveWeather(data);
              if (onRealtimeWeatherChange) onRealtimeWeatherChange(data);
            }
            setIsWeatherLoading(false);
          },
          (err) => {
            console.warn('GPS error, falling back to Hanoi:', err);
            getRegionWeather('bac').then(fallback => {
              setLiveWeather(fallback);
              if (onRealtimeWeatherChange) onRealtimeWeatherChange(fallback);
              setIsWeatherLoading(false);
            });
          },
          { timeout: 7000 }
        );
        return;
      }

      const data = await getRegionWeather(tabKey);
      setLiveWeather(data);
      if (onRealtimeWeatherChange) onRealtimeWeatherChange(data);
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  }, [onRealtimeWeatherChange]);

  useEffect(() => {
    fetchWeather(activeWeatherTab);
  }, [activeWeatherTab, fetchWeather]);

  return (
    <section className="scene-selector" id="scene-selector">
      <div className="scene-selector__header animate-fade-in-up">
        <span className="scene-selector__label">{t('step_prefix')} 1 / 4</span>
        <h2 className="scene-selector__title">
          {lang === 'en' ? 'Select ' : 'Chọn '}
          <span className="text-gradient">
            {lang === 'en' ? 'Occasion & Style' : 'sự kiện & phong cách'}
          </span>
          {lang === 'en' ? ' for You' : ' của bạn'}
        </h2>
        <p className="scene-selector__subtitle">
          {lang === 'en'
            ? 'Discover heritage outfit suggestions tailored to your occasion, climate, and personal vibe.'
            : 'Khám phá gợi ý y phục truyền thống được thiết kế riêng theo bối cảnh, thời tiết và gu thẩm mỹ'}
        </p>
      </div>

      {/* 1. SỰ KIỆN CHÍNH */}
      <div className="selector-group-block animate-fade-in-up">
        <label className="group-block-title">
          <span>🎯</span> {lang === 'en' ? 'Choose Occasion:' : 'Chọn dịp xuất hiện:'}
        </label>
        <div className="scene-grid">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={`scene-card glass-card animate-fade-in-up stagger-${(index % 4) + 1} ${
                selectedScene === scene.id ? 'scene-card--active' : ''
              }`}
              onClick={() => onSceneSelect(scene.id)}
              id={`scene-${scene.id}`}
              type="button"
            >
              <span className="scene-card__icon">{scene.icon}</span>
              <span className="scene-card__name">{scene.name}</span>
              <span className="scene-card__desc">{scene.desc}</span>
              {selectedScene === scene.id && (
                <span className="scene-card__check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THỜI TIẾT REAL-TIME & PHONG CÁCH (2 CỘT) */}
      <div className="selector-sub-grid animate-fade-in-up">
        {/* Thời tiết Real-time */}
        <div className="selector-sub-col glass-panel weather-realtime-panel">
          <div className="weather-col-header">
            <label className="group-block-title" style={{ margin: 0 }}>
              <span>🌦️</span> {lang === 'en' ? 'Live Weather & AI Advice:' : 'Thời tiết Real-time & Gợi ý:'}
            </label>
            {liveWeather?.isRealtime && (
              <span className="live-weather-badge">
                <span className="live-dot" /> Trực tiếp {liveWeather.lastUpdated}
              </span>
            )}
          </div>

          {/* Region Tabs */}
          <div className="weather-reg-pills">
            {[
              { id: 'bac', label: 'Bắc Bộ', city: 'Hà Nội', icon: '🏔️' },
              { id: 'trung', label: 'Trung Bộ', city: 'Huế', icon: '🌊' },
              { id: 'nam', label: 'Nam Bộ', city: 'TP.HCM', icon: '🌴' },
              { id: 'gps', label: 'GPS', city: 'Vị trí bạn', icon: '📍' },
            ].map(reg => (
              <button
                key={reg.id}
                type="button"
                className={`weather-reg-pill ${activeWeatherTab === reg.id ? 'weather-reg-pill--active' : ''}`}
                onClick={() => {
                  setActiveWeatherTab(reg.id);
                  if (reg.id !== 'gps' && onRegionSelect) {
                    onRegionSelect(reg.id);
                  }
                }}
              >
                <span>{reg.icon} {reg.label}</span>
              </button>
            ))}
          </div>

          {/* Realtime Weather Metric Card */}
          {isWeatherLoading ? (
            <div className="weather-live-loading">
              <span className="skeleton-pulse">⚡ Đang cập nhật khí tượng trực tiếp...</span>
            </div>
          ) : liveWeather ? (
            <div className="weather-live-card animate-fade-in">
              <div className="weather-live-top">
                <div className="weather-live-metric">
                  <span className="weather-live-icon">{liveWeather.condition.icon}</span>
                  <div className="weather-live-numbers">
                    <span className="weather-live-temp">{liveWeather.temp}°C</span>
                    <span className="weather-live-city">{liveWeather.city}</span>
                  </div>
                </div>
                <div className="weather-live-stats">
                  <span className="condition-text">{liveWeather.condition.textVi}</span>
                  <span className="condition-sub">Độ ẩm: {liveWeather.humidity}% • Gió: {liveWeather.windSpeed} km/h</span>
                </div>
              </div>

              {/* AI Garment Advice Callout */}
              <div className="weather-advice-callout">
                <div className="advice-title-row">
                  <span className="advice-badge">💡 Mẹo mặc đẹp hôm nay:</span>
                  {liveWeather.recommendation.recommendedFabricsVi && (
                    <span className="advice-fabric">
                      Vải: {liveWeather.recommendation.recommendedFabricsVi.join(', ')}
                    </span>
                  )}
                </div>
                <p className="advice-desc">{liveWeather.recommendation.adviceVi}</p>
                {liveWeather.recommendation.practicalFieldTipsVi?.[0] && (
                  <p className="advice-tip">
                    🎯 <em>Mẹo thực tế: {liveWeather.recommendation.practicalFieldTipsVi[0]}</em>
                  </p>
                )}
              </div>
            </div>
          ) : null}

          {/* Toggle manual simulation */}
          <div className="weather-toggle-row">
            <button
              type="button"
              className="weather-sim-toggle"
              onClick={() => setIsManualWeather(!isManualWeather)}
            >
              {isManualWeather ? '✕ Thu gọn (Dùng thời tiết thực)' : '⚙️ Hoặc mô phỏng thời tiết khác cho buổi chụp...'}
            </button>
          </div>

          {/* Manual Climate Buttons */}
          {isManualWeather && (
            <div className="sub-options-grid animate-fade-in" style={{ marginTop: '0.75rem' }}>
              {weathers.map(w => (
                <button
                  key={w.id}
                  type="button"
                  className={`sub-opt-btn ${selectedWeather === w.id ? 'sub-opt-btn--active' : ''}`}
                  onClick={() => onWeatherSelect && onWeatherSelect(w.id)}
                >
                  <span className="sub-opt-icon">{w.icon}</span>
                  <div className="sub-opt-info">
                    <strong>{w.name}</strong>
                    <small>{w.tip}</small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phong cách */}
        <div className="selector-sub-col glass-panel">
          <label className="group-block-title">
            <span>✨</span> {lang === 'en' ? 'Personal Aesthetic Style:' : 'Phong cách cá nhân:'}
          </label>
          <div className="sub-options-grid">
            {styles.map(s => (
              <button
                key={s.id}
                type="button"
                className={`sub-opt-btn ${selectedStyle === s.id ? 'sub-opt-btn--active' : ''}`}
                onClick={() => onStyleSelect && onStyleSelect(s.id)}
              >
                <span className="sub-opt-icon">{s.icon}</span>
                <div className="sub-opt-info">
                  <strong>{s.name}</strong>
                  <small>{s.desc}</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. VÙNG MIỀN */}
      <div className="selector-group-block animate-fade-in-up">
        <label className="group-block-title">
          <span>🗺️</span> {lang === 'en' ? 'Filter by Region:' : 'Lọc theo vùng miền:'}
        </label>
        <div className="region-chips">
          {regions.map(region => (
            <button
              key={region.id}
              type="button"
              className={`region-chip ${selectedRegion === region.id ? 'region-chip--active' : ''}`}
              onClick={() => onRegionSelect(region.id)}
              id={`region-${region.id}`}
            >
              <span className="region-chip__emoji">{region.emoji}</span>
              {region.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
