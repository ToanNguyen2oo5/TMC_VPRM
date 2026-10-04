import trangPhucData from '../../data/trangphuc.json';

/**
 * Lấy danh sách tất cả bối cảnh/sự kiện có trong dữ liệu
 */
export function getAllScenes() {
  const scenes = new Set();
  trangPhucData.forEach(item => {
    item.boi_canh_phu_hop.forEach(scene => scenes.add(scene));
  });
  return Array.from(scenes);
}

/**
 * Lấy danh sách tất cả vùng miền
 */
export function getAllRegions() {
  const regions = new Set();
  trangPhucData.forEach(item => regions.add(item.vung_mien));
  return Array.from(regions);
}

/**
 * Filter trang phục theo bối cảnh/sự kiện
 */
export function getOutfitsByScene(scene) {
  return trangPhucData.filter(item =>
    item.boi_canh_phu_hop.some(s =>
      s.toLowerCase().includes(scene.toLowerCase())
    )
  );
}

/**
 * Filter trang phục theo vùng miền
 */
export function getOutfitsByRegion(region) {
  return trangPhucData.filter(item =>
    item.vung_mien.toLowerCase().includes(region.toLowerCase())
  );
}

/**
 * Lookup trang phục theo id
 */
export function getOutfitById(id) {
  return trangPhucData.find(item => item.id === id) || null;
}

/**
 * Lấy tất cả trang phục
 */
export function getAllOutfits() {
  return trangPhucData;
}

/**
 * Kiểm tra cảnh báo phối lệch giữa 2 outfit
 * @returns {{ hasWarning: boolean, warnings: Array }} 
 */
export function checkMismatch(outfitId, otherOutfitId) {
  const outfit = getOutfitById(outfitId);
  if (!outfit) return { hasWarning: false, warnings: [] };

  const warnings = [];

  // Check từ phía outfit chính
  outfit.canh_bao_phoi.forEach(warning => {
    if (warning.tranh_ket_hop_voi.includes(otherOutfitId)) {
      warnings.push({
        from: outfit.ten,
        to: getOutfitById(otherOutfitId)?.ten || otherOutfitId,
        ly_do: warning.ly_do
      });
    }
  });

  // Check ngược từ phía outfit kia
  const otherOutfit = getOutfitById(otherOutfitId);
  if (otherOutfit) {
    otherOutfit.canh_bao_phoi.forEach(warning => {
      if (warning.tranh_ket_hop_voi.includes(outfitId)) {
        warnings.push({
          from: otherOutfit.ten,
          to: outfit.ten,
          ly_do: warning.ly_do
        });
      }
    });
  }

  return {
    hasWarning: warnings.length > 0,
    warnings
  };
}

/**
 * Lọc trang phục theo nhiều điều kiện
 */
export function filterOutfits({ scene, region, gender } = {}) {
  let results = [...trangPhucData];

  if (scene) {
    results = results.filter(item =>
      item.boi_canh_phu_hop.some(s =>
        s.toLowerCase().includes(scene.toLowerCase())
      )
    );
  }

  if (region) {
    results = results.filter(item =>
      item.vung_mien.toLowerCase().includes(region.toLowerCase()) ||
      item.vung_mien === 'Cả ba miền'
    );
  }

  if (gender) {
    results = results.filter(item =>
      item.gioi_tinh === gender || item.gioi_tinh === 'cả hai'
    );
  }

  return results;
}
