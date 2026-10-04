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

function interpretWeatherCode(code) {
  if (code === 0) {
    return {
      textVi: 'Trời quang đãng, nắng đẹp',
      textEn: 'Clear sky, sunny',
      icon: '☀️',
      type: 'sunny'
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      textVi: 'Ít mây, trời dịu mát',
      textEn: 'Partly cloudy, mild',
      icon: '⛅',
      type: 'partly_cloudy'
    };
  }
  if (code >= 45 && code <= 48) {
    return {
      textVi: 'Sương mù nhẹ, se lạnh',
      textEn: 'Foggy, gentle chill',
      icon: '🌫️',
      type: 'foggy'
    };
  }
  if (code >= 51 && code <= 67) {
    return {
      textVi: 'Mưa phùn / mưa rào nhẹ',
      textEn: 'Drizzle / gentle rain',
      icon: '🌧️',
      type: 'rainy'
    };
  }
  if (code >= 80 && code <= 99) {
    return {
      textVi: 'Mưa rào rải rác',
      textEn: 'Scattered showers',
      icon: '⛈️',
      type: 'stormy'
    };
  }
  return {
    textVi: 'Trời mát mẻ',
    textEn: 'Pleasant weather',
    icon: '🌤️',
    type: 'mild'
  };
}

function getGarmentRecommendation(temp, weatherType) {
  if (temp >= 31) {
    return {
      adviceVi: 'Nắng ấm phương Nam: Nên chọn vải đũi tơ tằm tự nhiên, lụa mỏng nhẹ thoáng khí hoặc Áo bà ba / Áo dài cách tân.',
      adviceEn: 'Warm sunny weather: Lightweight mulberry silk, linen, breathable Ao Ba Ba or modern Ao Dai recommended.',
      recommendedFabricsVi: ['Lụa tơ tằm mỏng', 'Vải đũi tự nhiên', 'Voan tơ'],
      outfitIds: ['ao_ba_ba_nam_bo', 'ao_dai_cach_tan']
    };
  }
  if (temp <= 21) {
    return {
      adviceVi: 'Thời tiết se lạnh: Rất thích hợp diện Áo tấc gấm dệt kim tuyến, Áo ngũ thân có lớp lót hoặc khăn đóng giữ ấm.',
      adviceEn: 'Chilly weather: Ideal for lined Ao Tac brocade, five-panel royal robes with layered undergarments.',
      recommendedFabricsVi: ['Gấm hoa chìm', 'Nhung the', 'Lụa dệt dày'],
      outfitIds: ['ao_ngu_than_ao_tac', 'ao_nhat_binh']
    };
  }
  return {
    adviceVi: 'Khí hậu ôn hòa lý tưởng: Rất đẹp để du xuân chụp ảnh cùng Áo dài truyền thống, Áo tứ thân Kinh Bắc hay Áo giao lĩnh.',
    adviceEn: 'Ideal pleasant weather: Perfect for heritage photography with traditional Ao Dai, Ao Tu Than, or Ao Giao Linh.',
    recommendedFabricsVi: ['Lụa Hà Đông', 'The lụa', 'Gấm tơ tằm'],
    outfitIds: ['ao_dai_hue', 'ao_tu_than', 'ao_giao_linh']
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${config.lat}&longitude=${config.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FHo_Chi_Minh`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`Weather API HTTP ${res.status}`);
    
    const json = await res.json();
    const current = json.current || {};
    const temp = Math.round(current.temperature_2m ?? config.defaultTemp);
    const humidity = Math.round(current.relative_humidity_2m ?? config.defaultHumidity);
    const weatherCode = current.weather_code ?? config.defaultWeatherCode;
    const windSpeed = Math.round(current.wind_speed_10m ?? 8);

    const condition = interpretWeatherCode(weatherCode);
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
    const condition = interpretWeatherCode(config.defaultWeatherCode);
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
