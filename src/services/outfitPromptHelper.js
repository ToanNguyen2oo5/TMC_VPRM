/**
 * Helper hỗ trợ xây dựng prompt giữ nguyên màu sắc và loại trang phục truyền thống Việt Nam
 */

export const COLOR_MAP = {
  'tím Huế': 'signature Hue imperial purple / violet (màu tím Huế đặc trưng)',
  'trắng ngà': 'ivory white (màu trắng ngà nhã nhặn)',
  'xanh ngọc bích': 'jade green (màu xanh ngọc bích)',
  'nâu non': 'warm light brown / beige brown (màu nâu non)',
  'đỏ thắm': 'vibrant crimson red (màu đỏ thắm)',
  'vàng mỡ gà': 'soft primrose yellow (màu vàng mỡ gà truyền thống)',
  'đen': 'deep obsidian black (màu đen tuyền)',
  'trắng': 'pure crisp white (màu trắng tinh khôi)',
  'nâu đất': 'natural earthy brown (màu nâu đất mộc mạc)',
  'xanh lá đậm': 'deep forest green (màu xanh lá cây đậm)',
  'pastel hồng': 'soft pastel lotus pink (màu hồng pastel thanh lịch)',
  'be': 'warm natural beige (màu be trang nhã)',
  'trắng kem': 'creamy off-white (màu trắng kem)',
  'đen classic': 'classic elegant black (màu đen cổ điển)',
  'xanh cobalt': 'vibrant cobalt royal blue (màu xanh cobalt)',
  'xanh thẫm': 'deep navy indigo blue (màu xanh thẫm trang trọng)',
  'nâu gụ': 'rich mahogany dark brown (màu nâu gụ cổ kính)'
};

export const OUTFIT_DETAILS = {
  ao_dai_hue: {
    tenVi: 'Áo dài Huế truyền thống',
    enType: 'Authentic traditional Vietnamese royal Hue Ao Dai',
    descVi: 'Áo dài truyền thống xứ Huế với thân áo may ôm vừa vặn, cổ cao truyền thống (cổ trụ), hai tà áo trước và sau buông dài thướt tha chạm mu bàn chân, xẻ tà hai bên hông cao tới eo duyên dáng. Mặc cùng quần lụa ống rộng dài chấm đất. Đi kèm nón bài thơ hoặc khăn vành dây.',
    descEn: 'historically accurate Vietnamese royal Hue Ao Dai. Form-fitting torso, traditional high mandarin collar, two long graceful flowing split panels (front and back) falling down to the ankles over wide-leg flowing silk trousers, accessorized with conical palm hat (non bai tho) or royal silk headband (khan vanh day). Real Vietnamese mulberry silk and brocade, fine gold embroidery details, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Tuyệt đối không vẽ thành sườn xám (Qipao), Hán phục (Hanfu), Kimono hay váy đầm phương Tây.',
    avoidEn: 'Strictly avoid Chinese Qipao, Cheongsam, Hanfu, Japanese Kimono, Korean Hanbok, or Western evening gowns.'
  },
  ao_tu_than: {
    tenVi: 'Áo tứ thân Kinh Bắc',
    enType: 'Authentic traditional Northern Vietnamese Ao Tu Than',
    descVi: 'Trang phục Áo tứ thân cổ truyền vùng Kinh Bắc (Bắc Bộ). Thân áo gồm 4 vạt áo (hai vạt sau may liền thành đường sống lưng, hai vạt trước buông rủ hoặc thắt nút trước bụng), bên trong mặc yếm đào truyền thống cổ yếm hình quả trám, thắt dải yếm lụa, lưng thắt dải lụa bao xanh nổi bật, đầu đội hoặc tay cầm nón quai thao lớn đặc trưng của liền chị quan họ.',
    descEn: 'historically accurate traditional Northern Vietnamese Ao Tu Than (Kinh Bac four-panel gown). Outer four-panel robe gracefully tied at front waist, authentic inner yem dao (halter camisole), vibrant silk sash belt, wide flowing silk trousers, accompanied by iconic large flat palm hat (non quai thao). Real natural Vietnamese woven silk, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Tuyệt đối không nhầm sang Hán phục hay trang phục cổ trang Trung Quốc.',
    avoidEn: 'Strictly avoid Chinese Hanfu or East Asian fantasy costumes.'
  },
  ao_ba_ba_nam_bo: {
    tenVi: 'Áo bà ba Nam Bộ',
    enType: 'Authentic traditional Southern Vietnamese Ao Ba Ba',
    descVi: 'Trang phục Áo bà ba mộc mạc thanh lịch của miền Tây Nam Bộ. Áo may bằng vải lụa hoặc gấm mỏng nhẹ, cổ tròn hoặc cổ tim xẻ nông, hàng cúc cài thẳng phía trước thân áo, xẻ tà ngắn hai bên hông tạo sự thoải mái, tay dài buông nhẹ, kết hợp cùng quần lụa ống suông đen hoặc trắng và chiếc khăn rằn Nam Bộ kẻ ca-rô đặc trưng vắt qua cổ.',
    descEn: 'historically accurate authentic Southern Vietnamese Ao Ba Ba. Elegant split-hem button-down silk blouse with gentle round neckline, side hip slits, paired with loose flowing silk trousers and classic checkered khan ran scarf draped on the shoulders. Real soft Vietnamese silk, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Không biến tấu thành áo sơ mi hiện đại hay đồ ngủ pyjama.',
    avoidEn: 'Strictly avoid modern pajamas, western collared shirts, or casual modern wear.'
  },
  ao_dai_cach_tan: {
    tenVi: 'Áo dài cách tân hiện đại',
    enType: 'Modern contemporary Vietnamese Ao Dai',
    descVi: 'Áo dài cách tân Việt Nam giữ nguyên phom dáng xẻ tà eo đặc trưng của tà áo dài truyền thống Việt Nam nhưng tà áo được may ngắn hơn (ngang gối hoặc lửng bắp chân), cổ áo cách điệu trang nhã, kết hợp hài hòa cùng quần ống suông hoặc váy xếp ly nhẹ nhàng, giữ trọn nét thanh lịch của người phụ nữ Việt Nam.',
    descEn: 'contemporary modernized Vietnamese Ao Dai. Preserving authentic waist side slits and flowing panels, contemporary refined neckline, paired with matching flowing trousers or flared skirt. Real Vietnamese silk and organza, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Không biến thành váy đầm cocktail Tây phương hay sườn xám ngắn.',
    avoidEn: 'Strictly avoid western cocktail mini-dresses or Chinese mini Qipao.'
  },
  ao_the_khan_xep: {
    tenVi: 'Áo the khăn xếp truyền thống nam',
    enType: 'Authentic traditional Vietnamese gentleman Ao The with Khan Xep',
    descVi: 'Bộ trang phục Áo the khăn xếp cổ truyền trang trọng dành cho nam giới Việt Nam. Gồm áo dài nam bằng the hoặc lụa gấm, cổ đứng cài khuy chéo bên nách phải, thân áo buông dài qua gối thẳng thớm, kết hợp cùng quần trắng ống rộng và trên đầu đội chiếc khăn xếp màu đen quấn nếp tỉ mỉ, đĩnh đạc.',
    descEn: 'historically accurate traditional Vietnamese gentleman Ao The with Khan Xep. Full-length sheer silk gauze the robe with standing collar, right-side button closure, white silk trousers, neatly wrapped black fabric turban (khan xep). Real Vietnamese silk and gauze, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Tuyệt đối không nhầm sang trường bào Mãn Thanh hay Hán phục nam.',
    avoidEn: 'Strictly avoid Qing dynasty changshan, Tang suit, or Chinese Hanfu.'
  },
  ao_ngu_than_ao_tac: {
    tenVi: 'Áo ngũ thân / Áo tấc truyền thống',
    enType: 'Authentic traditional Vietnamese Ao Ngu Than / Ao Tac',
    descVi: 'Quốc phục thời Nguyễn với 5 thân áo cài 5 hạt khuy tượng trưng cho ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín). Dạng áo tấc có ống tay thụng rộng buông dài trang nghiêm, cổ đứng lập lĩnh gài kín đáo, mặc cùng quần trắng và đội khăn đóng/khăn xếp chỉn chu.',
    descEn: 'historically accurate traditional Vietnamese royal Ao Ngu Than / Ao Tac. Five-panel robe with standing collar (lap linh), five buttons representing Confucian virtues, flowing wide sleeves (tay thung), paired with white silk trousers and traditional turban (khan dong). Real Vietnamese mulberry silk, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Tuyệt đối không nhầm sang Hán phục hay trường bào nhà Thanh.',
    avoidEn: 'Strictly avoid Chinese Hanfu or Qing dynasty garments.'
  },
  ao_nhat_binh: {
    tenVi: 'Áo Nhật Bình cung đình triều Nguyễn',
    enType: 'Authentic historically accurate traditional Viet Phuc (Ao Nhat Binh)',
    descVi: 'Lễ phục cung đình quý phái bậc nhất triều Nguyễn. Đặc trưng bởi cổ áo khoét hình chữ nhật bản to viền dải hoa văn ngũ hành trước ngực, hai bên thân áo thêu kim tuyến phượng múa mây lượn, tay áo gắn dải ngũ sắc ngũ hành, mặc cùng xiêm lụa và đội khăn vành dây mạ vàng lộng lẫy.',
    descEn: 'historically accurate Nguyen Dynasty Hue court attire, Ao Nhat Binh. Large rectangular collar band with five-element patterns across the chest, gold-thread phoenix and cloud embroidery on the sides, flowing split panels, wide silk trousers, ornate gold-plated khan vanh day headband, embroidered shoes. Real Vietnamese mulberry silk and brocade, fine gold-thread embroidery, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Tuyệt đối không vẽ nhầm sang áo sườn xám hay đồ tuồng kịch.',
    avoidEn: 'Strictly avoid Chinese Qipao, theatrical costumes, or fantasy Hanfu.'
  },
  ao_giao_linh: {
    tenVi: 'Áo giao lĩnh cổ truyền Đại Việt',
    enType: 'Authentic ancient Vietnamese Ao Giao Linh',
    descVi: 'Trang phục cổ đại của người Việt với cổ áo vạt chéo giao nhau trước ngực (vạt trái đè lên vạt phải), tay áo rộng buông thướt tha, chất vải thô mộc từ the đũi tự nhiên, thắt dải lụa mềm thả dài trước thân tạo vẻ đẹp thanh tao, thoát tục.',
    descEn: 'historically accurate ancient Vietnamese Ao Giao Linh (Ly - Tran - Le dynasty cross-collar robe). Graceful cross-collar overlapping neckline at chest, sweeping wide sleeves, tied silk sash belt hanging at waist, wide flowing trousers. Real woven Vietnamese silk/linen, natural fabric drape with gravity-aligned folds, visible seam stitching.',
    avoidVi: 'Tuyệt đối không vẽ thành Kimono Nhật Bản hay Hán phục Trung Hoa.',
    avoidEn: 'Strictly avoid Japanese Kimono or Chinese Hanfu details.'
  }
};

/**
 * Định dạng danh sách màu sắc sang song ngữ (Anh - Việt)
 */
export function formatColors(colorsArray) {
  if (!colorsArray || !Array.isArray(colorsArray) || colorsArray.length === 0) {
    return { vi: 'Màu truyền thống', en: 'traditional authentic colors' };
  }
  const vi = colorsArray.join(', ');
  const en = colorsArray.map(c => COLOR_MAP[c] || c).join(', ');
  return { vi, en };
}

/**
 * Lấy toàn bộ ngữ cảnh và mô tả chi tiết của một bộ trang phục
 */
export function getGarmentContext(outfitData) {
  const detail = OUTFIT_DETAILS[outfitData.id] || {
    tenVi: outfitData.ten,
    enType: `Authentic traditional Vietnamese ${outfitData.ten}`,
    descVi: outfitData.mo_ta_ngan || `Trang phục truyền thống ${outfitData.ten} của Việt Nam`,
    descEn: `historically accurate traditional Vietnamese costume ${outfitData.ten}. Graceful traditional Vietnamese cut, flowing panels, authentic tailoring, real Vietnamese silk, natural fabric drape with gravity-aligned folds, visible seam stitching.`,
    avoidVi: 'Tuyệt đối không vẽ sai lệch sang trang phục các nền văn hóa khác.',
    avoidEn: 'Strictly avoid clothing from other Asian or Western cultures.'
  };

  const colors = formatColors(outfitData.mau_dac_trung);
  const accessories = outfitData.phu_kien_di_kem ? outfitData.phu_kien_di_kem.join(', ') : '';

  return {
    ...detail,
    colorsVi: colors.vi,
    colorsEn: colors.en,
    accessories,
    region: outfitData.vung_mien || 'Việt Nam',
    material: outfitData.chat_lieu || 'Lụa, the, gấm truyền thống Việt Nam'
  };
}

/**
 * Dịch tùy chỉnh phom dáng của người dùng sang tiếng Anh
 */
export function translateCustomizations(cust) {
  if (!cust) return '';

  const fitMap = {
    'Ôm sát': 'form-fitting tailored silhouette (fitted at waist and torso)',
    'Vừa vặn': 'well-tailored classic regular fit',
    'Rộng rãi': 'comfortable flowing relaxed loose fit'
  };

  const lengthMap = {
    'Ngắn (qua gối)': 'knee-length hem panels stopping right past the knees (distinctly shorter than traditional floor-length)',
    'Trung (giữa bắp chân)': 'midi calf-length hem panels stopping at mid-calf',
    'Dài (chấm gót)': 'floor-length traditional flowing hem panels gracefully touching ankles'
  };

  const collarMap = {
    'Truyền thống': 'traditional high Mandarin stand collar (cổ cao truyền thống)',
    'Cổ thuyền': 'wide horizontal boat neckline exposing collarbones (OVERRIDE: wide open boat neck, absolutely NO high standing collar)',
    'Cổ trụ cách tân': 'short minimalist low mandarin stand band collar'
  };

  const sleeveMap = {
    'Dài tay': 'traditional full-length long sleeves covering wrists (tay dài truyền thống)',
    'Tay lỡ': 'three-quarter elbow-length sleeves ending at elbow (OVERRIDE: forearms bare/visible, NOT full-length sleeves)',
    'Tay ngắn cách tân': 'short modern sleeves ending well above elbows (OVERRIDE: short sleeves, forearms completely bare and exposed, definitely NOT long sleeves)'
  };

  const parts = [];
  if (cust.fit && fitMap[cust.fit]) parts.push(fitMap[cust.fit]);
  if (cust.length && lengthMap[cust.length]) parts.push(lengthMap[cust.length]);
  if (cust.collar && collarMap[cust.collar]) parts.push(collarMap[cust.collar]);
  if (cust.sleeve && sleeveMap[cust.sleeve]) parts.push(sleeveMap[cust.sleeve]);

  return parts.join(', ');
}

/**
 * Negative prompt chuẩn cho phong cách snapshot CCD Digicam & Portra 400
 */
export const SNAPSHOT_NEGATIVE_PROMPT = `wrong garment colors, color drift, desaturated clothing, faded fabric, discolored, swapped outfit colors, wrong sleeves, long sleeves when short sleeves specified, wrong neckline, traditional high collar when boat neck specified, no plastic skin, no over-smoothing, no face change, no HDR, no teal-orange grading, no overly perfect studio lighting, close-up, extreme close up, headshot, bust shot, half body, waist-up, upper body only, cropped body, cut off legs, cropped feet, out of frame legs, cut off shoes, amputated feet, bad anatomy, deformed hands, blurry, low quality, oversaturated neon, washed out colors, 3D render, CGI, cartoon, anime, illustration, video game graphics, airbrushed, wax figure, fake lighting, wrong outfit, Chinese Hanfu, Cheongsam, Qipao, Japanese Kimono, Korean Hanbok, Western dress, western modern clothes, changed garment type, distorted clothing cut`;


/**
 * Cấu hình nhiếp ảnh CCD Digicam + Portra 400 và chất liệu siêu thực
 */
export const PHOTOREALISTIC_PROMPT_CONFIG = {
  camera: 'Shot on an early-2000s CCD digital camera with direct on-camera flash, harsh flash falloff, bright hotspot on face and collarbone, visible digital grain, imperfect snapshot framing',
  lighting: 'direct on-camera flash as key light with harsh falloff, bright highlight on face and collarbone, soft shadow behind subject, warm golden-hour ambient light in the background',
  skinTexture: 'Kodak Portra 400 color rendering: warm creamy skin, pastel softness, muted saturation, gentle highlight roll-off, visible film-like digital grain, real skin with visible micro-pores, natural and unretouched',
  fabricPhysics: 'real Vietnamese mulberry silk and brocade, fine embroidery, natural fabric drape with gravity-aligned folds, visible seam stitching',
  grounding: 'heritage stone tiles or old tiled communal-house yard, realistic contact shadows under footwear, wide framing with generous headroom and footroom, feet and shoes fully visible, nothing cropped',
  negative: SNAPSHOT_NEGATIVE_PROMPT
};

/**
 * Bảng màu chuẩn truyền thống & hiện đại cho cổ phục Việt
 */
const KNOWN_COLORS_PALETTE = [
  { hex: '#B22222', r: 178, g: 34, b: 34, nameVi: 'Đỏ son thẫm', nameEn: 'vibrant deep crimson red' },
  { hex: '#8B0000', r: 139, g: 0, b: 0, nameVi: 'Đỏ bordeaux vương giả', nameEn: 'rich imperial dark red / burgundy' },
  { hex: '#DAA520', r: 218, g: 165, b: 32, nameVi: 'Vàng hoàng gia / Hoàng yến', nameEn: 'rich royal golden ochre / warm gold' },
  { hex: '#FFD700', r: 255, g: 215, b: 0, nameVi: 'Vàng kim ánh kim tuyến', nameEn: 'bright radiant metallic gold' },
  { hex: '#008080', r: 0, g: 128, b: 128, nameVi: 'Xanh cổ vịt / Xanh mòng két', nameEn: 'deep peacock teal green' },
  { hex: '#FAF9F6', r: 250, g: 249, b: 246, nameVi: 'Trắng ngà / Bạch ngọc', nameEn: 'ivory cream silk white' },
  { hex: '#FFFFFF', r: 255, g: 255, b: 255, nameVi: 'Trắng tinh khôi', nameEn: 'pure crisp white' },
  { hex: '#6A1B9A', r: 106, g: 27, b: 154, nameVi: 'Tím cố đô Huế', nameEn: 'deep Hue imperial violet purple' },
  { hex: '#9C27B0', r: 156, g: 39, b: 176, nameVi: 'Tím hoa cà', nameEn: 'delicate lavender purple' },
  { hex: '#00897B', r: 0, g: 137, b: 123, nameVi: 'Xanh ngọc bích', nameEn: 'pure jade emerald green' },
  { hex: '#2E7D32', r: 46, g: 125, b: 50, nameVi: 'Xanh lá cây đậm', nameEn: 'deep forest green' },
  { hex: '#8D6E63', r: 141, g: 110, b: 99, nameVi: 'Nâu non Kinh Bắc', nameEn: 'warm light chestnut brown / earth beige' },
  { hex: '#5D4037', r: 93, g: 64, b: 55, nameVi: 'Nâu gụ cổ truyền', nameEn: 'deep rich mahogany dark brown' },
  { hex: '#1C1C1C', r: 28, g: 28, b: 28, nameVi: 'Đen tuyền the gấm', nameEn: 'pitch jet obsidian black' },
  { hex: '#000000', r: 0, g: 0, b: 0, nameVi: 'Đen tuyền', nameEn: 'pure solid black' },
  { hex: '#E91E63', r: 233, g: 30, b: 99, nameVi: 'Hồng cánh sen', nameEn: 'vibrant lotus magenta pink' },
  { hex: '#F8BBD0', r: 248, g: 187, b: 208, nameVi: 'Hồng phấn pastel', nameEn: 'soft delicate pastel pink' },
  { hex: '#0047AB', r: 0, g: 71, b: 171, nameVi: 'Xanh cobalt hoàng gia', nameEn: 'vibrant royal cobalt blue' },
  { hex: '#1A365D', r: 26, g: 54, b: 93, nameVi: 'Xanh lam thẫm / Chàm', nameEn: 'deep navy indigo blue' },
  { hex: '#D2B48C', r: 210, g: 180, b: 140, nameVi: 'Be thanh lịch / Vàng cát', nameEn: 'refined sand beige / tan' },
  { hex: '#FF7043', r: 255, g: 112, b: 67, nameVi: 'Cam đất nung', nameEn: 'warm terracotta burnt orange' }
];

function hexToRgb(hex) {
  if (!hex) return null;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Chuyển đổi mã hex bất kỳ sang tên màu tiếng Việt và mô tả tiếng Anh chuẩn xác
 */
export function hexToColorDescription(hex) {
  if (!hex) return { nameVi: 'Màu truyền thống', nameEn: 'authentic traditional color', hex: '#8B0000' };
  
  const normHex = hex.toUpperCase();
  const exact = KNOWN_COLORS_PALETTE.find(c => c.hex.toUpperCase() === normHex);
  if (exact) {
    return {
      nameVi: exact.nameVi,
      nameEn: exact.nameEn,
      hex: normHex,
      fullVi: `${exact.nameVi} (Mã hex: ${normHex})`,
      fullEn: `${exact.nameEn} (hex code: ${normHex})`
    };
  }

  const rgb = hexToRgb(hex);
  if (!rgb) {
    return {
      nameVi: hex,
      nameEn: hex,
      hex: hex,
      fullVi: `Màu tùy chỉnh (Mã: ${hex})`,
      fullEn: `custom color tone (hex: ${hex})`
    };
  }

  // Tìm màu gần nhất trong bảng màu
  let closest = KNOWN_COLORS_PALETTE[0];
  let minDistance = Infinity;
  for (const c of KNOWN_COLORS_PALETTE) {
    const dist = Math.pow(rgb.r - c.r, 2) + Math.pow(rgb.g - c.g, 2) + Math.pow(rgb.b - c.b, 2);
    if (dist < minDistance) {
      minDistance = dist;
      closest = c;
    }
  }

  return {
    nameVi: closest.nameVi,
    nameEn: closest.nameEn,
    hex: normHex,
    fullVi: `Sắc ${closest.nameVi} (Mã hex: ${normHex})`,
    fullEn: `rich ${closest.nameEn} hue (hex code: ${normHex})`
  };
}

/**
 * Mô tả chi tiết bảng màu tùy chọn gán đích danh vào từng lớp áo
 */
export function describeCustomColors(colors, outfitData) {
  if (!colors || (!colors.primary && !colors.secondary && !colors.accent)) {
    if (outfitData?.id === 'ao_nhat_binh') {
      return {
        hasCustom: false,
        primName: 'red',
        secName: 'gold',
        accName: 'ivory cream white',
        primHex: '#B22222',
        secHex: '#DAA520',
        accHex: '#FAF9F6',
        primaryEn: 'deep crimson red #B22222',
        secondaryEn: 'royal golden ochre #DAA520',
        accentEn: 'ivory cream white #FAF9F6',
        extraNote: 'Tunic is red, trousers are gold, never swapped. The thin five-color ribbons on the cuffs are small accents only and do not change the main colors.',
        primaryVi: 'Đỏ son thẫm (#B22222)',
        secondaryVi: 'Vàng hoàng gia (#DAA520)',
        accentVi: 'Trắng ngà / Bạch ngọc (#FAF9F6)',
        summaryVi: 'Tà áo đỏ son (#B22222), quần lụa vàng hoàng gia (#DAA520), điểm nhấn trắng ngà (#FAF9F6)',
        summaryEn: 'outer tunic in crimson red (#B22222), silk pants in golden ochre (#DAA520), trim in ivory white (#FAF9F6)'
      };
    }

    const defaultColors = formatColors(outfitData?.mau_dac_trung);
    const primHex = outfitData?.mau_dac_trung?.[0] ? (KNOWN_COLORS_PALETTE.find(c => c.nameVi.toLowerCase().includes(outfitData.mau_dac_trung[0].toLowerCase()))?.hex || '#B22222') : '#B22222';
    const primDesc = hexToColorDescription(primHex);

    return {
      hasCustom: false,
      primName: primDesc.nameEn,
      secName: 'traditional white or black',
      accName: 'harmonious embroidery',
      primHex: primHex,
      secHex: '#FAF9F6',
      accHex: '#FFD700',
      primaryEn: `${primDesc.nameEn} ${primHex}`,
      secondaryEn: 'flowing silk trousers in traditional ivory cream white #FAF9F6 or deep black #000000',
      accentEn: 'collar trim, sash belt, and embroidery in golden ochre or ivory cream white',
      extraNote: `Tunic is ${primDesc.nameEn}, trousers are traditional ivory white or black, never swapped. Accents are small highlights only and do not change the main colors.`,
      primaryVi: `Màu truyền thống của trang phục (${defaultColors.vi})`,
      secondaryVi: 'Quần lụa màu trắng ngà hoặc đen truyền thống',
      accentVi: 'Điểm nhấn hoa văn thêu chỉ kim tuyến hoặc viền màu hài hòa',
      summaryVi: defaultColors.vi,
      summaryEn: defaultColors.en
    };
  }

  const prim = hexToColorDescription(colors.primary || '#B22222');
  const sec = hexToColorDescription(colors.secondary || '#DAA520');
  const acc = hexToColorDescription(colors.accent || '#FAF9F6');

  return {
    hasCustom: true,
    primName: prim.nameEn,
    secName: sec.nameEn,
    accName: acc.nameEn,
    primHex: prim.hex,
    secHex: sec.hex,
    accHex: acc.hex,
    primaryEn: `${prim.nameEn} ${prim.hex}`,
    secondaryEn: `${sec.nameEn} ${sec.hex}`,
    accentEn: `${acc.nameEn} ${acc.hex}`,
    extraNote: `Tunic is ${prim.nameEn}, trousers are ${sec.nameEn}, never swapped. Accents and embroidery trim in ${acc.nameEn} are small highlights only and do not change the main colors. Zero color drift.`,
    primaryVi: `Thân áo ngoài & tà áo buông dài mang màu ${prim.nameVi} (${prim.hex})`,
    secondaryVi: `Quần lụa ống rộng mặc bên dưới mang màu ${sec.nameVi} (${sec.hex})`,
    accentVi: `Cổ áo, yếm đào, thắt lưng lụa và đường viền thêu mang màu ${acc.nameVi} (${acc.hex})`,
    summaryVi: `Tà áo chính ${prim.nameVi} (${prim.hex}), Quần lụa ${sec.nameVi} (${sec.hex}), Điểm nhấn ${acc.nameVi} (${acc.hex})`,
    summaryEn: `outer tunic in ${prim.nameEn} (${prim.hex}), silk pants in ${sec.nameEn} (${sec.hex}), trim/sash in ${acc.nameEn} (${acc.hex})`
  };
}

/**
 * Mô tả danh sách phụ kiện người dùng đã chọn
 */
export function describeSelectedAccessories(accessories, outfitData) {
  if (!accessories || !Array.isArray(accessories) || accessories.length === 0) {
    return {
      hasAccessories: false,
      textVi: outfitData?.phu_kien_di_kem ? outfitData.phu_kien_di_kem.join(', ') : 'Phụ kiện truyền thống phù hợp',
      textEn: 'matching traditional Vietnamese heritage accessories'
    };
  }

  const itemsVi = accessories.map(a => typeof a === 'string' ? a : (a.name || a.ten));
  const itemsEn = accessories.map(a => {
    const id = typeof a === 'string' ? a : (a.id || '');
    if (id.includes('kieng_bac')) return 'traditional Vietnamese silver torque necklace (kiềng bạc)';
    if (id.includes('non_la')) return 'iconic conical palm hat (nón lá)';
    if (id.includes('non_quai_thao')) return 'large flat palm hat with long silk ribbons (nón quai thao)';
    if (id.includes('khan_vanh')) return 'royal pleated silk headband / turban (khăn vành dây)';
    if (id.includes('khan_ran')) return 'southern Vietnamese checkered scarf (khăn rằn)';
    if (id.includes('khan_dong') || id.includes('khan_xep')) return 'neatly wrapped fabric turban (khăn xếp / khăn đóng)';
    if (id.includes('quat_xep')) return 'traditional folding silk hand fan (quạt xếp lụa)';
    if (id.includes('vong_ngoc') || id.includes('vong_co')) return 'traditional jade/pearl bead necklace';
    return (typeof a === 'string' ? a : a.name);
  });

  return {
    hasAccessories: true,
    textVi: itemsVi.join(', '),
    textEn: itemsEn.join(', ')
  };
}

/**
 * Xây dựng prompt hoàn chỉnh theo đúng định dạng snapshot CCD Digicam & Kodak Portra 400
 * Giữ nguyên văn phong của người dùng và linh hoạt điền thông số cho từng trang phục
 */
export function buildSnapshotPrompt(outfitData, angle = 0, customizations = {}) {
  const garment = getGarmentContext(outfitData);
  const colorSpec = describeCustomColors(customizations?.colors, outfitData);
  const accessoriesSpec = describeSelectedAccessories(customizations?.accessories, outfitData);
  const customTailor = translateCustomizations(customizations);

  // 1. Xác định danh xưng chủ thể
  let subject = 'a Vietnamese woman';
  if (outfitData.gioi_tinh === 'nam') {
    subject = 'a Vietnamese gentleman';
  } else if (outfitData.gioi_tinh === 'cả hai') {
    subject = 'a Vietnamese person';
  }

  // 2. Góc chụp và tư thế
  let poseAndAngle = 'Slightly three-quarters turned toward camera, upright elegant posture, one hand folded at the waist, the other gently adjusting the sleeve hem, calm confident expression.';
  if (angle === 0) {
    poseAndAngle = 'Standing facing camera directly (front view), upright elegant posture, one hand folded at the waist, the other gently adjusting the sleeve hem, calm confident expression.';
  } else if (angle === 90) {
    poseAndAngle = 'Standing in right side profile view (90-degree profile), upright elegant posture, one hand folded at the waist, the other gently adjusting the sleeve hem.';
  } else if (angle === 180) {
    poseAndAngle = 'Standing seen from behind (180-degree back view), upright elegant posture, showing full flowing back panels and back embroidery details.';
  } else if (angle === 270) {
    poseAndAngle = 'Standing in left side profile view (270-degree profile), upright elegant posture, one hand folded at the waist, the other gently adjusting the sleeve hem.';
  }

  // 3. Khối Outfit
  let outfitDesc = garment.descEn;
  if (accessoriesSpec.hasAccessories) {
    outfitDesc += ` Accessories: ${accessoriesSpec.textEn}.`;
  }
  if (customTailor) {
    outfitDesc += ` MANDATORY CUSTOM TAILORING (MUST OVERRIDE TRADITIONAL DEFAULTS): ${customTailor}. These custom tailoring specifications strictly override and replace any default sleeve or collar descriptions above.`;
  }
  if (customizations?.sleeve === 'Tay ngắn cách tân') {
    outfitDesc += ' CRITICAL SLEEVE DIRECTIVE: Short sleeves ending well above elbows with bare forearms. DO NOT draw long sleeves.';
  } else if (customizations?.sleeve === 'Tay lỡ') {
    outfitDesc += ' CRITICAL SLEEVE DIRECTIVE: Three-quarter elbow-length sleeves with exposed forearms. DO NOT draw full wrist-length sleeves.';
  }
  if (customizations?.collar === 'Cổ thuyền') {
    outfitDesc += ' CRITICAL COLLAR DIRECTIVE: Wide horizontal boat neckline exposing the collarbones. DO NOT draw a traditional high mandarin collar.';
  }
  if (garment.avoidEn) {
    outfitDesc += ` ${garment.avoidEn}`;
  }

  // 4. Khối Colors
  const extraNote = colorSpec.extraNote || `Tunic is ${colorSpec.primName}, trousers are ${colorSpec.secName}, never swapped. Small accent trims do not change the main colors.`;
  const colorsBlock = `CRITICAL COLOR ENFORCEMENT (ZERO DEVIATION, MANDATORY EXACT COLORS):
- Outer tunic / main garment / flowing panels: STRICTLY ${colorSpec.primaryEn} (${colorSpec.primHex})
- Flowing silk trousers / pants underneath: STRICTLY ${colorSpec.secondaryEn} (${colorSpec.secHex})
- Collar trim, inner yem camisole, sash belt, embroidery edging: STRICTLY ${colorSpec.accentEn} (${colorSpec.accHex})
${extraNote}
ABSOLUTE RULE: Any color drift, color swap between tunic and pants, washed-out desaturation, or substitution of these exact specified colors is strictly forbidden.`;

  // 5. Khối Bối cảnh
  let settingText = 'Hue imperial courtyard or old tiled communal-house yard, heritage stone tiles, realistic contact shadows under the shoes.';
  if (outfitData.id === 'ao_ba_ba_nam_bo') {
    settingText = 'Southern Vietnamese rural courtyard or heritage wooden riverbank veranda, natural stone ground, realistic contact shadows under the shoes.';
  } else if (outfitData.id === 'ao_tu_than') {
    settingText = 'Ancient Kinh Bac northern village communal house yard, heritage red brick tiles, realistic contact shadows under the shoes.';
  }

  return `Authentic snapshot photograph of ${subject}, full-body head-to-toe shot, shot on an early-2000s CCD digital camera with direct on-camera flash. ${poseAndAngle}

Outfit: ${outfitDesc}

${colorsBlock}

Lighting and look: direct on-camera flash as key light with harsh falloff, bright highlight on face and collarbone,
 soft shadow behind subject, warm golden-hour ambient light in the background. Kodak Portra 400 color rendering:
  warm creamy skin, pastel softness, muted saturation, gentle highlight roll-off. Visible film-like digital grain,
   imperfect snapshot framing. Real skin with visible micro-pores, natural and unretouched.

Setting: ${settingText} Wide framing with generous headroom and footroom, feet and shoes fully visible, nothing cropped.`;
}

