// src/components/weather/WeatherCanvas.jsx
import React, { useRef, useEffect } from 'react';
import { WeatherFXEngine, WEATHER_FX_SCENES } from './weatherFxEngine';
import './WeatherCanvas.css';

export default function WeatherCanvas({
  scene = 'sunny',
  isReducedMotion = false,
  isFullScreen = true,
  paused = false,
  wind,
  humidity
}) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Khởi tạo WeatherFXEngine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new WeatherFXEngine(canvas, {
      initialScene: scene,
      isFullScreen,
      isReducedMotion,
      isPaused: paused,
      wind,
      humidity
    });
    engineRef.current = engine;

    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [isFullScreen]);

  // Cập nhật cảnh thời tiết khi prop thay đổi
  useEffect(() => {
    if (engineRef.current && scene) {
      engineRef.current.setScene(scene);
    }
  }, [scene]);

  // Cập nhật gió và độ ẩm
  useEffect(() => {
    if (engineRef.current && typeof wind === 'number') {
      engineRef.current.setWind(wind);
    }
  }, [wind]);

  useEffect(() => {
    if (engineRef.current && typeof humidity === 'number') {
      engineRef.current.setHumidity(humidity);
    }
  }, [humidity]);

  // Cập nhật chế độ giảm chuyển động
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setReducedMotion(isReducedMotion);
    }
  }, [isReducedMotion]);

  // Cập nhật trạng thái tạm dừng (tiết kiệm GPU khi WebAR hoặc route khác cần toàn bộ tài nguyên)
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setPaused(paused);
    }
  }, [paused]);

  return (
    <div
      className={`weather-system-container ${isFullScreen ? 'weather-system-container--fullscreen' : ''}`}
      style={{ display: paused ? 'none' : 'block' }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="weather-canvas" />
      <div className="weather-canvas-vignette" />
    </div>
  );
}
