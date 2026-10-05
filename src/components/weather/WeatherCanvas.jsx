// src/components/weather/WeatherCanvas.jsx
import React, { useRef, useEffect, useState } from 'react';
import useWeatherCanvas from './useWeatherCanvas';
import { REG, MODES, mixHex } from './weatherThemes';
import './WeatherCanvas.css';

export default function WeatherCanvas({ regionKey, weatherType, isReducedMotion }) {
  const canvasRef = useRef(null);
  useWeatherCanvas(canvasRef, regionKey, weatherType, isReducedMotion);

  const [bgFront, setBgFront] = useState('A');
  const [styleA, setStyleA] = useState({});
  const [styleB, setStyleB] = useState({});

  useEffect(() => {
    const R = REG[regionKey] || REG['bac'];
    const M = MODES[weatherType] || MODES['clear'];
    const dimTo = '#262C34';
    const top = mixHex(R.sky[0], dimTo, M.dim * 1.15);
    const mid = mixHex(R.sky[1], '#171A1F', M.dim * 0.8);
    
    // Correct glow parsing (it can be null)
    let glowStyle = '';
    if (R.glow) {
      const isBright = weatherType === 'hot' || weatherType === 'clear' || R.auto === 'clear';
      const opacity = (0.38 * (1 - M.dim * 1.6) * (isBright ? 1 : 0.55)).toFixed(2);
      glowStyle = `radial-gradient(900px 520px at 86% -4%,rgba(${R.glow},${opacity}),transparent 72%),`;
    }
    
    const background = `${glowStyle}linear-gradient(180deg,${top} 0%,${mid} 52%,#17100D 100%)`;

    // Swap A and B to crossfade
    if (bgFront === 'A') {
      setStyleB({ background });
      setBgFront('B');
    } else {
      setStyleA({ background });
      setBgFront('A');
    }
  }, [regionKey, weatherType]);

  return (
    <div className="weather-system-container" aria-hidden="true">
      <div className="sky">
        <i className={bgFront === 'A' ? 'on' : ''} style={styleA}></i>
        <i className={bgFront === 'B' ? 'on' : ''} style={styleB}></i>
      </div>
      <canvas ref={canvasRef} id="fx" className="weather-canvas" />
      <div className="grain"></div>
      <div className="vig"></div>
    </div>
  );
}
