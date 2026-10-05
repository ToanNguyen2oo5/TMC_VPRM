/**
 * Dịch vụ thời tiết thời gian thực cho 3 miền Bắc - Trung - Nam
 * Sử dụng Open-Meteo API (miễn phí, độ trễ thấp, không cần API key)
 */

export const REGIONS_WEATHER_CONFIG = {
  bac: {
    id: 'bac',
    nameVi: 'Miền Bắc (Hà Nội)',
    nameEn: 'Northern Vietnam (Hanoi)',
    shortNameVi: 'Bắc Bộ',
    shortNameEn: 'North',
    city: 'Hà Nội',
    lat: 21.0285,
    lon: 105.8542,
    defaultTemp: 24,
    defaultHumidity: 75,
    defaultWeatherCode: 1
  },
  trung: {
    id: 'trung',
    nameVi: 'Miền Trung (Huế)',
    nameEn: 'Central Vietnam (Hue)',
    shortNameVi: 'Trung Bộ',
    shortNameEn: 'Central',
    city: 'Huế',
    lat: 16.4637,
    lon: 107.5909,
    defaultTemp: 26,
    defaultHumidity: 80,
    defaultWeatherCode: 2
  },
  nam: {
    id: 'nam',
    nameVi: 'Miền Nam (TP. Hồ Chí Minh)',
    nameEn: 'Southern Vietnam (Ho Chi Minh City)',
    shortNameVi: 'Nam Bộ',
    shortNameEn: 'South',
    city: 'TP.HCM',
    lat: 10.8231,
    lon: 106.6297,
    defaultTemp: 31,
    defaultHumidity: 70,
    defaultWeatherCode: 0
  }
};

// Cache dữ liệu thời tiết trong 10 phút để tránh spam API
const weatherCache = {};
const CACHE_DURATION_MS = 10 * 60 * 1000;

export function mapWeatherToScene(code, isDay = true) {
  let scene, textVi, textEn;
  if (code <= 1) {
    scene = isDay ? 'sunny' : 'night';
    textVi = isDay ? 'Trời quang đãng, nắng đẹp' : 'Trời đêm quang đãng';
    textEn = isDay ? 'Clear sky, sunny' : 'Clear starry night';
  } else if (code <= 3 || (code >= 45 && code <= 48)) {
    scene = isDay ? 'cloudy' : 'night';
    textVi = code === 3 ? 'Nhiều mây' : (code >= 45 ? 'Sương mù se lạnh' : 'Ít mây dịu mát');
    textEn = code === 3 ? 'Overcast clouds' : (code >= 45 ? 'Foggy chill' : 'Partly cloudy');
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    scene = 'rain';
    textVi = 'Có mưa rơi';
    textEn = 'Rainy';
  } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    scene = 'snow';
    textVi = 'Có tuyết rơi';
    textEn = 'Snowy';
  } else {
    scene = 'storm';
    textVi = 'Dông, sấm chớp';
    textEn = 'Thunderstorm';
  }
  if (!isDay && scene !== 'rain' && scene !== 'storm' && scene !== 'snow') {
    scene = 'night';
  }
  return { scene, textVi, textEn };
}

function interpretWeatherCode(code, isDay = true) {
  const { scene, textVi, textEn } = mapWeatherToScene(code, isDay);
  let icon = '☀️';
  if (scene === 'night') icon = '🌙';
  else if (scene === 'cloudy') icon = code === 3 ? '☁️' : '⛅';
  else if (scene === 'rain') icon = '🌧️';
  else if (scene === 'storm') icon = '⛈️';
  else if (scene === 'snow') icon = '❄️';

  return {
    textVi,
    textEn,
    icon,
    type: scene === 'rain' ? 'rainy' : scene === 'storm' ? 'stormy' : scene,
    scene
  };
}

function getGarmentRecommendation(temp, weatherType) {
  const currentMonth = new Date().getMonth() + 1;
  let seasonalActivity = 'chụp ảnh ngoài trời';
  if (currentMonth >= 1 && currentMonth <= 3) {
    seasonalActivity = 'du xuân trẩy hội';
  } else if (currentMonth >= 9 && currentMonth <= 11) {
    seasonalActivity = 'chụp ảnh mùa thu - đầu đông';
  } else if (currentMonth === 12) {
    seasonalActivity = 'chụp ảnh kỷ niệm cuối năm';
  }

  // 1. Trời nóng (>= 28°C)
  if (temp >= 28) {
    return {
      headlineVi: 'Trời nắng ấm, nhiệt độ cao',
      headlineEn: 'Warm sunny weather',
      adviceVi: 'Nên chọn vải đũi tự nhiên, lụa tơ tằm mỏng nhẹ thoáng khí hoặc Áo bà ba, Áo dài cách tân ngắn tay mát mẻ.',
      adviceEn: 'Lightweight breathable fabrics recommended: raw tussah silk, linen, Ao Ba Ba, or modern breezy Ao Dai.',
      practicalFieldTipsVi: [
        'Tránh vải lót nilon/polyester vì dễ bí mồ hôi khi hoạt động ngoài trời.',
        'Chuẩn bị thêm quạt nan hoặc quạt trầm hương vừa giải nhiệt vừa tạo dáng duyên dáng.',
        'Trang điểm tone tự nhiên, chống lem phấn dưới trời nắng.'
      ],
      recommendedFabricsVi: ['Lụa tơ tằm mỏng', 'Vải đũi tự nhiên', 'Voan tơ thoáng'],
      outfitIds: ['ao_ba_ba_nam_bo', 'ao_dai_cach_tan'],
      recommendedOutfits: [
        { id: 'ao_ba_ba_nam_bo', name: 'Áo bà ba Nam Bộ' },
        { id: 'ao_dai_cach_tan', name: 'Áo dài cách tân' }
      ]
    };
  }

  // 2. Trời mưa hoặc se lạnh (<= 21°C)
  if (temp <= 21 || weatherType === 'rainy' || weatherType === 'stormy') {
    const isRain = weatherType === 'rainy' || weatherType === 'stormy';
    return {
      headlineVi: isRain ? 'Trời có mưa ẩm' : 'Trời se lạnh, nhiệt độ thấp',
      headlineEn: isRain ? 'Rainy & damp conditions' : 'Chilly conditions',
      adviceVi: isRain 
        ? 'Cẩn trọng vải dễ ướt, tránh chọn tà áo quá dài quét đất và hạn chế màu trắng tinh dễ vấy bùn bẩn.'
        : 'Rất thích hợp diện Áo tấc gấm dệt nhiều lớp, Áo ngũ thân dày dặn kết hợp khăn đóng giữ ấm cổ.',
      adviceEn: isRain
        ? 'Beware of wet hems: avoid floor-dragging cuts, and avoid white fabrics prone to mud splashes.'
        : 'Perfect for layered brocade Ao Tac, lined five-panel robes, and traditional head wraps for warmth.',
      practicalFieldTipsVi: isRain ? [
        'Hạn chế tà áo màu trắng hoặc be nhạt vì rất dễ bị bắn bùn bẩn khi di chuyển.',
        'Ô giấy dầu chỉ để tạo dáng chụp nhanh, khi di chuyển cần trang bị ô che chuyên dụng.',
        'Sử dụng kẹp vải để xắn gọn vạt khi bước lên bậc tam cấp di tích.'
      ] : [
        'Thời tiết se lạnh là lúc diện Áo Tấc và Áo Ngũ Thân nhiều lớp đẹp nhất mà không lo nóng.',
        'Khăn đóng hoặc khăn vấn vừa giữ ấm vừa tôn phong thái trang trọng.',
        'Phù hợp diện cùng hài nhung thêu hoặc giày tây cổ điển.'
      ],
      recommendedFabricsVi: ['Gấm hoa chìm', 'Nhung the', 'Lụa dệt dày dặn'],
      outfitIds: ['ao_ngu_than_ao_tac', 'ao_nhat_binh'],
      recommendedOutfits: [
        { id: 'ao_ngu_than_ao_tac', name: 'Áo ngũ thân / Áo tấc' },
        { id: 'ao_nhat_binh', name: 'Áo Nhật Bình cung đình' }
      ]
    };
  }

  // 3. Khí hậu dịu mát, ôn hòa (22 - 27°C)
  return {
    headlineVi: 'Thời tiết dịu mát lý tưởng',
    headlineEn: 'Mild pleasant weather',
    adviceVi: `Khí hậu rất đẹp để ${seasonalActivity} cùng Áo dài truyền thống, Áo tứ thân Kinh Bắc hay Áo giao lĩnh cổ truyền.`,
    adviceEn: `Pleasant weather: Perfect for heritage photography with traditional Ao Dai, Ao Tu Than, or Ao Giao Linh.`,
    practicalFieldTipsVi: [
      'Thời tiết lý tưởng để tận dụng ánh sáng tự nhiên tại các đền chùa, phố cổ.',
      'Dễ dàng kết hợp phụ kiện chuỗi ngọc, trâm cài hoa sen hoặc thắt lưng ngũ sắc.',
      'Di chuyển thoải mái cả ngày mà không lo đổ mồ hôi hay nhăn nhàu trang phục.'
    ],
    recommendedFabricsVi: ['Lụa Hà Đông', 'The lụa mềm', 'Gấm tơ tằm'],
    outfitIds: ['ao_dai_hue', 'ao_tu_than', 'ao_giao_linh'],
    recommendedOutfits: [
      { id: 'ao_dai_hue', name: 'Áo dài truyền thống' },
      { id: 'ao_tu_than', name: 'Áo tứ thân Kinh Bắc' },
      { id: 'ao_giao_linh', name: 'Áo giao lĩnh cổ truyền' }
    ]
  };
}

/**
 * Lấy thông tin thời tiết cho 1 vùng (bac | trung | nam)
 */
export async function getRegionWeather(regionKey = 'bac') {
  const config = REGIONS_WEATHER_CONFIG[regionKey] || REGIONS_WEATHER_CONFIG.bac;
  const now = Date.now();

  if (weatherCache[regionKey] && (now - weatherCache[regionKey].timestamp < CACHE_DURATION_MS)) {
    return weatherCache[regionKey].data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${config.lat}&longitude=${config.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`Weather API HTTP ${res.status}`);
    
    const json = await res.json();
    const current = json.current || {};
    const isDay = current.is_day !== undefined ? current.is_day === 1 : true;
    const temp = Math.round(current.temperature_2m ?? config.defaultTemp);
    const humidity = Math.round(current.relative_humidity_2m ?? config.defaultHumidity);
    const weatherCode = current.weather_code ?? config.defaultWeatherCode;
    const windSpeed = Math.round(current.wind_speed_10m ?? 8);

    const condition = interpretWeatherCode(weatherCode, isDay);
    const recommendation = getGarmentRecommendation(temp, condition.type);

    const data = {
      regionKey,
      city: config.city,
      nameVi: config.nameVi,
      nameEn: config.nameEn,
      shortNameVi: config.shortNameVi,
      shortNameEn: config.shortNameEn,
      temp,
      humidity,
      windSpeed,
      isDay,
      scene: condition.scene,
      condition,
      recommendation,
      isRealtime: true,
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    weatherCache[regionKey] = {
      timestamp: now,
      data
    };

    return data;
  } catch (error) {
    console.warn(`Lỗi lấy thời tiết cho ${regionKey}:`, error.message);
    const currentHour = new Date().getHours();
    const isDay = currentHour >= 6 && currentHour < 18;
    const condition = interpretWeatherCode(config.defaultWeatherCode, isDay);
    const recommendation = getGarmentRecommendation(config.defaultTemp, condition.type);
    
    return {
      regionKey,
      city: config.city,
      nameVi: config.nameVi,
      nameEn: config.nameEn,
      shortNameVi: config.shortNameVi,
      shortNameEn: config.shortNameEn,
      temp: config.defaultTemp,
      humidity: config.defaultHumidity,
      windSpeed: 10,
      isDay,
      scene: condition.scene,
      condition,
      recommendation,
      isRealtime: false,
      lastUpdated: 'Dữ liệu ước tính'
    };
  }
}

/**
 * Lấy thời tiết đồng thời cả 3 miền
 */
export async function getAllRegionsWeather() {
  const [bac, trung, nam] = await Promise.all([
    getRegionWeather('bac'),
    getRegionWeather('trung'),
    getRegionWeather('nam')
  ]);
  return { bac, trung, nam };
}

/**
 * Lấy thời tiết theo tọa độ GPS người dùng
 */
export async function getWeatherByCoords(lat, lon, locationName = 'Vị trí hiện tại') {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`Weather API HTTP ${res.status}`);
    
    const json = await res.json();
    const current = json.current || {};
    const isDay = current.is_day !== undefined ? current.is_day === 1 : true;
    const temp = Math.round(current.temperature_2m ?? 26);
    const humidity = Math.round(current.relative_humidity_2m ?? 75);
    const weatherCode = current.weather_code ?? 1;
    const windSpeed = Math.round(current.wind_speed_10m ?? 8);

    const condition = interpretWeatherCode(weatherCode, isDay);
    const recommendation = getGarmentRecommendation(temp, condition.type);

    return {
      regionKey: 'gps',
      city: locationName,
      nameVi: locationName,
      nameEn: locationName,
      shortNameVi: 'Vị trí của bạn',
      shortNameEn: 'Your Location',
      temp,
      humidity,
      windSpeed,
      isDay,
      scene: condition.scene,
      condition,
      recommendation,
      isRealtime: true,
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.warn('Lỗi lấy thời tiết theo tọa độ:', error);
    return null;
  }
}
