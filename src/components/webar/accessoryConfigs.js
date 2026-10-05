/**
 * Cấu hình phụ kiện WebAR (Accessory Configs)
 * Định nghĩa 3 phụ kiện: Khăn đóng, Nón quai thao, Nón lá
 * Căn chỉnh hoàn toàn qua config: scale, anchorX, anchorY, offsetX, offsetY
 */

// SVG Vector tạo sẵn trong suốt, sắc nét phong cách thời trang di sản Việt
const KHAN_DONG_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="400" height="320">
  <defs>
    <linearGradient id="kdNavy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%231a2639"/>
      <stop offset="40%" stop-color="%2324334a"/>
      <stop offset="100%" stop-color="%230f1724"/>
    </linearGradient>
    <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="%23d4af37"/>
      <stop offset="50%" stop-color="%23fff2a3"/>
      <stop offset="100%" stop-color="%23b8860b"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Vành khăn xếp nhiều lớp (Khăn đóng triều Nguyễn) -->
  <g filter="url(%23shadow)">
    <!-- Đỉnh khăn khép kín -->
    <ellipse cx="200" cy="85" rx="130" ry="45" fill="%23141c2b" stroke="%233a4d6b" stroke-width="2"/>
    <ellipse cx="200" cy="85" rx="122" ry="40" fill="%230d131f"/>
    <!-- Thân khăn hình vòm nhiều nếp gấp đặc trưng -->
    <path d="M 65 140 C 65 80, 335 80, 335 140 C 335 190, 65 190, 65 140 Z" fill="url(%23kdNavy)"/>
    <!-- Lớp nếp quấn 1 (trên) -->
    <path d="M 72 135 Q 200 175 328 135 Q 324 165 318 185 Q 200 220 82 185 Q 75 160 72 135 Z" fill="%231e2c40" stroke="%23d4af37" stroke-width="1.5" stroke-opacity="0.6"/>
    <!-- Lớp nếp quấn 2 (giữa - chữ Nhất / chữ Nhân) -->
    <path d="M 78 170 Q 200 215 322 170 Q 315 205 305 225 Q 200 260 95 225 Q 85 200 78 170 Z" fill="url(%23kdNavy)" stroke="%23d4af37" stroke-width="2" stroke-opacity="0.75"/>
    <!-- Lớp nếp quấn 3 (vành ôm trán) -->
    <path d="M 88 210 Q 200 255 312 210 Q 300 245 285 260 Q 200 295 115 260 Q 98 240 88 210 Z" fill="%23151f2e" stroke="url(%23goldTrim)" stroke-width="3"/>
    <!-- Điểm nhấn ngọc/nút cài phía trước -->
    <circle cx="200" cy="245" r="9" fill="url(%23goldTrim)"/>
    <circle cx="200" cy="245" r="5" fill="%23a82417"/>
  </g>
</svg>`;

const NON_QUAI_THAO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="600" height="380">
  <defs>
    <linearGradient id="bamboo" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="%23d8b26e"/>
      <stop offset="50%" stop-color="%23f3dfaa"/>
      <stop offset="100%" stop-color="%23c49a52"/>
    </linearGradient>
    <linearGradient id="silkRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%238b0000"/>
      <stop offset="50%" stop-color="%23c0392b"/>
      <stop offset="100%" stop-color="%23660000"/>
    </linearGradient>
    <filter id="shadowQuaiThao" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Quai thao buông rủ hai bên -->
  <g filter="url(%23shadowQuaiThao)">
    <!-- Quai thao lụa bên trái -->
    <path d="M 175 145 C 160 210, 130 280, 145 370 C 150 370, 162 370, 158 310 C 154 260, 185 200, 185 145 Z" fill="url(%23silkRibbon)"/>
    <!-- Quai thao lụa bên phải -->
    <path d="M 425 145 C 440 210, 470 280, 455 370 C 450 370, 438 370, 442 310 C 446 260, 415 200, 415 145 Z" fill="url(%23silkRibbon)"/>
    <!-- Quả tua quai thao (Tassels) -->
    <ellipse cx="148" cy="370" rx="10" ry="12" fill="%23d4af37"/>
    <ellipse cx="452" cy="370" rx="10" ry="12" fill="%23d4af37"/>

    <!-- Vành nón ba tầm phẳng dẹt rộng đặc trưng Kinh Bắc -->
    <ellipse cx="300" cy="120" rx="280" ry="60" fill="%23a07838" stroke="%235a3d12" stroke-width="4"/>
    <ellipse cx="300" cy="115" rx="275" ry="55" fill="url(%23bamboo)"/>
    
    <!-- Các đường nan nón đồng tâm đan khéo léo -->
    <ellipse cx="300" cy="115" rx="225" ry="44" fill="none" stroke="%23b88b43" stroke-width="2.5" stroke-dasharray="8,4"/>
    <ellipse cx="300" cy="115" rx="175" ry="34" fill="none" stroke="%23b88b43" stroke-width="2"/>
    <ellipse cx="300" cy="115" rx="125" ry="24" fill="none" stroke="%23a07838" stroke-width="2"/>
    
    <!-- Chóp nón dẹt chính giữa -->
    <ellipse cx="300" cy="112" rx="75" ry="16" fill="%23946a2a" stroke="%23d4af37" stroke-width="2"/>
    <ellipse cx="300" cy="110" rx="40" ry="9" fill="%23c49a52"/>
    <circle cx="300" cy="109" r="6" fill="%23d4af37"/>
  </g>
</svg>`;

const NON_LA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 360" width="500" height="360">
  <defs>
    <linearGradient id="palmLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23f9eedb"/>
      <stop offset="45%" stop-color="%23e8d4b0"/>
      <stop offset="100%" stop-color="%23c5ab7d"/>
    </linearGradient>
    <linearGradient id="leafShade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="%23e8d4b0"/>
      <stop offset="50%" stop-color="%23f9eedb"/>
      <stop offset="100%" stop-color="%23bda072"/>
    </linearGradient>
    <filter id="shadowNonLa" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="7" flood-opacity="0.4"/>
    </filter>
  </defs>
  <g filter="url(%23shadowNonLa)">
    <!-- Quai nón nhung đỏ buông mềm mại -->
    <path d="M 130 260 C 150 320, 200 350, 250 350 C 300 350, 350 320, 370 260 C 362 260, 345 310, 250 340 C 155 310, 138 260, 130 260 Z" fill="%23c0392b" opacity="0.85"/>
    
    <!-- Thân nón lá hình nón chóp nhọn truyền thống -->
    <path d="M 250 20 L 485 270 C 410 305, 90 305, 15 270 Z" fill="url(%23leafShade)" stroke="%23b89b6c" stroke-width="2"/>
    
    <!-- 16 vành nan nón tre cong đặc trưng (Nón bài thơ / Nón lá Việt Nam) -->
    <path d="M 225 50 Q 250 56 275 50" stroke="%23ab8b5c" stroke-width="1.5" fill="none"/>
    <path d="M 205 80 Q 250 90 295 80" stroke="%23ab8b5c" stroke-width="1.5" fill="none"/>
    <path d="M 180 115 Q 250 130 320 115" stroke="%23ab8b5c" stroke-width="1.5" fill="none"/>
    <path d="M 155 150 Q 250 170 345 150" stroke="%23ab8b5c" stroke-width="1.8" fill="none"/>
    <path d="M 125 190 Q 250 215 375 190" stroke="%23ab8b5c" stroke-width="2" fill="none"/>
    <path d="M 95 230 Q 250 260 405 230" stroke="%23ab8b5c" stroke-width="2.2" fill="none"/>
    <path d="M 55 265 Q 250 300 445 265" stroke="%23947342" stroke-width="2.5" fill="none"/>
    
    <!-- Vành đáy nón lá uốn cong chắc chắn -->
    <ellipse cx="250" cy="272" rx="235" ry="32" fill="none" stroke="%23846232" stroke-width="4"/>
    <!-- Chóp nón nhọn đỉnh -->
    <polygon points="250,15 244,30 256,30" fill="%23846232"/>
  </g>
</svg>`;

export const ACCESSORIES_CONFIG = {
  khan_dong: {
    id: 'khan_dong',
    name: 'Khăn Đóng',
    subtitle: 'Quý tộc Triều Nguyễn & Bắc Bộ',
    description: 'Vành khăn quấn nhiều lớp chữ Nhân/chữ Nhất chuẩn mực cung đình nho nhã.',
    image: KHAN_DONG_SVG,
    scale: 1.8,           // Tỉ lệ bề rộng so với mặt (tăng do SVG có viền rỗng)
    anchorX: 0.5,         // Tâm ngang của ảnh (giữa khăn)
    anchorY: 0.88,        // Điểm neo đáy khăn ôm trán
    offsetX: 0.0,         // Độ lệch trục X
    offsetY: 0.0,         // Đặt sát trán
    rotationOffset: 0
  },
  non_quai_thao: {
    id: 'non_quai_thao',
    name: 'Nón Quai Thao',
    subtitle: 'Nét duyên Quan họ Kinh Bắc',
    description: 'Nón ba tầm phẳng dẹt rộng vành đi cùng dải quai thao lụa buông duyên dáng.',
    image: NON_QUAI_THAO_SVG,
    scale: 3.5,           // Nón quai thao rất rộng
    anchorX: 0.5,
    anchorY: 0.62,        // Chóp nón nằm trên đỉnh đầu
    offsetX: 0.0,
    offsetY: -0.2,        // Nâng cao qua trán
    rotationOffset: 0
  },
  non_la: {
    id: 'non_la',
    name: 'Nón Lá',
    subtitle: 'Biểu tượng hồn quê xứ Việt',
    description: 'Nón lá chóp nhọn 16 vành nan tre thanh thoát, che chở nắng mưa ba miền.',
    image: NON_LA_SVG,
    scale: 2.6,           // Bề rộng nón lá
    anchorX: 0.5,
    anchorY: 0.82,        // Vành nón chụp xuống ngang trán
    offsetX: 0.0,
    offsetY: -0.15,       // Nâng chóp lên đỉnh đầu
    rotationOffset: 0
  }
};

export const DEFAULT_ACCESSORY_ID = 'khan_dong';
