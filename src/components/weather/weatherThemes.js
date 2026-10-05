// src/components/weather/weatherThemes.js

export const REG = {
  bac:   { name: 'Bắc Bộ (Kinh Bắc)',     city: 'Hà Nội', temp: 24, hum: 71, wind: 8,  w: .2,  tint: '120,170,175', sky: ['#3E555B', '#26312F'], glow: null,          fog: '#C9D8D6', flavor: 'leaves',  auto: 'fog',   autoCond: 'Sương mỏng, mưa phùn nhẹ', autoFx: { rain: .18, style: 0 } },
  trung: { name: 'Trung Bộ (Cung đình Huế)', city: 'Huế',   temp: 28, hum: 74, wind: 22, w: 1,   tint: '232,190,120', sky: ['#9A7A4E', '#3B2D22'], glow: '255,214,150', fog: '#E0D4BC', flavor: 'petals',  auto: 'clear', autoCond: 'Nắng gió, mây chạy nhanh', autoFx: { clouds: 1, rays: .85 } },
  nam:   { name: 'Nam Bộ (Sông nước)',    city: 'TP.HCM', temp: 31, hum: 66, wind: 9,  w: .25, tint: '255,170,90',  sky: ['#D9833A', '#6B3A1E'], glow: '255,190,110', fog: '#E6D2B8', flavor: 'motes',   auto: 'hot',   autoCond: 'Nắng gắt, chiều có mưa rào', autoFx: null },
  taynguyen: { name: 'Tây Nguyên & Dân tộc',  city: 'Đà Lạt', temp: 19, hum: 78, wind: 11, w: .35, tint: '150,190,140', sky: ['#5E7260', '#2B3328'], glow: '255,226,170', fog: '#D7E0CC', flavor: 'daisy',   auto: 'fog',   autoCond: 'Sương núi, nắng sớm',      autoFx: { fog: .85, rays: .6 } },
  all:   { name: 'Tất cả vùng miền',      city: 'Việt Nam', temp: 26, hum: 70, wind: 12, w: .5, tint: '120,170,175', sky: ['#3E555B', '#26312F'], glow: null,          fog: '#C9D8D6', flavor: 'leaves',  auto: 'fog',   autoCond: 'Sương mỏng, thời tiết ôn hoà', autoFx: { rain: .1, style: 0 } }
};

export const MODES = {
  clear:   { label: 'Quang',    cond: 'Trời quang, nắng đẹp',     fx: { fog: 0,   clouds: .3, rain: 0,   style: 1, ripple: 0, rays: .55, motes: .3 }, dim: 0,   dT: 0,  dH: -8,  dW: 0, want: 'light', icon: 'sun' },
  cloud:   { label: 'Nhiều mây', cond: 'Nhiều mây, ánh sáng dịu', fx: { fog: .15, clouds: 1,  rain: 0,   style: 1, ripple: 0, rays: 0,   motes: 0 },  dim: .12, dT: -2, dH: 0,   dW: 0, want: 'mid',   icon: 'cloud' },
  fog:     { label: 'Sương',    cond: 'Sương mỏng, se lạnh',      fx: { fog: 1,   clouds: .35, rain: 0,  style: 1, ripple: 0, rays: 0,   motes: 0 },  dim: .1,  dT: -3, dH: 10,  dW: 0, want: 'warm',  icon: 'fog' },
  drizzle: { label: 'Mưa phùn', cond: 'Mưa phùn nhẹ',             fx: { fog: .45, clouds: .85, rain: .45, style: 0, ripple: 0, rays: 0,  motes: 0 },  dim: .3,  dT: -3, dH: 10,  dW: 1, want: 'mid',   icon: 'drizzle' },
  shower:  { label: 'Mưa rào',  cond: 'Mưa rào, tạnh nhanh',      fx: { fog: .12, clouds: 1,  rain: 1,   style: 1, ripple: 1, rays: 0,   motes: 0 },  dim: .5,  dT: -5, dH: 14,  dW: 6, want: 'mid',   icon: 'shower' },
  hot:     { label: 'Nắng gắt', cond: 'Nắng gắt',                 fx: { fog: 0,   clouds: .1, rain: 0,   style: 1, ripple: 0, rays: 1,   motes: 1 },  dim: 0,   dT: 3,  dH: -12, dW: 0, want: 'light', icon: 'sun' }
};

export const WEATHER_TYPES = ['clear', 'cloud', 'fog', 'drizzle', 'shower', 'hot'];

// Map Realtime Weather to Mode
export const mapConditionToWeatherType = (conditionType, temp) => {
  if (temp >= 33) return 'hot';
  if (!conditionType) return 'clear';
  if (conditionType.includes('rain') || conditionType.includes('drizzle')) return 'drizzle';
  if (conditionType.includes('storm') || conditionType.includes('heavy_rain')) return 'shower';
  if (conditionType.includes('fog')) return 'fog';
  if (conditionType.includes('cloud')) return 'cloud';
  return 'clear';
};

export const hexRGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
export const mixHex = (a, b, t) => { 
  const A = hexRGB(a), B = hexRGB(b); 
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); 
};
