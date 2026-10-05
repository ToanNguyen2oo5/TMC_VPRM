import { useState, useMemo } from 'react';
import { getAllOutfits } from '../services/cultureData';
import { REGION_PATHS } from '../data/vietnamMapPaths';
import './VietnamMap.css';

const REGION_INFO = {
  bac: {
    id: 'bac',
    nameVi: 'Bắc Bộ',
    nameEn: 'Northern Vietnam',
    titleVi: 'Cái nôi văn hiến nghìn năm Thăng Long & Kinh Bắc',
    descVi: 'Vùng đất cội nguồn của trang phục truyền thống Việt với nét tao nhã, chuẩn mực, gắn liền với lễ nghi cung đình và hội hè dân gian đồng bằng sông Hồng.',
    featuresVi: [
      'Áo tứ thân duyên dáng liền chị Quan họ',
      'Áo the khăn xếp nho nhã của đấng nam nhi',
      'Áo giao lĩnh uy nghi từ thời Lý - Trần - Lê',
      'Nón quai thao & dải yếm đào thắm sắc'
    ],
    color: '#3B82F6',
    hoverGlow: 'rgba(59, 130, 246, 0.4)'
  },
  trung: {
    id: 'trung',
    nameVi: 'Trung Bộ',
    nameEn: 'Central Vietnam',
    titleVi: 'Vàng son Cung đình Huế & Di sản Triều Nguyễn',
    descVi: 'Nơi đỉnh cao của mỹ thuật y quan Đại Nam thế kỷ 19 - đầu thế kỷ 20, chuẩn hóa quy chế phẩm phục hoàng tộc và tầng lớp quý tộc nho nhã.',
    featuresVi: [
      'Áo Nhật Bình ngũ hành hoàng gia quyền quý',
      'Áo tấc / Áo ngũ thân định hình quốc phục thời Nguyễn',
      'Nón bài thơ xứ Huế thanh lịch',
      'Nghệ thuật thêu tay kim tuyến phượng vũ'
    ],
    color: '#EF4444',
    hoverGlow: 'rgba(239, 68, 68, 0.4)'
  },
  nam: {
    id: 'nam',
    nameVi: 'Nam Bộ',
    nameEn: 'Southern Vietnam',
    titleVi: 'Phù sa châu thổ & Nét hào sảng phóng khoáng',
    descVi: 'Văn hóa trang phục phương Nam mang tinh thần cởi mở, mộc mạc và gắn bó mật thiết với dòng sông, miệt vườn trù phú của vùng đồng bằng sông Cửu Long.',
    featuresVi: [
      'Áo bà ba xẻ tà năng động mộc mạc',
      'Khăn rằn thủy chung che nắng gió sông nước',
      'Nón lá chóp nhọn bình dị thanh tao',
      'Lụa tơ tằm mềm mát thích nghi khí hậu nhiệt đới'
    ],
    color: '#F59E0B',
    hoverGlow: 'rgba(245, 158, 11, 0.4)'
  }
};

export default function VietnamMap({ onSelectOutfitForMixer }) {
  const [activeRegion, setActiveRegion] = useState('trung');
  const allOutfits = useMemo(() => getAllOutfits(), []);

  // Filter outfits theo vùng
  const regionalOutfits = useMemo(() => {
    return allOutfits.filter(outfit => {
      const vm = (outfit.vung_mien || '').toLowerCase();
      if (activeRegion === 'bac') return vm.includes('bắc') || vm.includes('ba miền');
      if (activeRegion === 'trung') return vm.includes('trung') || vm.includes('ba miền');
      if (activeRegion === 'nam') return vm.includes('nam') || vm.includes('ba miền');
      return true;
    });
  }, [allOutfits, activeRegion]);

  const activeInfo = REGION_INFO[activeRegion];

  return (
    <section className="vietnam-map-section" id="vietnam-map-section">
      <div className="section-header text-center animate-fade-in-up">
        <span className="section-badge">Bản đồ di sản địa lý</span>
        <h2 className="section-title">
          Hành trình y phục qua <span className="text-gradient">ba miền đất nước</span>
        </h2>
      </div>

      <div className="vietnam-map-container glass-panel animate-fade-in-up">
        {/* Bản đồ SVG tương tác chuẩn xác tọa độ địa lý quốc gia */}
        <div className="map-svg-wrapper">
          <svg
            viewBox="250 60 620 900"
            className="vietnam-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradients cho từng vùng */}
              <linearGradient id="gradBac" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="gradTrung" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
              <linearGradient id="gradNam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Bộ lọc tạo viền ngoài chuẩn xác 99% cho Bắc Bộ (không hiện viền trong) */}
              <filter id="borderBacActive" x="-10%" y="-10%" width="120%" height="120%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilated" />
                <feComposite in="dilated" in2="SourceAlpha" operator="out" result="rim" />
                <feFlood floodColor="#93C5FD" result="rimColor" />
                <feComposite in="rimColor" in2="rim" operator="in" result="coloredRim" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#3B82F6" floodOpacity="0.8" />
                <feMerge>
                  <feMergeNode in="coloredRim" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Bộ lọc tạo viền ngoài chuẩn xác 99% cho Trung Bộ (không hiện viền trong) */}
              <filter id="borderTrungActive" x="-10%" y="-10%" width="120%" height="120%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilated" />
                <feComposite in="dilated" in2="SourceAlpha" operator="out" result="rim" />
                <feFlood floodColor="#FCA5A5" result="rimColor" />
                <feComposite in="rimColor" in2="rim" operator="in" result="coloredRim" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#EF4444" floodOpacity="0.8" />
                <feMerge>
                  <feMergeNode in="coloredRim" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Bộ lọc tạo viền ngoài chuẩn xác 99% cho Nam Bộ (không hiện viền trong) */}
              <filter id="borderNamActive" x="-10%" y="-10%" width="120%" height="120%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilated" />
                <feComposite in="dilated" in2="SourceAlpha" operator="out" result="rim" />
                <feFlood floodColor="#FDE68A" result="rimColor" />
                <feComposite in="rimColor" in2="rim" operator="in" result="coloredRim" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.8" />
                <feMerge>
                  <feMergeNode in="coloredRim" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Viền mảnh tinh tế khi không active */}
              <filter id="subtleBorder" x="-5%" y="-5%" width="110%" height="110%">
                <feMorphology in="SourceAlpha" operator="dilate" radius="0.8" result="dilated" />
                <feComposite in="dilated" in2="SourceAlpha" operator="out" result="rim" />
                <feFlood floodColor="rgba(255, 255, 255, 0.4)" result="rimColor" />
                <feComposite in="rimColor" in2="rim" operator="in" result="coloredRim" />
                <feMerge>
                  <feMergeNode in="coloredRim" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Chữ Biển Đông chìm thẩm mỹ */}
            <text x="660" y="340" className="map-watermark-text" transform="rotate(-18 660 340)">
              BIỂN ĐÔNG VIỆT NAM
            </text>

            {/* Đường kinh tuyến/vĩ tuyến hàng hải thẩm mỹ */}
            <g className="map-grid-lines">
              <line x1="280" y1="200" x2="840" y2="200" className="grid-line" />
              <line x1="280" y1="500" x2="840" y2="500" className="grid-line" />
              <line x1="280" y1="800" x2="840" y2="800" className="grid-line" />
              <line x1="450" y1="80" x2="450" y2="920" className="grid-line" />
              <line x1="650" y1="80" x2="650" y2="920" className="grid-line" />
              <line x1="780" y1="80" x2="780" y2="920" className="grid-line" />
              <text x="260" y="204" className="grid-coord">21°N</text>
              <text x="260" y="504" className="grid-coord">16°N</text>
              <text x="260" y="804" className="grid-coord">10°N</text>
              <text x="442" y="75" className="grid-coord">105°E</text>
              <text x="642" y="75" className="grid-coord">110°E</text>
              <text x="772" y="75" className="grid-coord">115°E</text>
            </g>

            {/* 1. VÙNG BẮC BỘ (Tọa độ thật từ Tây Bắc, Đông Bắc đến Vịnh Bắc Bộ) */}
            <g
              className={`map-region-group region-bac ${activeRegion === 'bac' ? 'is-active' : ''}`}
              onClick={() => setActiveRegion('bac')}
              filter={activeRegion === 'bac' ? 'url(#borderBacActive)' : 'url(#subtleBorder)'}
            >
              {REGION_PATHS.bac.map((d, idx) => (
                <path
                  key={`bac-${idx}`}
                  d={d}
                  className="map-geo-path map-geo-path--bac"
                />
              ))}
              {/* Điểm nhấn Thủ đô Hà Nội: tọa độ thật (491, 198) */}
              <g className="city-marker" transform="translate(491, 198)">
                <circle cx="0" cy="0" r="8" className="marker-pulse marker-pulse--capital" />
                <circle cx="0" cy="0" r="3.8" className="marker-dot marker-dot--capital" />
                <text x="12" y="4" className="city-label city-label--capital">Hà Nội (Thủ đô)</text>
              </g>
              <text x="360" y="180" className="region-title-tag">BẮC BỘ</text>
            </g>

            {/* 2. VÙNG TRUNG BỘ (Dải eo hẹp miền Trung, Cố đô Huế, duyên hải & Tây Nguyên) */}
            <g
              className={`map-region-group region-trung ${activeRegion === 'trung' ? 'is-active' : ''}`}
              onClick={() => setActiveRegion('trung')}
              filter={activeRegion === 'trung' ? 'url(#borderTrungActive)' : 'url(#subtleBorder)'}
            >
              {REGION_PATHS.trung.map((d, idx) => (
                <path
                  key={`trung-${idx}`}
                  d={d}
                  className="map-geo-path map-geo-path--trung"
                />
              ))}
              {/* Điểm nhấn Cố đô Huế: tọa độ thật (608, 483) */}
              <g className="city-marker" transform="translate(608, 483)">
                <circle cx="0" cy="0" r="6" className="marker-pulse" />
                <circle cx="0" cy="0" r="3.2" className="marker-dot" />
                <text x="10" y="4" className="city-label">Cố đô Huế</text>
              </g>
              {/* Điểm nhấn Đà Nẵng: tọa độ thật (635, 500) */}
              <g className="city-marker" transform="translate(635, 500)">
                <circle cx="0" cy="0" r="2.8" className="marker-dot" />
                <text x="8" y="3" className="city-label city-label--sub">Đà Nẵng</text>
              </g>
              <text x="640" y="620" className="region-title-tag">TRUNG BỘ</text>
            </g>

            {/* 3. VÙNG NAM BỘ (Đông Nam Bộ, TP.HCM & Đồng bằng sông Cửu Long, Cà Mau, Phú Quốc) */}
            <g
              className={`map-region-group region-nam ${activeRegion === 'nam' ? 'is-active' : ''}`}
              onClick={() => setActiveRegion('nam')}
              filter={activeRegion === 'nam' ? 'url(#borderNamActive)' : 'url(#subtleBorder)'}
            >
              {REGION_PATHS.nam.map((d, idx) => (
                <path
                  key={`nam-${idx}`}
                  d={d}
                  className="map-geo-path map-geo-path--nam"
                />
              ))}
              {/* Điểm nhấn TP. Hồ Chí Minh: tọa độ thật (553, 824) */}
              <g className="city-marker" transform="translate(553, 824)">
                <circle cx="0" cy="0" r="6" className="marker-pulse" />
                <circle cx="0" cy="0" r="3.5" className="marker-dot" />
                <text x="10" y="4" className="city-label">TP. Hồ Chí Minh</text>
              </g>
              {/* Điểm nhấn Đảo Phú Quốc (Kiên Giang) */}
              <g className="city-marker" transform="translate(398, 850)">
                <circle cx="0" cy="0" r="2.5" className="marker-dot" />
                <text x="-62" y="3" className="city-label city-label--sub">Đ. Phú Quốc</text>
              </g>
              <text x="440" y="875" className="region-title-tag">NAM BỘ</text>
            </g>

            {/* QUẦN ĐẢO HOÀNG SA (THUỘC TP. ĐÀ NẴNG) - Tách ra xa ngoài khơi Đông Bắc */}
            <g className="islands-territory" transform="translate(745, 415)">
              {/* Các đảo & rạn san hô Hoàng Sa */}
              <circle cx="0" cy="0" r="3" className="island-node" />
              <circle cx="8" cy="-5" r="2.5" className="island-node" />
              <circle cx="15" cy="4" r="3.2" className="island-node" />
              <circle cx="6" cy="10" r="2.8" className="island-node" />
              <circle cx="-6" cy="7" r="2" className="island-node" />
              <circle cx="20" cy="-2" r="2.2" className="island-node" />
              {/* Đường biên tượng trưng cụm đảo */}
              <ellipse cx="7" cy="3" rx="24" ry="16" className="island-perimeter" />
              <text x="-16" y="-12" className="island-label">Q.Đ HOÀNG SA</text>
              <text x="-10" y="27" className="island-sublabel">(Đà Nẵng)</text>
            </g>

            {/* QUẦN ĐẢO TRƯỜNG SA (THUỘC TỈNH KHÁNH HÒA) - Tách hẳn về phía Đông Nam, xa Hoàng Sa */}
            <g className="islands-territory" transform="translate(795, 790)">
              {/* Các đảo & rạn san hô Trường Sa */}
              <circle cx="0" cy="0" r="3" className="island-node" />
              <circle cx="14" cy="-12" r="2.8" className="island-node" />
              <circle cx="-10" cy="15" r="2.5" className="island-node" />
              <circle cx="10" cy="18" r="3.2" className="island-node" />
              <circle cx="22" cy="5" r="2.2" className="island-node" />
              <circle cx="-16" cy="-8" r="2.6" className="island-node" />
              <circle cx="5" cy="32" r="2.4" className="island-node" />
              {/* Đường biên tượng trưng cụm đảo */}
              <ellipse cx="6" cy="10" rx="32" ry="30" className="island-perimeter" />
              <text x="-24" y="-16" className="island-label">Q.Đ TRƯỜNG SA</text>
              <text x="-14" y="48" className="island-sublabel">(Khánh Hòa)</text>
            </g>

            {/* CÔN ĐẢO (BÀ RỊA - VŨNG TÀU) */}
            <g className="island-single" transform="translate(535, 925)">
              <circle cx="0" cy="0" r="2.5" className="island-node" />
              <text x="6" y="3" className="island-sublabel">Côn Đảo</text>
            </g>

            {/* La bàn cổ Việt Nam (Compass Rose) */}
            <g className="compass-rose" transform="translate(340, 730)">
              <circle cx="0" cy="0" r="24" fill="none" stroke="rgba(218, 165, 32, 0.35)" strokeWidth="1" strokeDasharray="3 3" />
              <polygon points="0,-22 4,-5 0,0 -4,-5" fill="#DAA520" />
              <polygon points="0,22 4,5 0,0 -4,5" fill="rgba(218, 165, 32, 0.4)" />
              <polygon points="-22,0 -5,-4 0,0 -5,4" fill="rgba(218, 165, 32, 0.4)" />
              <polygon points="22,0 5,-4 0,0 5,4" fill="rgba(218, 165, 32, 0.4)" />
              <text x="-4" y="-26" fill="#DAA520" fontSize="10" fontWeight="bold">B</text>
            </g>
          </svg>

          {/* Quick buttons */}
          <div className="map-region-buttons">
            {Object.keys(REGION_INFO).map((key) => (
              <button
                key={key}
                type="button"
                className={`region-btn ${activeRegion === key ? 'region-btn--active' : ''}`}
                onClick={() => setActiveRegion(key)}
              >
                {REGION_INFO[key].nameVi}
              </button>
            ))}
          </div>
        </div>

        {/* Panel thông tin văn hóa & trang phục */}
        <div className="map-details-panel">
          <div className="map-details-header">
            <span className="map-region-tag" style={{ color: activeInfo.color }}>
              {activeInfo.nameVi}
            </span>
            <h3 className="map-region-headline">{activeInfo.titleVi}</h3>
            <p className="map-region-summary">{activeInfo.descVi}</p>
          </div>

          <div className="map-features-box">
            <h4 className="features-title">Đặc trưng văn hóa y phục:</h4>
            <ul className="features-list">
              {activeInfo.featuresVi.map((item, idx) => (
                <li key={idx} className="feature-item">
                  <span className="feature-dot" style={{ backgroundColor: activeInfo.color }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trang phục tiêu biểu của vùng */}
          <div className="map-outfits-preview">
            <h4 className="preview-title">Trang phục tiêu biểu ({regionalOutfits.length}):</h4>
            <div className="map-outfits-list">
              {regionalOutfits.map((outfit) => (
                <div key={outfit.id} className="map-outfit-mini-card">
                  <div className="mini-card-info">
                    <h5 className="mini-card-name">{outfit.ten}</h5>
                    <p className="mini-card-desc">{outfit.mo_ta_ngan}</p>
                    <div className="mini-card-colors">
                      {outfit.mau_dac_trung.slice(0, 3).map((c, i) => (
                        <span key={i} className="mini-color-chip">{c}</span>
                      ))}
                    </div>
                  </div>
                  {onSelectOutfitForMixer && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm mini-card-btn"
                      onClick={() => onSelectOutfitForMixer(outfit)}
                    >
                      Thử phối đồ
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
