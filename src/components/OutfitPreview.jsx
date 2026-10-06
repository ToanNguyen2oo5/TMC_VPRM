import { useState } from 'react';
import './OutfitPreview.css';

/**
 * Động cơ Minh họa Cổ phục Việt Nam bằng CSS/SVG
 * Hỗ trợ 3 phong cách: Vector Art (Chi tiết cao), Anime (Cel-Shading), Flat Design (Tối giản)
 * Tích hợp đường cong Cubic Bézier, đa tầng nếp gấp vải (Folds & Depth) và bộ lọc feTurbulence
 */
export default function OutfitPreview({
  selectedOutfit,
  primaryColor = '#8B0000',
  secondaryColor = '#DAA520',
  accentColor = '#FFD700',
  selectedAccessories = [],
  harmonyScore = 85,
  fit = 'Vừa vặn',
  length = 'Dài (chấm gót)',
  fabricTexture = 'silk',
  variant = 'default'
}) {
  const [activeTab, setActiveTab] = useState('mannequin'); // 'mannequin' | 'heritage'
  const artStyle = 'vector';
  const isFlat = false;
  const isAnime = false;
  const isVector = true;
  const [hoveredPart, setHoveredPart] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!selectedOutfit) {
    return (
      <div className="outfit-preview-card empty-preview glass-panel">
        <p className="empty-text">Vui lòng chọn một trang phục để xem trước</p>
      </div>
    );
  }

  // Lấy ID trang phục
  const accIds = selectedAccessories.map(a => typeof a === 'string' ? a : a.id);
  const hasAccessory = (idSubstr) => accIds.some(id => id.includes(idSubstr));
  const outfitId = selectedOutfit.id || 'ao_dai_hue';

  // Render SVG Silhouette Mannequin tương ứng với từng loại trang phục
  const renderMannequinSvg = () => {
    return (
      <svg 
        viewBox="0 0 340 540" 
        className={`mannequin-svg style--${artStyle} texture--${fabricTexture}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 1. BỘ LỌC SVG SỢI VẢI HỮU CƠ (feTurbulence & feDisplacementMap) */}
          <filter id="organicFabricTexture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65 0.5" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.16 0" result="coloredNoise" />
            <feComposite in="displaced" in2="coloredNoise" operator="in" result="textured" />
            <feBlend in="displaced" in2="textured" mode="multiply" />
          </filter>

          {/* 2. GRADIENTS ĐA TẦNG CHO VECTOR ART & CEL-SHADING ANIME */}
          {/* Primary Gradient (Tà áo chính) */}
          <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {isFlat ? (
              <>
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="100%" stopColor={primaryColor} />
              </>
            ) : isAnime ? (
              <>
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="65%" stopColor={primaryColor} />
                <stop offset="66%" stopColor="#000000" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.95" />
                <stop offset="35%" stopColor="#ffffff" stopOpacity="0.12" />
                <stop offset="70%" stopColor={primaryColor} stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
              </>
            )}
          </linearGradient>

          {/* Secondary Gradient (Quần lụa) */}
          <linearGradient id="secondaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {isFlat ? (
              <>
                <stop offset="0%" stopColor={secondaryColor} />
                <stop offset="100%" stopColor={secondaryColor} />
              </>
            ) : isAnime ? (
              <>
                <stop offset="0%" stopColor={secondaryColor} />
                <stop offset="68%" stopColor={secondaryColor} />
                <stop offset="69%" stopColor="#000000" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.92" />
                <stop offset="50%" stopColor={secondaryColor} stopOpacity="1" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
              </>
            )}
          </linearGradient>

          {/* Accent Gradient (Yếm / Thắt lưng / Cổ áo) */}
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            {isFlat ? (
              <>
                <stop offset="0%" stopColor={accentColor} />
                <stop offset="100%" stopColor={accentColor} />
              </>
            ) : isAnime ? (
              <>
                <stop offset="0%" stopColor={accentColor} />
                <stop offset="70%" stopColor={accentColor} />
                <stop offset="71%" stopColor="#000000" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
              </>
            )}
          </linearGradient>

          {/* Gradient Nếp Gấp Vải 3D (Fabric Folds Shadow) */}
          <linearGradient id="foldShadowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="45%" stopColor="rgba(0,0,0,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>

          {/* Gradient Ánh Lụa Óng Ả (Silk Luster Highlight) */}
          <linearGradient id="silkLusterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <radialGradient id="silverGleam" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#cbd5e0" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>

          {/* Bóng đổ tiếp xúc sàn */}
          <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* 3. HỌA TIẾT VẢI (PATTERNS) */}
          {/* Họa tiết Gấm thêu kim tuyến hoàng gia */}
          <pattern id="brocadePattern" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="5" fill="none" stroke="#DAA520" strokeWidth="0.8" opacity="0.5" />
            <path d="M14 6 C17 9, 21 9, 22 14 C21 19, 17 19, 14 22 C11 19, 7 19, 6 14 C7 9, 11 9, 14 6 Z" fill="none" stroke="#DAA520" strokeWidth="0.7" opacity="0.6" />
            <circle cx="14" cy="14" r="1.5" fill="#DAA520" opacity="0.75" />
          </pattern>

          {/* Họa tiết Dệt kim tơ tằm (Micro Silk Weave) */}
          <pattern id="silkWeavePattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="6" y2="6" stroke="#ffffff" strokeWidth="0.5" opacity="0.12" />
            <line x1="6" y1="0" x2="0" y2="6" stroke="#000000" strokeWidth="0.4" opacity="0.1" />
          </pattern>

          {/* Họa tiết Khăn Rằn Nam Bộ (Gingham Check) */}
          <pattern id="scarfPattern" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="#ffffff" />
            <rect x="4" width="4" height="4" fill="#2d3748" />
            <rect y="4" width="4" height="4" fill="#2d3748" />
            <rect x="4" y="4" width="4" height="4" fill="#ffffff" />
          </pattern>
        </defs>

        {/* 1. Bóng đổ tiếp xúc sàn */}
        <ellipse cx="170" cy="515" rx="72" ry="13" fill="url(#floorShadow)" />

        {/* 2. Đôi chân & Guốc mộc truyền thống (Vẽ bằng Cubic Bézier) */}
        <g id="feet-and-shoes">
          {/* Chân trái */}
          <path d="M146 460 C146 470, 147 485, 148 495 L158 495 C159 485, 158 470, 158 460 Z" fill="#fbd38d" stroke={isAnime ? "#2d1810" : "none"} strokeWidth={isAnime ? "1.5" : "0"} />
          <path d="M142 494 C148 491, 155 491, 161 494 L161 508 C153 512, 147 511, 142 508 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          {/* Quai guốc trái */}
          <path d="M143 496 C151 492, 154 492, 160 496" stroke="#dc2626" strokeWidth="2.5" fill="none" />

          {/* Chân phải */}
          <path d="M182 460 C182 470, 183 485, 184 495 L194 495 C195 485, 194 470, 194 460 Z" fill="#fbd38d" stroke={isAnime ? "#2d1810" : "none"} strokeWidth={isAnime ? "1.5" : "0"} />
          <path d="M179 494 C185 491, 192 491, 198 494 L198 508 C190 512, 184 511, 179 508 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />
          {/* Quai guốc phải */}
          <path d="M180 496 C188 492, 191 492, 197 496" stroke="#dc2626" strokeWidth="2.5" fill="none" />
        </g>

        {/* 3. LỚP QUẦN LỤA ỐNG RỘNG (Secondary Color) - Đường cong Cubic Bézier rủ tự nhiên */}
        <g 
          id="pants-layer"
          className="interactive-part"
          filter={fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'}
          onMouseEnter={() => setHoveredPart('Quần lụa ống rộng (Secondary Color)')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Ống quần trái */}
          <path 
            d="M138 270 C132 330, 120 400, 116 480 C136 486, 152 485, 164 480 C166 400, 168 330, 170 295 Z" 
            fill="url(#secondaryGrad)" 
            stroke={isAnime ? "#1a1008" : "rgba(0,0,0,0.15)"} 
            strokeWidth={isAnime ? "1.8" : "1"}
          />
          {/* Ống quần phải */}
          <path 
            d="M202 270 C208 330, 220 400, 224 480 C204 486, 188 485, 176 480 C174 400, 172 330, 170 295 Z" 
            fill="url(#secondaryGrad)" 
            stroke={isAnime ? "#1a1008" : "rgba(0,0,0,0.15)"} 
            strokeWidth={isAnime ? "1.8" : "1"}
          />

          {/* Lớp hoa văn vải nếu chọn Gấm */}
          {fabricTexture === 'brocade' && (
            <>
              <path d="M138 270 C132 330, 120 400, 116 480 C136 486, 152 485, 164 480 C166 400, 168 330, 170 295 Z" fill="url(#brocadePattern)" />
              <path d="M202 270 C208 330, 220 400, 224 480 C204 486, 188 485, 176 480 C174 400, 172 330, 170 295 Z" fill="url(#brocadePattern)" />
            </>
          )}

          {/* Nếp gấp vải lụa (Folds & Highlights) */}
          {!isFlat && (
            <>
              {/* Bóng nếp gấp trái */}
              <path d="M136 320 C130 380, 126 430, 128 476" stroke="rgba(0,0,0,0.25)" strokeWidth={isAnime ? "2.2" : "1.5"} fill="none" />
              {/* Vệt sáng lụa trái */}
              <path d="M142 315 C138 375, 134 425, 136 475" stroke="url(#silkLusterGrad)" strokeWidth="3" fill="none" opacity="0.6" />
              {/* Bóng nếp gấp phải */}
              <path d="M204 320 C210 380, 214 430, 212 476" stroke="rgba(0,0,0,0.25)" strokeWidth={isAnime ? "2.2" : "1.5"} fill="none" />
              {/* Vệt sáng lụa phải */}
              <path d="M198 315 C202 375, 206 425, 204 475" stroke="url(#silkLusterGrad)" strokeWidth="3" fill="none" opacity="0.6" />
            </>
          )}
        </g>

        {/* 4. CƠ THỂ MA-NƠ-CANH & CÁNH TAY NỀN (Cubic Bézier) */}
        <g id="body-base">
          {/* Cổ cao thanh mảnh */}
          <path d="M162 90 C162 100, 163 110, 162 118 L178 118 C177 110, 178 100, 178 90 Z" fill="#fbd38d" stroke={isAnime ? "#2d1810" : "none"} strokeWidth={isAnime ? "1.5" : "0"} />
          {/* Cánh tay trái uốn cong nhẹ tự nhiên */}
          <path d="M125 125 C112 170, 96 215, 92 250 C98 256, 106 254, 108 250 C114 215, 128 175, 134 140 Z" fill="#fbd38d" />
          <ellipse cx="92" cy="256" rx="5.5" ry="7.5" fill="#fbd38d" />
          {/* Cánh tay phải */}
          <path d="M215 125 C228 170, 244 215, 248 250 C242 256, 234 254, 232 250 C226 215, 212 175, 206 140 Z" fill="#fbd38d" />
          <ellipse cx="248" cy="256" rx="5.5" ry="7.5" fill="#fbd38d" />
        </g>

        {/* 5. CẤU TRÚC CHI TIẾT 7 LOẠI CỔ PHỤC VIỆT NAM (Cubic Bézier & Folds) */}

        {/* === A. ÁO TỨ THÂN KINH BẮC === */}
        {outfitId === 'ao_tu_than' && (
          <g id="costume-tu-than" filter={fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'}>
            {/* Yếm cổ đào (Accent Color) - Bo tròn cổ yếm hình quả trám */}
            <path 
              d="M150 114 C162 124, 178 124, 190 114 L198 215 C180 220, 160 220, 142 215 Z" 
              fill="url(#accentGrad)" 
              stroke={isAnime ? "#2d1810" : "rgba(0,0,0,0.2)"} 
              strokeWidth={isAnime ? "2" : "1"}
            />
            {/* Dây yếm vòng qua cổ */}
            <path d="M152 114 C162 104, 178 104, 188 114" stroke={accentColor} strokeWidth="2.5" fill="none" />

            {/* Áo khoác ngoài 4 vạt (Primary Color) */}
            {/* Vạt sau và sườn áo buông dài */}
            <path 
              d="M120 120 C140 122, 150 122, 148 210 C144 270, 118 360, 108 420 C102 415, 104 400, 114 340 C118 270, 122 170, 120 120 Z" 
              fill="url(#primaryGrad)" 
            />
            <path 
              d="M220 120 C200 122, 190 122, 192 210 C196 270, 222 360, 232 420 C238 415, 236 400, 226 340 C222 270, 218 170, 220 120 Z" 
              fill="url(#primaryGrad)" 
            />

            {/* Hai vạt trước thắt nút nơ duyên dáng tại eo bụng */}
            <path d="M148 220 C154 250, 162 265, 156 315 C166 318, 168 280, 164 255 Z" fill="url(#primaryGrad)" />
            <path d="M192 220 C186 250, 178 265, 184 315 C174 318, 172 280, 176 255 Z" fill="url(#primaryGrad)" />
            {/* Nút thắt nơ lụa mềm mại */}
            <ellipse cx="170" cy="254" rx="9" ry="7" fill={accentColor} stroke="#DAA520" strokeWidth="1" />

            {/* Thắt lưng bao xẹo xanh/vàng buông tà */}
            <path d="M140 246 C155 250, 185 250, 200 246 L198 262 C185 266, 155 266, 142 262 Z" fill="url(#accentGrad)" />
            <path d="M165 262 C162 310, 160 350, 162 385 C170 385, 172 350, 174 262 Z" fill="url(#accentGrad)" opacity="0.95" />

            {/* Ống tay áo buông nhẹ */}
            <path d="M122 120 C108 170, 92 215, 86 244 C96 250, 106 248, 110 242 C118 210, 130 165, 136 140 Z" fill="url(#primaryGrad)" />
            <path d="M218 120 C232 170, 248 215, 254 244 C244 250, 234 248, 230 242 C222 210, 210 165, 204 140 Z" fill="url(#primaryGrad)" />
          </g>
        )}

        {/* === B. ÁO NHẬT BÌNH TRIỀU NGUYỄN === */}
        {outfitId === 'ao_nhat_binh' && (
          <g id="costume-nhat-binh" filter={fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'}>
            {/* Thân áo khoác rộng vương giả (Primary Color) */}
            <path 
              d="M112 124 C140 126, 200 126, 228 124 C236 220, 244 340, 242 455 C200 465, 140 465, 98 455 C96 340, 104 220, 112 124 Z" 
              fill="url(#primaryGrad)" 
              stroke={isAnime ? "#2d1810" : "rgba(0,0,0,0.18)"} 
              strokeWidth={isAnime ? "2.2" : "1"}
            />

            {/* Họa tiết gấm chìm */}
            {fabricTexture === 'brocade' && (
              <path d="M112 124 C140 126, 200 126, 228 124 C236 220, 244 340, 242 455 C200 465, 140 465, 98 455 C96 340, 104 220, 112 124 Z" fill="url(#brocadePattern)" />
            )}

            {/* Bản viền cổ Nhật Bình hình chữ nhật ngũ sắc trước ngực (Accent Color) */}
            <rect 
              x="150" 
              y="112" 
              width="40" 
              height="155" 
              rx="3"
              fill="url(#accentGrad)" 
              stroke="#DAA520" 
              strokeWidth="2.5" 
            />
            {/* Hoa văn rồng mây kim tuyến trên dải cổ */}
            <line x1="170" y1="112" x2="170" y2="267" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="170" cy="140" r="4" fill="#DAA520" stroke="#fff" strokeWidth="0.8" />
            <circle cx="170" cy="172" r="4" fill="#DAA520" stroke="#fff" strokeWidth="0.8" />
            <circle cx="170" cy="204" r="4" fill="#DAA520" stroke="#fff" strokeWidth="0.8" />
            <circle cx="170" cy="236" r="4" fill="#DAA520" stroke="#fff" strokeWidth="0.8" />

            {/* Dải ngũ sắc viền tay áo (Ngũ hành: Lục, Vàng, Xanh, Trắng, Đỏ) */}
            <g id="sleeve-left">
              <path d="M118 125 C92 180, 70 230, 62 250 C74 256, 88 255, 96 248 C104 220, 126 170, 136 142 Z" fill="url(#primaryGrad)" />
              <rect x="62" y="244" width="26" height="3" fill="#e53e3e" transform="rotate(22 62 244)" />
              <rect x="64" y="248" width="26" height="3" fill="#ecc94b" transform="rotate(22 64 248)" />
              <rect x="66" y="252" width="26" height="3" fill="#3182ce" transform="rotate(22 66 252)" />
            </g>
            <g id="sleeve-right">
              <path d="M222 125 C248 180, 270 230, 278 250 C266 256, 252 255, 244 248 C236 220, 214 170, 204 142 Z" fill="url(#primaryGrad)" />
              <rect x="254" y="254" width="26" height="3" fill="#e53e3e" transform="rotate(-22 254 254)" />
              <rect x="252" y="250" width="26" height="3" fill="#ecc94b" transform="rotate(-22 252 250)" />
              <rect x="250" y="246" width="26" height="3" fill="#3182ce" transform="rotate(-22 250 246)" />
            </g>

            {/* Nếp gấp tà áo Nhật Bình */}
            {!isFlat && (
              <>
                <path d="M145 280 C140 340, 135 400, 132 452" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" fill="none" />
                <path d="M195 280 C200 340, 205 400, 208 452" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" fill="none" />
                <path d="M148 275 C144 335, 140 395, 138 450" stroke="url(#silkLusterGrad)" strokeWidth="3" fill="none" opacity="0.5" />
              </>
            )}
          </g>
        )}

        {/* === C. ÁO NGŨ THÂN / ÁO TẤC === */}
        {outfitId === 'ao_ngu_than_ao_tac' && (
          <g id="costume-ngu-than" filter={fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'}>
            {/* Phom áo thụ y tay rộng dài trang nghiêm (Primary Color) */}
            <path 
              d="M116 122 C140 124, 200 124, 224 122 C232 230, 236 340, 234 460 C194 468, 146 468, 106 460 C104 340, 108 230, 116 122 Z" 
              fill="url(#primaryGrad)" 
              stroke={isAnime ? "#2d1810" : "rgba(0,0,0,0.18)"} 
              strokeWidth={isAnime ? "2.2" : "1"}
            />

            {/* Nẹp cài 5 cúc bên phải tượng trưng Ngũ Thường */}
            <path 
              d="M170 115 C186 120, 196 130, 198 150 L198 250" 
              stroke={accentColor} 
              strokeWidth="2.5" 
              fill="none" 
            />
            {[115, 132, 160, 190, 220].map((cy, i) => (
              <circle key={i} cx={cy === 115 ? 170 : 198} cy={cy} r="3" fill="#DAA520" stroke="#fff" strokeWidth="0.6" />
            ))}

            {/* Tay thụ y rộng buông rủ dài uy nghi */}
            <path d="M116 122 C84 180, 60 250, 56 275 C70 282, 88 280, 96 270 C108 230, 126 170, 134 145 Z" fill="url(#primaryGrad)" />
            <path d="M224 122 C256 180, 280 250, 284 275 C270 282, 252 280, 244 270 C232 230, 214 170, 206 145 Z" fill="url(#primaryGrad)" />

            {/* Cổ đứng lập lĩnh */}
            <path d="M158 106 C165 104, 175 104, 182 106 L182 118 L158 118 Z" fill="url(#secondaryGrad)" stroke="#DAA520" strokeWidth="1.2" />
          </g>
        )}

        {/* === D. ÁO BÀ BA NAM BỘ === */}
        {outfitId === 'ao_ba_ba_nam_bo' && (
          <g id="costume-ba-ba" filter={fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'}>
            {/* Thân áo ngắn chớm hông có xẻ tà 2 bên và vạt đáy lượn cong */}
            <path 
              d="M124 122 C144 124, 196 124, 216 122 C222 180, 225 250, 224 316 C194 328, 146 328, 116 316 C115 250, 118 180, 124 122 Z" 
              fill="url(#primaryGrad)" 
              stroke={isAnime ? "#2d1810" : "rgba(0,0,0,0.15)"} 
              strokeWidth={isAnime ? "2" : "1"}
            />
            {/* Đường nẹp xẻ cúc giữa thân */}
            <line x1="170" y1="124" x2="170" y2="322" stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" />
            {[142, 170, 198, 226, 254, 282, 310].map(cy => (
              <circle key={cy} cx="170" cy={cy} r="2.5" fill="#DAA520" />
            ))}

            {/* Hai túi áo vuông vắn đáy cong */}
            <path d="M132 268 C132 268, 154 268, 154 268 C154 290, 150 294, 143 294 C136 294, 132 290, 132 268 Z" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" />
            <path d="M186 268 C186 268, 208 268, 208 268 C208 290, 204 294, 197 294 C190 294, 186 290, 186 268 Z" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" />

            {/* Cổ tròn xẻ giọt nước */}
            <path d="M162 110 C162 124, 178 124, 178 110 Z" fill="#fbd38d" stroke={isAnime ? "#2d1810" : "none"} strokeWidth="1" />

            {/* Tay áo dài ôm gọn */}
            <path d="M124 124 C108 170, 96 215, 94 250 C102 255, 112 254, 116 250 C122 215, 132 175, 138 142 Z" fill="url(#primaryGrad)" />
            <path d="M216 124 C232 170, 244 215, 246 250 C238 255, 228 254, 224 250 C218 215, 208 175, 202 142 Z" fill="url(#primaryGrad)" />
          </g>
        )}

        {/* === E. ÁO GIAO LĨNH === */}
        {outfitId === 'ao_giao_linh' && (
          <g id="costume-giao-linh" filter={fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'}>
            {/* Thân áo giao lĩnh dài buông rộng (Primary Color) */}
            <path 
              d="M116 120 C140 122, 200 122, 224 120 C232 230, 234 340, 230 465 C190 472, 150 472, 110 465 C106 340, 108 230, 116 120 Z" 
              fill="url(#primaryGrad)" 
              stroke={isAnime ? "#2d1810" : "rgba(0,0,0,0.18)"} 
              strokeWidth={isAnime ? "2.2" : "1"}
            />
            {/* Cổ áo giao vạt chéo sang phải */}
            <polygon points="150,108 190,108 212,235 165,235" fill="url(#secondaryGrad)" opacity="0.85" />
            <path d="M150 108 C170 150, 195 190, 212 235" stroke="#DAA520" strokeWidth="2.8" />
            <path d="M190 108 C180 140, 172 165, 165 195" stroke="#DAA520" strokeWidth="2.8" />

            {/* Dải thắt lưng buộc hông (Accent Color) */}
            <rect x="136" y="228" width="68" height="14" rx="2" fill="url(#accentGrad)" />
            <path d="M190 240 C194 290, 198 340, 196 380 C188 380, 184 340, 182 240 Z" fill="url(#accentGrad)" />

            {/* Ống tay rộng thướt tha */}
            <path d="M116 120 C88 175, 68 235, 64 260 C78 266, 96 264, 102 256 C112 220, 126 170, 134 142 Z" fill="url(#primaryGrad)" />
            <path d="M224 120 C252 175, 272 235, 276 260 C262 266, 244 264, 238 256 C228 220, 214 170, 206 142 Z" fill="url(#primaryGrad)" />
          </g>
        )}

        {/* === F. ÁO DÀI HUẾ & ÁO DÀI CÁCH TÂN (Cubic Bézier đường cong tà áo tuyệt mỹ) === */}
        {(outfitId === 'ao_dai_hue' || outfitId === 'ao_dai_cach_tan') && (
          <g id="costume-ao-dai" filter={fabricTexture === 'linen' ? 'url(#organicFabricTexture)' : 'none'}>
            {/* Tà áo dài thướt tha xẻ eo uốn lượn mềm mại */}
            <path 
              d="M134 122 C132 160, 136 200, 138 242 C140 280, 122 360, 120 472 C158 480, 182 480, 220 472 C218 360, 200 280, 202 242 C204 200, 208 160, 206 122 Z" 
              fill="url(#primaryGrad)" 
              stroke={isAnime ? "#2d1810" : "rgba(0,0,0,0.15)"} 
              strokeWidth={isAnime ? "2.2" : "1"}
            />

            {/* Họa tiết gấm hoa chìm */}
            {fabricTexture === 'brocade' && (
              <path d="M134 122 C132 160, 136 200, 138 242 C140 280, 122 360, 120 472 C158 480, 182 480, 220 472 C218 360, 200 280, 202 242 C204 200, 208 160, 206 122 Z" fill="url(#brocadePattern)" />
            )}

            {/* Nếp xẻ tà bên hông với Cubic Bézier */}
            <path d="M138 242 C134 310, 122 400, 120 472" stroke="rgba(0,0,0,0.28)" strokeWidth="1.8" fill="none" />
            <path d="M202 242 C206 310, 218 400, 220 472" stroke="rgba(0,0,0,0.28)" strokeWidth="1.8" fill="none" />

            {/* Nếp gấp 3D và vệt sáng óng ả dọc tà áo */}
            {!isFlat && (
              <>
                <path d="M148 260 C144 330, 138 410, 136 470" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" fill="none" />
                <path d="M152 255 C148 325, 142 405, 140 468" stroke="url(#silkLusterGrad)" strokeWidth="3.5" fill="none" opacity="0.6" />
                <path d="M192 260 C196 330, 202 410, 204 470" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" fill="none" />
                <path d="M188 255 C192 325, 198 405, 200 468" stroke="url(#silkLusterGrad)" strokeWidth="3.5" fill="none" opacity="0.6" />
              </>
            )}

            {/* Hàng khuy bấm bên ngực phải */}
            <path d="M170 114 C188 122, 198 135, 198 160 L198 242" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            {[120, 134, 155, 180, 210].map(cy => (
              <circle key={cy} cx={cy === 120 ? 178 : (cy === 134 ? 188 : 198)} cy={cy} r="2.2" fill="#DAA520" />
            ))}

            {/* Cổ áo (Cổ trụ cao 3cm hoặc cổ thuyền) */}
            {outfitId === 'ao_dai_hue' ? (
              <path d="M158 102 C165 100, 175 100, 182 102 L182 116 L158 116 Z" fill="url(#secondaryGrad)" stroke="#DAA520" strokeWidth="1" />
            ) : (
              <path d="M150 108 C170 124, 190 108, 190 108" stroke={accentColor} strokeWidth="2.5" fill="none" />
            )}

            {/* Tay áo dài thanh thoát */}
            <path d="M134 124 C116 170, 102 215, 96 250 C104 255, 114 254, 118 250 C126 215, 138 175, 144 142 Z" fill="url(#primaryGrad)" />
            <path d="M206 124 C224 170, 238 215, 244 250 C236 255, 226 254, 222 250 C214 215, 202 175, 196 142 Z" fill="url(#primaryGrad)" />
          </g>
        )}

        {/* 6. KHUÔN MẶT & ĐẦU (Tùy biến theo phong cách Anime hoặc Vector) */}
        <g id="head-portrait">
          {/* Đầu & khuôn mặt */}
          <ellipse cx="170" cy="68" rx="19" ry="25" fill="#fbd38d" stroke={isAnime ? "#2d1810" : "none"} strokeWidth={isAnime ? "1.8" : "0"} />
          {/* Mái tóc thanh lịch */}
          <path d="M150 64 C152 38, 188 38, 190 64 C188 48, 170 48, 150 64 Z" fill="#1a202c" />
          <ellipse cx="170" cy="42" rx="15" ry="11" fill="#1a202c" />

          {/* Mắt & Biểu cảm phong cách Anime */}
          {isAnime ? (
            <g id="anime-face-details">
              {/* Mắt to anime có ánh sao */}
              <ellipse cx="163" cy="67" rx="3.5" ry="4.5" fill="#1a202c" />
              <ellipse cx="177" cy="67" rx="3.5" ry="4.5" fill="#1a202c" />
              <circle cx="162" cy="65" r="1.5" fill="#ffffff" />
              <circle cx="176" cy="65" r="1.5" fill="#ffffff" />
              {/* Lông mày mảnh */}
              <path d="M159 60 C162 58, 166 59, 168 61" stroke="#2d1810" strokeWidth="1.2" fill="none" />
              <path d="M181 60 C178 58, 174 59, 172 61" stroke="#2d1810" strokeWidth="1.2" fill="none" />
              {/* Má hồng e ấp */}
              <ellipse cx="159" cy="72" rx="3" ry="1.5" fill="#ff6b81" opacity="0.5" />
              <ellipse cx="181" cy="72" rx="3" ry="1.5" fill="#ff6b81" opacity="0.5" />
              {/* Nụ cười duyên */}
              <path d="M168 76 C170 78, 172 78, 174 76" stroke="#e11d48" strokeWidth="1.5" fill="none" />
            </g>
          ) : (
            <g id="vector-face-details">
              <ellipse cx="164" cy="66" rx="2.5" ry="1.5" fill="#2d3748" />
              <ellipse cx="176" cy="66" rx="2.5" ry="1.5" fill="#2d3748" />
              <path d="M168 76 C170 79, 172 79, 174 76" stroke="#e53e3e" strokeWidth="1.5" fill="none" />
            </g>
          )}
        </g>

        {/* 7. PHỤ KIỆN TRUYỀN THỐNG ĐỘNG (Render linh hoạt) */}
        {/* A. Kiềng bạc hoa sen */}
        {(hasAccessory('kieng_bac') || hasAccessory('vong_co')) && (
          <g id="acc-kieng-bac" className="acc-layer">
            <ellipse 
              cx="170" 
              cy="114" 
              rx="18" 
              ry="10" 
              fill="none" 
              stroke="url(#silverGleam)" 
              strokeWidth={isAnime ? "4.5" : "3.8"} 
            />
            <ellipse cx="170" cy="123" rx="3.5" ry="3.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5" />
          </g>
        )}

        {/* B. Khăn rằn Nam Bộ */}
        {hasAccessory('khan_ran') && (
          <g id="acc-khan-ran" className="acc-layer">
            <path 
              d="M156 112 C164 128, 176 128, 184 112 L192 230 L178 232 L170 135 L162 232 L148 230 Z" 
              fill="url(#scarfPattern)" 
              stroke="#2d3748" 
              strokeWidth="1.2" 
            />
          </g>
        )}

        {/* C. Nón lá Việt Nam */}
        {hasAccessory('non_la') && (
          <g id="acc-non-la" className="acc-layer" transform="translate(170, 48)">
            <polygon points="0,-38 -48,8 48,8" fill="#fef08a" stroke="#ca8a04" strokeWidth={isAnime ? "2.2" : "1.5"} />
            <line x1="0" y1="-38" x2="-24" y2="8" stroke="#eab308" strokeWidth="0.8" />
            <line x1="0" y1="-38" x2="24" y2="8" stroke="#eab308" strokeWidth="0.8" />
            <line x1="-38" y1="-6" x2="38" y2="-6" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3 2" />
            <path d="M-30 8 C0 26, 0 26, 30 8" stroke={accentColor} strokeWidth="2.5" fill="none" />
          </g>
        )}

        {/* D. Nón quai thao Quan họ Bắc Ninh */}
        {hasAccessory('non_quai_thao') && (
          <g id="acc-non-quai-thao" className="acc-layer" transform="translate(170, 36)">
            <ellipse cx="0" cy="0" rx="58" ry="15" fill="#fef9c3" stroke="#a16207" strokeWidth={isAnime ? "2.5" : "2"} />
            <ellipse cx="0" cy="-2" rx="44" ry="11" fill="#fef08a" />
            {/* Dải quai thao tết lụa dài buông xuống */}
            <path d="M-38 6 C-34 80, -42 140, -40 185" stroke={accentColor} strokeWidth="3.2" fill="none" />
            <path d="M38 6 C34 80, 42 140, 40 185" stroke={accentColor} strokeWidth="3.2" fill="none" />
            <ellipse cx="-40" cy="188" rx="4" ry="8" fill={accentColor} />
            <ellipse cx="40" cy="188" rx="4" ry="8" fill={accentColor} />
          </g>
        )}

        {/* E. Khăn vành ngũ sắc hoàng gia */}
        {(hasAccessory('khan_vanh') || hasAccessory('khan_dong')) && (
          <g id="acc-khan-vanh" className="acc-layer" transform="translate(170, 48)">
            <ellipse cx="0" cy="0" rx="28" ry="13" fill={accentColor} stroke="#DAA520" strokeWidth="2" />
            <ellipse cx="0" cy="-4" rx="25" ry="11" fill={primaryColor} />
            <ellipse cx="0" cy="-8" rx="23" ry="9" fill={accentColor} />
            <ellipse cx="0" cy="-12" rx="21" ry="8" fill={secondaryColor} />
          </g>
        )}

        {/* F. Quạt xếp lụa cầm tay */}
        {hasAccessory('quat_xep') && (
          <g id="acc-quat-xep" className="acc-layer" transform="translate(254, 252) rotate(-15)">
            <path 
              d="M0 0 L-24 -38 A44 44 0 0 1 24 -38 Z" 
              fill="url(#accentGrad)" 
              stroke="#DAA520" 
              strokeWidth="1.8" 
            />
            <line x1="0" y1="0" x2="-16" y2="-36" stroke="#DAA520" strokeWidth="1" />
            <line x1="0" y1="0" x2="0" y2="-39" stroke="#DAA520" strokeWidth="1" />
            <line x1="0" y1="0" x2="16" y2="-36" stroke="#DAA520" strokeWidth="1" />
            <path d="M0 0 C-2 15, -4 20, -2 28" stroke="#e11d48" strokeWidth="2.2" fill="none" />
          </g>
        )}

        {/* Hạt sao lấp lánh (Sparkles) nếu ở phong cách Anime */}
        {isAnime && (
          <g id="anime-sparkles" className="animate-pulse">
            <path d="M70 160 L73 166 L79 169 L73 172 L70 178 L67 172 L61 169 L67 166 Z" fill="#ffd700" />
            <path d="M265 190 L267 194 L272 196 L267 198 L265 203 L263 198 L258 196 L263 194 Z" fill="#ffd700" />
            <path d="M215 90 L217 94 L221 95 L217 97 L215 101 L213 97 L209 95 L213 94 Z" fill="#ffffff" />
          </g>
        )}
      </svg>
    );
  };

  if (variant === 'stage') {
    return (
      <div className="stage-outfit-container">
        {renderMannequinSvg()}
        {hoveredPart && (
          <div className="hover-part-badge animate-fade-in">
            {hoveredPart}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="outfit-preview-card glass-panel animate-fade-in-up">
      {/* Header Preview & Switch Tabs */}
      <div className="preview-top-bar" style={{ display: 'none' }}>
        <div className="preview-heading">
          <span className="live-pulse-dot" />
          <h4>Minh họa Vector & CSS</h4>
        </div>

        <div className="preview-view-tabs">
          <button 
            className={`view-tab-btn ${activeTab === 'mannequin' ? 'view-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('mannequin')}
          >
            👗 Phối màu tương tác
          </button>
          <button 
            className={`view-tab-btn ${activeTab === 'heritage' ? 'view-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('heritage')}
          >
            🖼️ Mẫu di sản
          </button>
        </div>
      </div>

      {/* Đã gỡ bỏ thanh công cụ chọn Phong cách & Chất liệu */}

      {/* Sân khấu Minh họa Trực quan (Stage) */}
      <div className="preview-visual-stage">
        {activeTab === 'mannequin' ? (
          <div className="mannequin-container">
            {renderMannequinSvg()}

            {/* Hover Tooltip nếu di chuột vào chi tiết */}
            {hoveredPart && (
              <div className="hover-part-badge animate-fade-in">
                {hoveredPart}
              </div>
            )}

            {/* Ghi chú tính năng */}
            <div className="mannequin-legend">
              <span className="legend-tag">
                <span className="color-pip" style={{ background: primaryColor }} />
                Tà áo chính
              </span>
              <span className="legend-tag">
                <span className="color-pip" style={{ background: secondaryColor }} />
                Quần lụa
              </span>
              <span className="legend-tag">
                <span className="color-pip" style={{ background: accentColor }} />
                Điểm nhấn/Viền
              </span>
            </div>
          </div>
        ) : (
          <div className="heritage-container">
            {!imageLoaded && (
              <div className="skeleton-loader-img">
                <div className="spinner-gold" />
              </div>
            )}
            <img 
              src={selectedOutfit.hinh_anh} 
              alt={selectedOutfit.ten} 
              className={`heritage-reference-img ${imageLoaded ? 'loaded' : 'loading'}`}
              onLoad={() => setImageLoaded(true)}
              style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            />
            <div className="heritage-caption">
              <strong>{selectedOutfit.ten}</strong>
              <p>{selectedOutfit.mo_ta}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Spec Card: Thông tin tóm tắt & Điểm hài hòa */}
      <div className="preview-spec-card">
        <div className="spec-row-header">
          <div>
            <h5 className="spec-outfit-name">{selectedOutfit.ten}</h5>
            <span className="spec-period">{selectedOutfit.thoi_ky} • {selectedOutfit.vung_mien || 'Việt Nam'}</span>
          </div>
          <div className="harmony-mini-badge" title="Điểm chuẩn mực phối màu truyền thống">
            <span>Hài hòa</span>
            <strong>{harmonyScore}%</strong>
          </div>
        </div>

        <div className="spec-details-grid" style={{ display: 'none' }}></div>

        {/* Phụ kiện đang đeo */}
        <div className="spec-active-accessories">
          <span className="acc-title">Phụ kiện kết hợp ({selectedAccessories.length}):</span>
          <div className="acc-pills-wrap">
            {selectedAccessories.length > 0 ? (
              selectedAccessories.map((acc, idx) => {
                const name = typeof acc === 'string' ? acc : acc.name;
                const icon = typeof acc === 'string' ? '✨' : (acc.icon || '✨');
                return (
                  <span key={idx} className="acc-pill">
                    {icon} {name}
                  </span>
                );
              })
            ) : (
              <span className="acc-empty-text">Chưa chọn phụ kiện nào</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
