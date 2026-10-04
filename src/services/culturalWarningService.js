/**
 * Hệ thống kiểm tra và cảnh báo văn hóa (Cultural Warnings Engine)
 * Phân cấp 3 mức độ: Info (ℹ️ Xanh), Caution (⚠️ Vàng), Warning (🚫 Đỏ)
 * Theo Mục V trong tài liệu thiết kế Việt Phục Remix
 */

export function evaluateCulturalWarnings({ outfit, event, accessories = [], colors = {} } = {}) {
  const warnings = [];

  if (!outfit) return warnings;

  const outfitId = outfit.id;
  const eventId = event?.id || event || '';

  // Quy tắc 1 (Warning): Áo Nhật Bình + Dịp đời thường / dạo phố
  if (outfitId === 'ao_nhat_binh' && (eventId === 'dao-pho' || eventId === 'hang-ngay')) {
    warnings.push({
      id: 'rule_01',
      type: 'warning',
      title: 'Khoan bạn ơi, hơi cấn rồi! 😅',
      message: 'Áo Nhật Bình là "đồ hiệu" siêu VIP của Hoàng tộc triều Nguyễn đó. Lên đồ lộng lẫy thế này mà chỉ đi dạo phố thì hơi "ô dề" nha.',
      suggestion: 'Thử chuyển sang Áo dài cách tân xem, vừa xinh xẻo lại cực kỳ năng động hợp vibe dạo phố.',
      recommendedOutfitId: 'ao_dai_cach_tan',
      recommendedOutfitName: 'Áo dài cách tân hiện đại',
      reference: 'Khâm định Đại Nam hội điển sự lệ; Bảo tàng Cổ vật Cung đình Huế'
    });
  }

  // Quy tắc 2 (Caution): Trộn trang phục Bắc Bộ + Phụ kiện đặc trưng Nam Bộ (Khăn rằn)
  const hasKhanRan = accessories.some(a => (typeof a === 'string' ? a.includes('khan_ran') : a.id === 'khan_ran_nam_bo'));
  if (outfitId === 'ao_tu_than' && hasKhanRan) {
    warnings.push({
      id: 'rule_02',
      type: 'caution',
      title: 'Pha trộn hệ đa vũ trụ Bắc - Nam? 🤔',
      message: 'Khăn rằn là signature của miền Tây sông nước, vác lên phối với Áo tứ thân liền chị Quan họ thì nhìn hơi bị "lạc trôi" bản sắc đó.',
      suggestion: 'Về đúng hệ Kinh Bắc với khăn mỏ quạ hoặc nón quai thao nha, đảm bảo chuẩn bài!',
      reference: 'Đoàn Thị Tình, "Trang phục Việt Nam", NXB Mỹ thuật'
    });
  }

  // Quy tắc 3 (Caution): Áo bà ba Nam Bộ + Khăn vành dây cung đình Huế
  const hasKhanVanhDay = accessories.some(a => (typeof a === 'string' ? a.includes('khan_vanh') : a.id === 'khan_vanh_day'));
  if (outfitId === 'ao_ba_ba_nam_bo' && hasKhanVanhDay) {
    warnings.push({
      id: 'rule_02b',
      type: 'caution',
      title: 'Cú twist phong cách: Cung đình mix Dân dã 🧐',
      message: 'Áo bà ba mang vibe mộc mạc chân chất, tự nhiên úp cái khăn vành dây quý tộc lên đầu nhìn nó cứ bị "chống đánh xuôi, kèn thổi ngược" sao á.',
      suggestion: 'Thay bằng nón lá hoặc khăn rằn đi, đơn giản mà slay cực kỳ!',
      reference: 'Bảo tàng Phụ nữ Nam Bộ'
    });
  }

  // Quy tắc 4 (Warning): Màu đen + trắng thuần túy cho ngày vui / Tết / Hỷ sự
  const primary = colors.primary?.toLowerCase() || '';
  const secondary = colors.secondary?.toLowerCase() || '';
  const isBlackAndWhite = (primary.includes('1c1c1c') || primary.includes('000000') || primary.includes('black')) &&
                          (secondary.includes('faf9f6') || secondary.includes('ffffff') || secondary.includes('white'));
  if (isBlackAndWhite && (eventId === 'tet' || eventId === 'dam-cuoi')) {
    warnings.push({
      id: 'rule_04',
      type: 'warning',
      title: 'Red flag màu sắc ngày hỷ sự! 🚩',
      message: 'Full cây Trắng - Đen vào dịp Tết hay cưới hỏi là tối kỵ theo văn hóa xưa á. Nhìn trang nghiêm quá lại tưởng đang đi sự kiện... buồn.',
      suggestion: 'Chấm thêm miếng đỏ son cho hên, hoặc vàng hoàng gia cho phú quý, nạp năng lượng tích cực liền!',
      reference: 'Phong tục tập quán dân gian Việt Nam; NXB Văn hóa Dân tộc'
    });
  }

  // Quy tắc 5 (Info): Áo dài trắng nam giới trong dịp dạo phố
  if (outfit.gioi_tinh === 'nam' && (primary.includes('ffffff') || primary.includes('faf9f6') || outfitId === 'ao_dai_hue') && eventId === 'dao-pho') {
    warnings.push({
      id: 'rule_05',
      type: 'info',
      title: 'Mẹo nhỏ phối màu cho nam thần 💡',
      message: 'Áo dài trắng trơn cho nam thường được xem là outfit chú rể. Mặc dạo phố dễ bị hiểu lầm là chú rể đi lạc đó nha.',
      suggestion: 'Thử chuyển sang hệ màu trầm như Xanh navy rêu phong, hoặc Nâu gụ xem, vừa ngầu vừa cuốn hút.',
      fixAction: { type: 'color', primary: '#1B365D' },
      reference: 'Trần Quang Đức, "Ngàn năm áo mũ"'
    });
  }

  // Quy tắc 6 (Caution): Áo ngũ thân / Áo tấc phối cùng nón quai thao Bắc Bộ
  const hasNonQuaiThao = accessories.some(a => (typeof a === 'string' ? a.includes('quai_thao') : a.id === 'non_quai_thao'));
  if (outfitId === 'ao_ngu_than_ao_tac' && hasNonQuaiThao) {
    warnings.push({
      id: 'rule_06',
      type: 'caution',
      title: 'Check var phụ kiện xíu nè! 🔍',
      message: 'Áo tấc triều Nguyễn là đồ đi nét của bậc danh gia vọng tộc, mix với nón quai thao liền chị Quan họ thì nó lại thành 1 rổ "cảm lạnh".',
      suggestion: 'Thay sang khăn đóng nam hoặc quạt lụa là tự động hóa thân thành tổng tài triều Nguyễn liền!',
      fixAction: { type: 'replace_accessory', remove: 'non_quai_thao', add: 'khan_dong_nam' },
      reference: 'Vũ Phỉ, "Cổ phục triều Nguyễn", 2018'
    });
  }

  // Quy tắc 7 (Info): Chọn chất liệu vải thô/đũi cho dịp đại lễ cưới hỏi
  const hasVaiTho = outfit.chat_lieu?.toLowerCase().includes('đũi') || outfit.chat_lieu?.toLowerCase().includes('thô');
  if (hasVaiTho && eventId === 'dam-cuoi') {
    warnings.push({
      id: 'rule_07',
      type: 'info',
      title: 'Chọn vải đi quẩy lễ cưới ✨',
      message: 'Vải đũi thô tuy mát nhưng hơi "thôn dã", mặc đi ăn cưới dễ bị chìm nghỉm giữa dàn lụa là gấm vóc.',
      suggestion: 'Quất ngay lụa tơ tằm hoặc gấm dệt hoa văn để giao diện luôn phát sáng, 10 điểm sang chảnh!',
      fixAction: { type: 'material', material: 'Gấm dệt tơ sen' },
      reference: 'Mỹ tục gia đình và hôn lễ truyền thống Việt Nam'
    });
  }

  // Quy tắc 8 (Warning): Áo Giao lĩnh cổ truyền cần phân biệt với cổ phục các nước Đông Á
  if (outfitId === 'ao_giao_linh') {
    warnings.push({
      id: 'rule_08',
      type: 'info',
      title: 'Fact thú vị về Áo Giao Lĩnh 📜',
      message: 'Ngày xưa các cụ Đại Việt quy định vạt áo bên trái luôn vắt sang phải (gọi là Hữu Nhậm). Đừng vắt ngược lại nha, thế là thành phong cách... cõi âm đó.',
      suggestion: 'Cứ giữ chuẩn form Hữu Nhậm, thêm cái thắt lưng lụa thả dài phía trước là tự động có cốt cách cổ phong ngay.',
      reference: 'Trần Quang Đức, "Ngàn năm áo mũ", NXB Thế giới'
    });
  }

  return warnings;
}
