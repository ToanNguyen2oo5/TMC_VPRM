import { useState, useEffect } from 'react';
import { getAllRegionsWeather, REGIONS_WEATHER_CONFIG } from '../services/weatherService';
import LottieIcon from './LottieIcon';
import { weatherSunAnimation } from '../assets/lottieAnimations';
import './WeatherWidget.css';

export default function WeatherWidget({ onSelectOutfitId = null, compact = false }) {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('bac');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      try {
        const data = await getAllRegionsWeather();
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Weather widget load failed:', err);
        if (isMounted) setLoading(false);
      }
    }
    loadWeather();
    return () => { isMounted = false; };
  }, []);

  const activeWeather = weatherData ? weatherData[selectedRegion] : null;

  return (
    <div className={`weather-widget glass-panel ${compact ? 'weather-widget--compact' : ''}`}>
      <div className="weather-widget__header">
        <div className="weather-widget__title-group">
          <LottieIcon animationData={weatherSunAnimation} size={24} />
          <span className="weather-widget__title">Thời tiết & Gợi ý chất liệu</span>
        </div>
        {activeWeather?.isRealtime && (
          <span className="weather-widget__live-pill">
            <span className="live-dot" /> Trực tiếp {activeWeather.lastUpdated}
          </span>
        )}
      </div>

      {/* 3 tabs cho 3 miền */}
      <div className="weather-widget__region-tabs">
        {Object.keys(REGIONS_WEATHER_CONFIG).map((regionKey) => {
          const cfg = REGIONS_WEATHER_CONFIG[regionKey];
          const regionInfo = weatherData ? weatherData[regionKey] : null;
          const isSelected = selectedRegion === regionKey;

          return (
            <button
              key={regionKey}
              type="button"
              className={`weather-tab ${isSelected ? 'weather-tab--active' : ''}`}
              onClick={() => setSelectedRegion(regionKey)}
            >
              <span className="weather-tab__name">{cfg.shortNameVi}</span>
              <span className="weather-tab__temp">
                {regionInfo ? `${regionInfo.temp}°C` : `${cfg.defaultTemp}°C`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Nội dung chi tiết vùng đang chọn */}
      {loading ? (
        <div className="weather-widget__loading">
          <span className="skeleton" style={{ width: '100%', height: 48 }} />
        </div>
      ) : activeWeather ? (
        <div className="weather-widget__content animate-fade-in">
          <div className="weather-metric-row">
            <div className="metric-main">
              <span className="metric-temp">{activeWeather.temp}°C</span>
              <div className="metric-details">
                <span className="metric-condition">{activeWeather.condition.textVi}</span>
                <span className="metric-city">{activeWeather.city} • Độ ẩm {activeWeather.humidity}%</span>
              </div>
            </div>
          </div>

          <div className="weather-advice-box">
            <span className="advice-label">Mẹo phối Việt phục theo khí hậu:</span>
            <p className="advice-text">{activeWeather.recommendation.adviceVi}</p>
            
            {activeWeather.recommendation.recommendedFabricsVi && (
              <div className="fabric-chips">
                <span className="fabric-label">Vải khuyên dùng:</span>
                {activeWeather.recommendation.recommendedFabricsVi.map((fabric, idx) => (
                  <span key={idx} className="fabric-chip">{fabric}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
