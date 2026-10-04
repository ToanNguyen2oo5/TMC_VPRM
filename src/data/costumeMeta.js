/**
 * Dữ liệu mở rộng: Gợi ý địa điểm chụp ảnh & Chi phí thuê tham khảo
 * Phù hợp với bối cảnh văn hóa của từng loại Việt phục
 */

export const COSTUME_META = {
  'ao_dai_hue': {
    photoSpots: [
      { name: 'Cố đô Huế & Cầu Tràng Tiền', desc: 'Bối cảnh sông Hương thơ mộng' },
      { name: 'Lăng Khải Định / Lăng Tự Đức', desc: 'Kiến trúc cung đình cổ kính' },
      { name: 'Chùa Thiên Mụ', desc: 'Thanh tịnh, trầm mặc bên bờ sông' }
    ],
    rentalEstimate: '120.000đ – 220.000đ / ngày',
    rentalNote: 'Giá tham khảo, thay đổi theo cửa hàng & địa phương (kèm nón lá hoặc guốc mộc).'
  },
  'ao_dai_cach_tan': {
    photoSpots: [
      { name: 'Phố đi bộ Nguyễn Huệ & Trụ sở HĐND', desc: 'Kiến trúc Pháp đương đại trẻ trung' },
      { name: 'Phố cổ Hội An', desc: 'Mái ngói rêu phong, đèn lồng rực rỡ' },
      { name: 'Bảo tàng Mỹ thuật TP.HCM / Hà Nội', desc: 'Tone vàng cổ điển, ánh sáng nghệ thuật' }
    ],
    rentalEstimate: '100.000đ – 180.000đ / ngày',
    rentalNote: 'Giá tham khảo, thay đổi theo chất liệu ren/lụa & kiểu dáng cách tân.'
  },
  'ao_tu_than': {
    photoSpots: [
      { name: 'Hội Lim & Đồi Lim Bắc Ninh', desc: 'Cái nôi Quan họ Kinh Bắc' },
      { name: 'Làng cổ Đường Lâm (Hà Nội)', desc: 'Cổng làng, tường đá ong cổ xưa' },
      { name: 'Chùa Thầy & Hồ Long Trì', desc: 'Phong cảnh sơn thủy hữu tình' }
    ],
    rentalEstimate: '150.000đ – 250.000đ / ngày',
    rentalNote: 'Giá tham khảo, thường trọn bộ gồm áo tứ thân, yếm đào, thắt lưng & nón quai thao.'
  },
  'ao_ngu_than_ao_tac': {
    photoSpots: [
      { name: 'Văn Miếu - Quốc Tử Giám', desc: 'Không gian trường đại học đầu tiên, đậm chất Nho nhã' },
      { name: 'Hoàng thành Thăng Long', desc: 'Di sản nghìn năm văn hiến' },
      { name: 'Lăng Ông Bà Chiểu (TP.HCM)', desc: 'Kiến trúc miếu cổ Nam Bộ trang nghiêm' }
    ],
    rentalEstimate: '180.000đ – 320.000đ / ngày',
    rentalNote: 'Giá tham khảo, gồm áo tấc lụa gấm, quần trắng & khăn đóng truyền thống.'
  },
  'ao_nhat_binh': {
    photoSpots: [
      { name: 'Đại Nội Huế & Cung Diên Thọ', desc: 'Nơi ở thực sự của Hoàng thái hậu triều Nguyễn' },
      { name: 'Phim trường cổ trang / Cố đô', desc: 'Không gian phục dựng cung đình tôn nghiêm' },
      { name: 'Chùa Bái Đính / Cố đô Hoa Lư', desc: 'Không gian đại lễ hùng tráng' }
    ],
    rentalEstimate: '250.000đ – 450.000đ / ngày',
    rentalNote: 'Giá tham khảo, gồm áo Nhật Bình thêu tay, khăn vành dây vàng kim & hài thêu.'
  },
  'ao_ba_ba_nam_bo': {
    photoSpots: [
      { name: 'Chợ nổi Cái Răng (Cần Thơ)', desc: 'Nhịp sống sông nước miền Tây đích thực' },
      { name: 'Rừng tràm Trà Sư (An Giang)', desc: 'Bèo xanh mướt mát, cầu tre lãng mạn' },
      { name: 'Làng du lịch Cù lao Thới Sơn', desc: 'Vườn cây trái xum xuê, đò chèo mộc mạc' }
    ],
    rentalEstimate: '80.000đ – 150.000đ / ngày',
    rentalNote: 'Giá tham khảo, trọn bộ áo bà ba, quần lụa đen, khăn rằn & nón lá.'
  },
  'ao_giao_linh': {
    photoSpots: [
      { name: 'Khu di tích Lam Kinh (Thanh Hóa)', desc: 'Cội nguồn hoàng tộc triều Lê Sơ' },
      { name: 'Chùa Dâu & Lăng Kinh Dương Vương', desc: 'Không gian cổ sơ huyền thoại Đại Việt' },
      { name: 'Cố đô Hoa Lư (Ninh Bình)', desc: 'Kinh đô thời Đinh - Tiền Lê uy nghiêm' }
    ],
    rentalEstimate: '180.000đ – 300.000đ / ngày',
    rentalNote: 'Giá tham khảo, gồm áo giao lĩnh vạt chéo, thắt lưng lụa mềm & hài vải.'
  }
};
