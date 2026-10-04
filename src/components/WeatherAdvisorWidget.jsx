import { useState, useEffect, useCallback } from 'react';
import { getAllRegionsWeather, getRegionWeather, getWeatherByCoords } from '../services/weatherService';
import './WeatherAdvisorWidget.css';

function WeatherSvgIcon({ type, size = 28 }) {
  if (type === 'sunny') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="weather-svg-icon">
        <circle cx="12" cy="12" r="5" fill="#F59E0B" fillOpacity="0.25" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  if (type === 'rainy' || type === 'stormy') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="weather-svg-icon">
        <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" fill="#38BDF8" fillOpacity="0.2" />
        <line x1="8" y1="19" x2="8" y2="23" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <line x1="16" y1="19" x2="16" y2="23" />
      </svg>
    );
  }
  // Default partly cloudy / mild
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="weather-svg-icon">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" fill="#60A5FA" fillOpacity="0.2" />
      <circle cx="12" cy="7" r="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity="0.3" />
    </svg>
  );
}

export default function WeatherAdvisorWidget({
  selectedRegion = 'all',
  onRegionSelect,
  realtimeWeather,
  onRealtimeWeatherChange,
  onSelectOutfitById,
  isWeatherFilterActive = false,
  onToggleWeatherFilter
}) {
  const [allWeather, setAllWeather] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [locationDropdown, setLocationDropdown] = useState(selectedRegion || 'all');

  // Load all 3 regions weather for "Tất cả vùng miền"
  useEffect(() => {
    let isMounted = true;
    getAllRegionsWeather()
      .then(res => {
        if (isMounted) {
          setAllWeather(res);
        }
      })
      .catch(err => {
        console.warn('Load all weather error:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Sync internal dropdown with prop
  useEffect(() => {
    setLocationDropdown(selectedRegion || 'all');
  }, [selectedRegion]);

  const handleDropdownChange = useCallback(async (newRegion) => {
    setLocationDropdown(newRegion);
    if (onRegionSelect) {
      onRegionSelect(newRegion);
    }

    if (newRegion === 'all') return;

    if (newRegion === 'gps') {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const data = await getWeatherByCoords(pos.coords.latitude, pos.coords.longitude, 'Vị trí của bạn');
          if (data && onRealtimeWeatherChange) onRealtimeWeatherChange(data);
        },
        () => {
          getRegionWeather('bac').then(fallback => {
            if (onRealtimeWeatherChange) onRealtimeWeatherChange(fallback);
          });
        }
      );
      return;
    }

    const data = await getRegionWeather(newRegion);
    if (data && onRealtimeWeatherChange) {
      onRealtimeWeatherChange(data);
    }
  }, [onRegionSelect, onRealtimeWeatherChange]);

  const isAllRegions = selectedRegion === 'all' || !selectedRegion;

  // Active single-region weather data
  const currentSingle = realtimeWeather || allWeather?.bac;

  return (
    <div className={`weather-advisor-widget glass-panel ${isCollapsed ? 'weather-advisor-widget--collapsed' : ''}`}>
      {/* Top Header Bar */}
      <div className="weather-advisor-top">
        <div className="weather-advisor-title-row">
          <span className="weather-title-badge">
            <span className="live-pulse-dot" /> Thời tiết hôm nay
          </span>
          <span className="weather-update-clock">
            {currentSingle?.isRealtime ? `Cập nhật: ${currentSingle.lastUpdated}` : 'Dữ liệu trực tiếp'}
          </span>
        </div>

        {/* Location Dropdown / Switcher (Point 6) */}
        <div className="weather-location-select-wrap">
          <label htmlFor="weather-location-select" className="location-label">
            📍 Địa điểm:
          </label>
          <select
            id="weather-location-select"
            className="weather-location-select"
            value={locationDropdown}
            onChange={(e) => handleDropdownChange(e.target.value)}
          >
            <option value="all">🇻🇳 Cả 3 miền (Bắc - Trung - Nam)</option>
            <option value="bac">🏔️ Miền Bắc (Hà Nội)</option>
            <option value="trung">🌊 Miền Trung (Huế)</option>
            <option value="nam">🌴 Miền Nam (TP.HCM)</option>
            <option value="gps">📍 GPS (Vị trí hiện tại của bạn)</option>
          </select>

          {/* Collapse toggle (Point 10) */}
          <button
            type="button"
            className="btn-collapse-weather"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Mở rộng khung thời tiết' : 'Thu gọn khung thời tiết'}
            aria-label="Thu gọn/mở rộng"
          >
            {isCollapsed ? '▼ Mở rộng' : '▲ Thu gọn'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {!isCollapsed && (
        <>
          {/* CASE 1: TẤT CẢ VÙNG MIỀN -> HIỆN CẢ 3 MIỀN BẮC - TRUNG - NAM (User explicit request) */}
          {isAllRegions ? (
            <div className="weather-three-regions-grid animate-fade-in">
              {[
                { key: 'bac', name: 'Bắc Bộ', city: 'Hà Nội', icon: '🏔️', data: allWeather?.bac },
                { key: 'trung', name: 'Trung Bộ', city: 'Huế', icon: '🌊', data: allWeather?.trung },
                { key: 'nam', name: 'Nam Bộ', city: 'TP.HCM', icon: '🌴', data: allWeather?.nam },
              ].map(reg => {
                const w = reg.data;
                const isSelected = selectedRegion === reg.key;
                return (
                  <div key={reg.key} className={`three-region-card ${isSelected ? 'three-region-card--active' : ''}`}>
                    <div className="three-region-card-top">
                      <div className="region-name-group">
                        <span className="region-icon">{reg.icon}</span>
                        <div>
                          <strong className="region-name">{reg.name}</strong>
                          <span className="region-city">({reg.city})</span>
                        </div>
                      </div>
                      {w && (
                        <div className="region-temp-group">
                          <WeatherSvgIcon type={w.condition?.type} size={24} />
                          <span className="region-temp-number">{w.temp}°C</span>
                        </div>
                      )}
                    </div>

                    {w ? (
                      <>
                        <div className="region-condition-desc">
                          <span className="cond-tag">{w.condition?.textVi}</span>
                          <span className="cond-tip">{w.recommendation?.headlineVi}</span>
                        </div>

                        {/* Clickable chips to interact with outfits (Point 7) */}
                        <div className="region-action-chips">
                          {w.recommendation?.recommendedOutfits?.slice(0, 2).map(outfit => (
                            <button
                              key={outfit.id}
                              type="button"
                              className="outfit-quick-chip"
                              onClick={() => {
                                if (onRegionSelect) onRegionSelect(reg.key);
                                if (onSelectOutfitById) onSelectOutfitById(outfit.id);
                              }}
                              title={`Chọn nhanh: ${outfit.name}`}
                            >
                              <span>👘</span> {outfit.name}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="region-card-loading">
                        <span className="skeleton-line" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* CASE 2: TỪNG VÙNG CỤ THỂ (Bắc / Trung / Nam / GPS) -> HIỂN THỊ CHI TIẾT THEO 11 ĐIỂM CỦA Ý TƯỞNG */
            <div className="weather-single-region-card animate-fade-in">
              <div className="weather-single-body">
                {/* Left: Big Temp & Icon (Point 2) */}
                <div className="weather-metric-box">
                  <div className="temp-icon-col">
                    <WeatherSvgIcon type={currentSingle?.condition?.type} size={38} />
                    <span className="big-temp-value">{currentSingle?.temp ?? 25}°C</span>
                  </div>
                  <div className="metric-text-col">
                    <strong className="metric-city-name">{currentSingle?.city || 'Đang cập nhật'}</strong>
                    <span className="metric-condition-text">{currentSingle?.condition?.textVi || 'Trời dịu mát'}</span>
                    <small className="metric-sub-stats">
                      Độ ẩm: {currentSingle?.humidity ?? 75}% • Gió: {currentSingle?.windSpeed ?? 10} km/h
                    </small>
                  </div>
                </div>

                {/* Right: Garment Advice (Point 3, 5) */}
                <div className="weather-advice-box">
                  <div className="advice-headline-row">
                    <span className="advice-label">💡 Gợi ý hôm nay nên mặc:</span>
                    {currentSingle?.recommendation?.recommendedFabricsVi?.length > 0 && (
                      <span className="fabric-pill">
                        🧵 Vải tối ưu: {currentSingle.recommendation.recommendedFabricsVi.join(', ')}
                      </span>
                    )}
                  </div>
                  <p className="advice-main-content">
                    {currentSingle?.recommendation?.adviceVi || 'Thời tiết đẹp, thích hợp chụp ảnh ngoài trời với các bộ cổ phục truyền thống.'}
                  </p>
                  {currentSingle?.recommendation?.practicalFieldTipsVi?.[0] && (
                    <p className="advice-practical-field-tip">
                      🎯 <em>Lưu ý thực tế: {currentSingle.recommendation.practicalFieldTipsVi[0]}</em>
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom: Actionable Chips (Point 7 - Giá trị nhất!) */}
              <div className="weather-action-chips-bar">
                <span className="chips-bar-title">✨ Trang phục chuẩn thời tiết:</span>
                <div className="chips-list">
                  {currentSingle?.recommendation?.recommendedOutfits?.map(outfit => (
                    <button
                      key={outfit.id}
                      type="button"
                      className="weather-action-chip"
                      onClick={() => onSelectOutfitById && onSelectOutfitById(outfit.id)}
                      title={`Bấm để chọn ngay: ${outfit.name}`}
                    >
                      <span className="chip-emoji">👘</span>
                      <span className="chip-name">{outfit.name}</span>
                      <span className="chip-arrow">➔</span>
                    </button>
                  ))}

                  {/* Toggle filter only weather-friendly outfits */}
                  {onToggleWeatherFilter && (
                    <button
                      type="button"
                      className={`weather-action-chip weather-filter-toggle-chip ${isWeatherFilterActive ? 'weather-filter-toggle-chip--active' : ''}`}
                      onClick={onToggleWeatherFilter}
                    >
                      <span>{isWeatherFilterActive ? '✓ Đang lọc đồ hợp trời' : '🔍 Chỉ hiện đồ hợp thời tiết'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
