/**
 * Danh sách phụ kiện truyền thống Việt Nam phân theo nhóm
 * Kèm mức độ phù hợp và ý nghĩa văn hóa
 */

export const ACCESSORIES = [
  // Nhóm Mũ / Nón
  {
    id: 'non_la',
    name: 'Nón lá truyền thống',
    category: 'headwear',
    categoryName: 'Mũ & Nón',
    icon: '👒',
    mo_ta: 'Biểu tượng bình dị, duyên dáng và che chở của người phụ nữ Việt Nam.',
    y_nghia: 'Nón lá nón mê mộc mạc, làm từ lá cọ/lá lụi phơi khô, vừa che mưa nắng vừa che giấu nụ cười bẽn lẽn của thiếu nữ.',
    phu_hop_voi: ['ao_dai_hue', 'ao_dai_cach_tan', 'ao_ba_ba_nam_bo'],
    compatibilityScore: 98,
    isTraditional: true
  },
  {
    id: 'non_quai_thao',
    name: 'Nón quai thao (Nón ba tầm)',
    category: 'headwear',
    categoryName: 'Mũ & Nón',
    icon: '🌾',
    mo_ta: 'Nón tròn dẹt vành rộng đặc trưng của liền chị dân ca quan họ Bắc Ninh.',
    y_nghia: 'Mặt nón phẳng lọng, quai thao bằng tơ tằm thắt nút duyên dáng, tượng trưng cho nét e ấp, tình tứ của người con gái Kinh Bắc.',
    phu_hop_voi: ['ao_tu_than', 'ao_giao_linh'],
    compatibilityScore: 100,
    isTraditional: true
  },
  {
    id: 'khan_vanh_day',
    name: 'Khăn vành dây hoàng gia',
    category: 'headwear',
    categoryName: 'Mũ & Nón',
    icon: '👑',
    mo_ta: 'Dải lụa hoặc gấm xếp nếp cuộn tròn quanh đầu của bậc vương giả cố đô Huế.',
    y_nghia: 'Biểu trưng của sự cao quý, quyền uy và chỉn chu của hoàng tộc triều Nguyễn, thường dùng trong đại lễ và hôn lễ.',
    phu_hop_voi: ['ao_nhat_binh', 'ao_dai_hue', 'ao_ngu_than_ao_tac'],
    compatibilityScore: 95,
    isTraditional: true
  },
  {
    id: 'khan_dong_nam',
    name: 'Khăn đóng / Khăn xếp',
    category: 'headwear',
    categoryName: 'Mũ & Nón',
    icon: '🎩',
    mo_ta: 'Khăn xếp gấp nếp hình chữ Nhất hoặc chữ Nhân, trang trọng cho nam nhân.',
    y_nghia: 'Thể hiện phong thái đĩnh đạc, nho nhã, đạo mạo và lòng tự trọng của người quân tử thời xưa.',
    phu_hop_voi: ['ao_ngu_than_ao_tac', 'ao_the_khan_xep', 'ao_dai_hue'],
    compatibilityScore: 95,
    isTraditional: true
  },
  {
    id: 'khan_mo_qua',
    name: 'Khăn mỏ quạ Bắc Bộ',
    category: 'headwear',
    categoryName: 'Mũ & Nón',
    icon: '🧕',
    mo_ta: 'Khăn lụa vuông màu đen gấp chéo góc nhọn chìa ra trước trán giống mỏ chim quạ.',
    y_nghia: 'Tôn vinh khuôn mặt búp sen, làm nổi bật hàm răng đen hạt huyền và nét đảm đang của phụ nữ Bắc Bộ xưa.',
    phu_hop_voi: ['ao_tu_than'],
    compatibilityScore: 92,
    isTraditional: true
  },

  // Nhóm Trang sức
  {
    id: 'kieng_bac',
    name: 'Kiềng bạc hoa sen',
    category: 'jewelry',
    categoryName: 'Trang sức',
    icon: '✨',
    mo_ta: 'Chiếc kiềng tròn ôm sát cổ chạm khắc hoa văn hoa sen thanh khiết.',
    y_nghia: 'Tượng trưng cho sự thuần khiết, tâm hồn sáng trong và bình an của người phụ nữ Việt Nam.',
    phu_hop_voi: ['ao_dai_hue', 'ao_dai_cach_tan', 'ao_tu_than', 'ao_ngu_than_ao_tac'],
    compatibilityScore: 95,
    isTraditional: true
  },
  {
    id: 'chuoi_ngoc_trai',
    name: 'Chuỗi ngọc trai cổ điển',
    category: 'jewelry',
    categoryName: 'Trang sức',
    icon: '📿',
    mo_ta: 'Vòng cổ ngọc trai sang trọng, thanh lịch mang âm hưởng quý cô Hà thành.',
    y_nghia: 'Biểu tượng của nét đẹp đài các, tri thức, dịu dàng vượt thời gian.',
    phu_hop_voi: ['ao_dai_hue', 'ao_dai_cach_tan', 'ao_ngu_than_ao_tac'],
    compatibilityScore: 90,
    isTraditional: true
  },
  {
    id: 'tram_cai_toc',
    name: 'Trâm ngọc cài tóc',
    category: 'jewelry',
    categoryName: 'Trang sức',
    icon: '🌸',
    mo_ta: 'Trâm cài tóc bằng bạc đính ngọc bích chạm hình chim phượng hoặc cành mai.',
    y_nghia: 'Vật đính ước truyền thống, thể hiện sự nề nếp, khéo léo và đoan trang của người phụ nữ.',
    phu_hop_voi: ['ao_nhat_binh', 'ao_giao_linh', 'ao_tu_than', 'ao_dai_hue'],
    compatibilityScore: 92,
    isTraditional: true
  },

  // Nhóm Giày / Guốc
  {
    id: 'guoc_moc_son',
    name: 'Guốc mộc sơn son',
    category: 'footwear',
    categoryName: 'Giày & Guốc',
    icon: '👡',
    mo_ta: 'Đôi guốc gỗ thủ công đẽo gọt thanh mảnh, quai vải nhung hoặc da.',
    y_nghia: 'Âm thanh lách cách của guốc mộc trên sân gạch là thanh âm ký ức văn hóa làng quê và đô thị Việt cổ.',
    phu_hop_voi: ['ao_dai_hue', 'ao_tu_than', 'ao_ba_ba_nam_bo', 'ao_dai_cach_tan'],
    compatibilityScore: 94,
    isTraditional: true
  },
  {
    id: 'hai_theu_hoa',
    name: 'Hài thêu hoa cung đình',
    category: 'footwear',
    categoryName: 'Giày & Guốc',
    icon: '👠',
    mo_ta: 'Đôi hài mũi cong nhẹ thêu hoa văn chỉ vàng chỉ bạc tinh xảo.',
    y_nghia: 'Phụ kiện của chốn hoàng cung, bước đi uyển chuyển tạo vẻ quý phái quyền quý.',
    phu_hop_voi: ['ao_nhat_binh', 'ao_ngu_than_ao_tac', 'ao_giao_linh'],
    compatibilityScore: 96,
    isTraditional: true
  },

  // Nhóm Cầm tay / Khác
  {
    id: 'khan_ran_nam_bo',
    name: 'Khăn rằn Nam Bộ',
    category: 'other',
    categoryName: 'Cầm tay & Khác',
    icon: '🧣',
    mo_ta: 'Khăn dệt sợi cotton kẻ ô ca-rô đen trắng hoặc đỏ trắng đặc trưng.',
    y_nghia: 'Biểu tượng của tình người phương Nam, đồng hành cùng người mở cõi trải qua gian khó khai hoang lập ấp.',
    phu_hop_voi: ['ao_ba_ba_nam_bo'],
    compatibilityScore: 100,
    isTraditional: true
  },
  {
    id: 'quat_giay_lua',
    name: 'Quạt giấy lụa thư pháp',
    category: 'other',
    categoryName: 'Cầm tay & Khác',
    icon: '🪭',
    mo_ta: 'Chiếc quạt nan tre dán lụa tơ tằm hoặc giấy dó có đề thơ chữ Nôm.',
    y_nghia: 'Phụ kiện tao nhã của văn nhân tài tử, biểu trưng cho sự thong dong, thanh cao.',
    phu_hop_voi: ['ao_ngu_than_ao_tac', 'ao_the_khan_xep', 'ao_giao_linh', 'ao_dai_hue'],
    compatibilityScore: 93,
    isTraditional: true
  },
  {
    id: 'tui_clutch_gam',
    name: 'Túi clutch gấm hiện đại',
    category: 'other',
    categoryName: 'Cầm tay & Khác',
    icon: '👛',
    mo_ta: 'Túi cầm tay bọc vải gấm hoa văn truyền thống thiết kế theo phong cách tối giản.',
    y_nghia: 'Sự giao thoa hoàn hảo giữa chất liệu di sản và phong cách thời trang đương đại Gen Z.',
    phu_hop_voi: ['ao_dai_cach_tan', 'ao_dai_hue'],
    compatibilityScore: 90,
    isTraditional: false
  }
];

export function getAccessoriesByCategory(cat) {
  if (!cat || cat === 'all') return ACCESSORIES;
  return ACCESSORIES.filter(a => a.category === cat);
}

export function getCompatibleAccessories(outfitId) {
  return ACCESSORIES.filter(a => a.phu_hop_voi.includes(outfitId));
}
