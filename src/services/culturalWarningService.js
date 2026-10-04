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
      title: 'Trang phục cung đình trong bối cảnh đời thường',
      message: 'Áo Nhật Bình là lễ phục cung đình trang trọng của Hoàng tộc triều Nguyễn, thường dùng trong đại lễ hoặc hôn lễ.',
      suggestion: 'Nếu muốn phong cách thanh nhã hàng ngày, bạn hãy thử Áo dài cách tân hoặc Áo dài truyền thống nhẹ nhàng.',
      reference: 'Khâm định Đại Nam hội điển sự lệ; Bảo tàng Cổ vật Cung đình Huế'
    });
  }

  // Quy tắc 2 (Caution): Trộn trang phục Bắc Bộ + Phụ kiện đặc trưng Nam Bộ (Khăn rằn)
  const hasKhanRan = accessories.some(a => (typeof a === 'string' ? a.includes('khan_ran') : a.id === 'khan_ran_nam_bo'));
  if (outfitId === 'ao_tu_than' && hasKhanRan) {
    warnings.push({
      id: 'rule_02',
      type: 'caution',
      title: 'Pha trộn đặc trưng vùng miền (Bắc Bộ & Nam Bộ)',
      message: 'Khăn rằn là biểu tượng mộc mạc sông nước Nam Bộ, khi kết hợp với Áo tứ thân Kinh Bắc sẽ làm mờ nhạt bản sắc riêng của văn hóa Quan họ.',
      suggestion: 'Hãy cân nhắc dùng khăn mỏ quạ hoặc nón quai thao để giữ nét Kinh Bắc thuần túy.',
      reference: 'Đoàn Thị Tình, "Trang phục Việt Nam", NXB Mỹ thuật'
    });
  }

  // Quy tắc 3 (Caution): Áo bà ba Nam Bộ + Khăn vành dây cung đình Huế
  const hasKhanVanhDay = accessories.some(a => (typeof a === 'string' ? a.includes('khan_vanh') : a.id === 'khan_vanh_day'));
  if (outfitId === 'ao_ba_ba_nam_bo' && hasKhanVanhDay) {
    warnings.push({
      id: 'rule_02b',
      type: 'caution',
      title: 'Xung đột phong cách Cung đình & Dân dã',
      message: 'Áo bà ba mang tính mộc mạc, gần gũi với đời sống sông nước, không phù hợp khi đội khăn vành dây quý tộc chốn hoàng cung.',
      suggestion: 'Nên phối cùng nón lá hoặc khăn rằn Nam Bộ giản dị mà thanh lịch.',
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
      title: 'Tổ hợp màu kiêng kỵ trong dịp Tết / Hỷ sự',
      message: 'Tổ hợp Đen - Trắng thuần túy trong mỹ tục cổ truyền Việt Nam thường gắn liền với việc trang nghiêm hoặc tang lễ, tránh dùng đơn điệu ngày đầu xuân.',
      suggestion: 'Nên chọn điểm xuyết sắc Đỏ son (may mắn) hoặc Vàng hoàng gia (phú quý) để mang lại năng lượng tích cực.',
      reference: 'Phong tục tập quán dân gian Việt Nam; NXB Văn hóa Dân tộc'
    });
  }

  // Quy tắc 5 (Info): Áo dài trắng nam giới trong dịp dạo phố
  if (outfit.gioi_tinh === 'nam' && (primary.includes('ffffff') || primary.includes('faf9f6') || outfitId === 'ao_dai_hue') && eventId === 'dao-pho') {
    warnings.push({
      id: 'rule_05',
      type: 'info',
      title: 'Lưu ý về màu sắc áo dài nam',
      message: 'Áo dài trắng trơn cho nam giới truyền thống thường xuất hiện ở lễ cưới (chú rể) hoặc nghi thức trang trọng.',
      suggestion: 'Với sự kiện dạo phố thoải mái, bạn có thể chọn tông màu xanh thẫm, nâu gụ hoặc ghi xám để tạo vẻ gần gũi.',
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
      title: 'Pha trộn lễ phục triều Nguyễn với phụ kiện dân gian Kinh Bắc',
      message: 'Áo tấc triều Nguyễn chuẩn mực thường đi cùng khăn đóng hoặc khăn xếp. Nón quai thao là nét đặc trưng riêng của Áo tứ thân liền chị Quan họ.',
      suggestion: 'Thay nón quai thao bằng khăn đóng hoặc quạt lụa để giữ phong thái tề chỉnh của bậc danh gia vọng tộc.',
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
      title: 'Chất liệu vải trong ngày đại hỷ',
      message: 'Vải đũi thô mang nét mộc mạc thôn dã, trong ngày cưới truyền thống các gia đình thường chuộng lụa tơ tằm hoặc gấm thêu hoa chìm để tôn vẻ vinh hoa.',
      suggestion: 'Cân nhắc chất liệu gấm dệt hoa văn chữ Thọ hoặc lụa Vạn Phúc để thêm phần rạng rỡ, tôn nghiêm.',
      fixAction: { type: 'material', material: 'Gấm dệt tơ sen' },
      reference: 'Mỹ tục gia đình và hôn lễ truyền thống Việt Nam'
    });
  }

  // Quy tắc 8 (Warning): Áo Giao lĩnh cổ truyền cần phân biệt với cổ phục các nước Đông Á
  if (outfitId === 'ao_giao_linh') {
    warnings.push({
      id: 'rule_08',
      type: 'info',
      title: 'Quy cách vạt chéo Hữu Nhậm của Áo Giao Lĩnh Đại Việt',
      message: 'Theo cổ chế Đại Việt thời Lý - Trần - Lê, vạt áo bên trái luôn vắt sang bên phải (Hữu nhậm). Tuyệt đối tránh vắt ngược vạt phải sang trái vì đây là cách mặc cho người quá cố.',
      suggestion: 'Giữ cấu trúc vạt chéo hữu nhậm chuẩn mực và kết hợp thắt lưng lụa mềm thả dài trước thân áo.',
      reference: 'Trần Quang Đức, "Ngàn năm áo mũ", NXB Thế giới'
    });
  }

  return warnings;
}
