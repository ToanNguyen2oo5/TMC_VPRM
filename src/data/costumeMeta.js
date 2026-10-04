/**
 * Dữ liệu mở rộng: Gợi ý địa điểm chụp ảnh, Chi phí thuê tham khảo,
 * Danh xưng Cổ phong Gen Z & Lời bình dí dỏm do AI Stylist phong tặng.
 */

export const COSTUME_META = {
  'ao_dai_hue': {
    photoSpots: [
      { name: 'Cố đô Huế & Cầu Tràng Tiền', desc: 'Bối cảnh sông Hương thơ mộng' },
      { name: 'Lăng Khải Định / Lăng Tự Đức', desc: 'Kiến trúc cung đình cổ kính' },
      { name: 'Chùa Thiên Mụ', desc: 'Thanh tịnh, trầm mặc bên bờ sông' }
    ],
    rentalEstimate: '120.000đ – 220.000đ / ngày',
    basePrice: 160000,
    rentalNote: 'Giá tham khảo, thay đổi theo cửa hàng & địa phương (kèm nón lá hoặc guốc mộc).',
    personaTitle: 'Cố Đô Thục Nữ',
    personaSubtitle: 'Trầm mặc sông Hương, đài các xứ Thần Kinh',
    funPraise: 'Tà áo tím thướt tha thế này thì đi qua cầu Tràng Tiền là gió sông Hương cũng phải ngơ ngẩn đứng nhìn! Nét đẹp thanh tao chuẩn vibe tiểu thư cung đình xưa luôn nhé! 💜✨',
    element: 'Thủy (Màu Tím / Xanh Chàm)',
    authenticityTag: 'Di Sản Triều Nguyễn'
  },
  'ao_dai_cach_tan': {
    photoSpots: [
      { name: 'Phố đi bộ Nguyễn Huệ & Trụ sở HĐND', desc: 'Kiến trúc Pháp đương đại trẻ trung' },
      { name: 'Phố cổ Hội An', desc: 'Mái ngói rêu phong, đèn lồng rực rỡ' },
      { name: 'Bảo tàng Mỹ thuật TP.HCM / Hà Nội', desc: 'Tone vàng cổ điển, ánh sáng nghệ thuật' }
    ],
    rentalEstimate: '100.000đ – 180.000đ / ngày',
    basePrice: 140000,
    rentalNote: 'Giá tham khảo, thay đổi theo chất liệu ren/lụa & kiểu dáng cách tân.',
    personaTitle: 'Đương Đại Nữ Sĩ',
    personaSubtitle: 'Giao thoa thanh lịch giữa di sản ngàn năm và nhịp thở phố thị',
    funPraise: 'Phối đồ chất lừ không góc chết! Vừa giữ trọn form dáng duyên dáng vừa thoải mái sải bước dạo phố, chụp 100 tấm thì 101 tấm lên xu hướng TikTok ngay lập tức! 📸🔥',
    element: 'Kim (Trắng / Hồng Pastel / Vàng Nhạt)',
    authenticityTag: 'Cách Tân Đương Đại'
  },
  'ao_tu_than': {
    photoSpots: [
      { name: 'Hội Lim & Đồi Lim Bắc Ninh', desc: 'Cái nôi Quan họ Kinh Bắc' },
      { name: 'Làng cổ Đường Lâm (Hà Nội)', desc: 'Cổng làng, tường đá ong cổ xưa' },
      { name: 'Chùa Thầy & Hồ Long Trì', desc: 'Phong cảnh sơn thủy hữu tình' }
    ],
    rentalEstimate: '150.000đ – 250.000đ / ngày',
    basePrice: 190000,
    rentalNote: 'Giá tham khảo, thường trọn bộ gồm áo tứ thân, yếm đào, thắt lưng & nón quai thao.',
    personaTitle: 'Kinh Bắc Liền Chị',
    personaSubtitle: 'Duyên dáng mớ ba mớ bảy, e ấp tình tứ nón quai thao',
    funPraise: 'Trời ơi diện chiếc áo tứ thân mớ ba mớ bảy này lên nhìn nàng cứ phải gọi là dịu dàng hết nấc! Vừa thắm sắc yếm đào vừa đoan trang thanh nhã, liền anh nào nhìn thấy cũng muốn hát câu mời trầu! 🌸🍃',
    element: 'Mộc (Hồng Sen / Xanh Lục / Nâu Đất)',
    authenticityTag: 'Di Sản Phi Vật Thể UNESCO'
  },
  'ao_ngu_than_ao_tac': {
    photoSpots: [
      { name: 'Văn Miếu - Quốc Tử Giám', desc: 'Không gian trường đại học đầu tiên, đậm chất Nho nhã' },
      { name: 'Hoàng thành Thăng Long', desc: 'Di sản nghìn năm văn hiến' },
      { name: 'Lăng Ông Bà Chiểu (TP.HCM)', desc: 'Kiến trúc miếu cổ Nam Bộ trang nghiêm' }
    ],
    rentalEstimate: '180.000đ – 320.000đ / ngày',
    basePrice: 220000,
    rentalNote: 'Giá tham khảo, gồm áo tấc lụa gấm, quần trắng & khăn đóng truyền thống.',
    personaTitle: 'Thăng Long Nho Sinh',
    personaSubtitle: 'Chính khí đường hoàng, ngũ thường trọn vẹn',
    funPraise: 'Khoác áo tấc tay thụng cài đủ 5 khuy ngũ thường, bước đi một bước là toát ra khí chất thủ khoa tú tài bảng nhãn! Đi lễ tốt nghiệp hay chụp kỷ yếu Văn Miếu thì chỉ có điểm 10 uy tín! 🎓📜',
    element: 'Hỏa (Đỏ Son / Tấc Gấm Hoàng Gia)',
    authenticityTag: 'Chuẩn Điển Chế Triều Nguyễn'
  },
  'ao_nhat_binh': {
    photoSpots: [
      { name: 'Đại Nội Huế & Cung Diên Thọ', desc: 'Nơi ở thực sự của Hoàng thái hậu triều Nguyễn' },
      { name: 'Phim trường cổ trang / Cố đô', desc: 'Không gian phục dựng cung đình tôn nghiêm' },
      { name: 'Chùa Bái Đính / Cố đô Hoa Lư', desc: 'Không gian đại lễ hùng tráng' }
    ],
    rentalEstimate: '250.000đ – 450.000đ / ngày',
    basePrice: 320000,
    rentalNote: 'Giá tham khảo, gồm áo Nhật Bình thêu tay, khăn vành dây vàng kim & hài thêu.',
    personaTitle: 'Hoàng Tộc Vương Phi',
    personaSubtitle: 'Vương giả cửu trùng, dải viền ngũ hành cát tường',
    funPraise: 'Khí chất vương giả ngút ngàn của bậc mẫu nghi thiên hạ! Cổ áo Nhật Bình ngũ hành thêu chỉ kim tuyến lấp lánh thế này thì đứng ở góc nào của Đại Nội cũng tỏa hào quang vạn trượng! 👑✨',
    element: 'Thổ & Ngũ Hành (Vàng Kim / Xanh Ngọc / Đỏ)',
    authenticityTag: 'Lễ Phục Cung Đình Thượng Đẳng'
  },
  'ao_ba_ba_nam_bo': {
    photoSpots: [
      { name: 'Chợ nổi Cái Răng (Cần Thơ)', desc: 'Nhịp sống sông nước miền Tây đích thực' },
      { name: 'Rừng tràm Trà Sư (An Giang)', desc: 'Bèo xanh mướt mát, cầu tre lãng mạn' },
      { name: 'Làng du lịch Cù lao Thới Sơn', desc: 'Vườn cây trái xum xuê, đò chèo mộc mạc' }
    ],
    rentalEstimate: '80.000đ – 150.000đ / ngày',
    basePrice: 110000,
    rentalNote: 'Giá tham khảo, trọn bộ áo bà ba, quần lụa đen, khăn rằn & nón lá.',
    personaTitle: 'Cô Ba Sông Nước',
    personaSubtitle: 'Hào sảng nghĩa tình, mộc mạc châu thổ Cửu Long',
    funPraise: 'Chiếc áo bà ba ôm nhẹ dáng ngọc, thêm chiếc khăn rằn vắt vai là chuẩn nét duyên con gái miền Tây! Đẹp mộc mạc mà cuốn hút vô cùng, nụ cười tỏa nắng làm xao xuyến cả bến sông! 🌴🛶',
    element: 'Thủy & Mộc (Đen Tuyến / Hoa Dừa / Nâu)',
    authenticityTag: 'Dân Gian Nam Bộ Thuần Khiết'
  },
  'ao_giao_linh': {
    photoSpots: [
      { name: 'Khu di tích Lam Kinh (Thanh Hóa)', desc: 'Cội nguồn hoàng tộc triều Lê Sơ' },
      { name: 'Chùa Dâu & Lăng Kinh Dương Vương', desc: 'Không gian cổ sơ huyền thoại Đại Việt' },
      { name: 'Cố đô Hoa Lư (Ninh Bình)', desc: 'Kinh đô thời Đinh - Tiền Lê uy nghiêm' }
    ],
    rentalEstimate: '180.000đ – 300.000đ / ngày',
    basePrice: 240000,
    rentalNote: 'Giá tham khảo, gồm áo giao lĩnh vạt chéo, thắt lưng lụa mềm & hài vải.',
    personaTitle: 'Đại Việt Hiệp Khách',
    personaSubtitle: 'Khí phách ngút trời, vạt áo hữu nhậm hòa hợp đất trời',
    funPraise: 'Vạt chéo Hữu Nhậm cổ kính Đại Việt, tà áo bay nhẹ trong gió ngỡ như cao nhân bước ra từ sử thi nghìn năm! Một nét đẹp vừa hào hùng vừa lãng mạn chuẩn thần thái cổ phong! ⚔️🍃',
    element: 'Mộc & Kim (Chàm Cổ / Trắng Lụa)',
    authenticityTag: 'Cổ Phục Thời Lý - Trần - Lê'
  }
};
