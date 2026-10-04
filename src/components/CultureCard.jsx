import { useState, useEffect } from 'react';
import { generateCultureDescription } from '../services/geminiTextService';
import './CultureCard.css';

export default function CultureCard({ outfit, customizations, useDemoData = false }) {
  const [cultureInfo, setCultureInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!outfit) return;

    if (useDemoData) {
      setCultureInfo({
        ten: outfit.ten,
        y_nghia_dien_giai: outfit.y_nghia,
        boi_canh_de_xuat: `Phù hợp cho: ${outfit.boi_canh_phu_hop.join(', ')}`,
        fun_fact: `Trang phục với sắc màu đặc trưng ${outfit.mau_dac_trung[0]} — biểu tượng của vùng ${outfit.vung_mien}.`
      });
      return;
    }

    const fetchCultureInfo = async () => {
      setIsLoading(true);
      try {
        const data = await generateCultureDescription(outfit);
        setCultureInfo(data);
      } catch (err) {
        console.error('Lỗi sinh mô tả văn hóa:', err);
        setCultureInfo({
          ten: outfit.ten,
          y_nghia_dien_giai: outfit.y_nghia,
          boi_canh_de_xuat: `Phù hợp cho: ${outfit.boi_canh_phu_hop.join(', ')}`,
          fun_fact: `Trang phục đặc trưng vùng ${outfit.vung_mien} với màu sắc ${outfit.mau_dac_trung[0]}.`
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCultureInfo();
  }, [outfit, useDemoData]);

  if (!outfit) return null;

  const regionBadge = getRegionClass(outfit.vung_mien);

  // Tính điểm phong cách
  const scores = (() => {
    let authentic = 95;
    let remix = 5;
    
    if (customizations) {
      if (customizations.fit && customizations.fit !== 'Vừa vặn') {
        authentic -= 15;
        remix += 20;
      }
      if (customizations.collar && customizations.collar !== 'Truyền thống') {
        authentic -= 25;
        remix += 30;
      }
      if (customizations.sleeve && customizations.sleeve !== 'Dài tay') {
        authentic -= 15;
        remix += 20;
      }
    }
    return {
      authentic: Math.max(10, authentic),
      remix: Math.min(100, remix),
      harmony: 92 + Math.floor(Math.random() * 8)
    };
  })();

  const showFullDetails = isHovered || isExpanded;

  return (
    <div 
      className={`culture-card glass-panel animate-fade-in-up ${showFullDetails ? 'culture-card--expanded' : ''}`} 
      id="culture-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="culture-card__header">
        <div className="culture-card__title-row">
          <div className="culture-card__badges">
            <span className={`badge ${regionBadge}`}>{outfit.vung_mien}</span>
            {outfit.era && <span className="badge badge-era">{outfit.era}</span>}
          </div>
          <h3 className="culture-card__title">
            {isLoading ? <span className="skeleton" style={{ width: 220, height: 26 }} /> : (cultureInfo?.ten || outfit.ten)}
          </h3>
        </div>
        {outfit.gioi_tinh && (
          <span className="culture-card__gender-tag">
            {outfit.gioi_tinh === 'nữ' ? 'Nữ' : outfit.gioi_tinh === 'nam' ? 'Nam' : 'Unisex'}
          </span>
        )}
      </div>

      {/* Điểm số phong cách - Luôn hiển thị gọn gàng */}
      <div className="culture-card__scores">
        <div className="culture-card__scores-header">
          <span className="scores-subtitle">Đánh giá chuẩn mực & sáng tạo</span>
        </div>
        
        <div className="score-item">
          <div className="score-label">
            <span>Nguyên bản di sản</span>
            <span className="score-num">{scores.authentic}%</span>
          </div>
          <div className="score-bar">
            <div className="score-fill score-fill--authentic" style={{ width: `${scores.authentic}%` }}></div>
          </div>
        </div>

        <div className="score-item">
          <div className="score-label">
            <span>Phá cách hiện đại</span>
            <span className="score-num">{scores.remix}%</span>
          </div>
          <div className="score-bar">
            <div className="score-fill score-fill--remix" style={{ width: `${scores.remix}%` }}></div>
          </div>
        </div>

        <div className="score-item">
          <div className="score-label">
            <span>Hài hòa thẩm mỹ</span>
            <span className="score-num">{scores.harmony}%</span>
          </div>
          <div className="score-bar">
            <div className="score-fill score-fill--harmony" style={{ width: `${scores.harmony}%` }}></div>
          </div>
        </div>
      </div>

      {/* Tóm tắt ý nghĩa nhanh (luôn thấy 1 đoạn súc tích) */}
      <div className="culture-card__summary">
        {isLoading ? (
          <span className="skeleton" style={{ width: '100%', height: 38 }} />
        ) : (
          <p className="culture-card__intro-text">
            {cultureInfo?.y_nghia_dien_giai?.slice(0, 135) || outfit.y_nghia?.slice(0, 135)}...
          </p>
        )}
      </div>

      {/* Chi tiết văn hóa: Mở rộng khi hover hoặc click toggle */}
      <div className={`culture-card__details-drawer ${showFullDetails ? 'is-open' : ''}`}>
        {isLoading ? (
          <div className="culture-card__skeleton">
            <span className="skeleton" style={{ width: '100%', height: 16 }} />
            <span className="skeleton" style={{ width: '85%', height: 16 }} />
          </div>
        ) : (
          <div className="culture-card__deep-info">
            <div className="culture-card__info-block">
              <h4 className="culture-card__section-label">Ý nghĩa văn hóa</h4>
              <p className="culture-card__text">{cultureInfo?.y_nghia_dien_giai || outfit.y_nghia}</p>
            </div>

            <div className="culture-card__info-block">
              <h4 className="culture-card__section-label">Bối cảnh phù hợp</h4>
              <p className="culture-card__text">{cultureInfo?.boi_canh_de_xuat || outfit.boi_canh_phu_hop?.join(', ')}</p>
            </div>

            {cultureInfo?.fun_fact && (
              <div className="culture-card__info-block culture-card__funfact-box">
                <h4 className="culture-card__section-label">Điểm thú vị</h4>
                <p className="culture-card__text">{cultureInfo.fun_fact}</p>
              </div>
            )}

            {/* Màu sắc & Phụ kiện */}
            <div className="culture-card__meta-grid">
              <div className="culture-card__meta-item">
                <span className="meta-label">Bảng màu:</span>
                <div className="culture-card__chips">
                  {outfit.mau_dac_trung.map((color, i) => (
                    <span key={i} className="meta-chip">{color}</span>
                  ))}
                </div>
              </div>

              <div className="culture-card__meta-item">
                <span className="meta-label">Phụ kiện:</span>
                <div className="culture-card__chips">
                  {outfit.phu_kien_di_kem.map((acc, i) => (
                    <span key={i} className="meta-chip">{acc}</span>
                  ))}
                </div>
              </div>

              {outfit.chat_lieu && (
                <div className="culture-card__meta-item full-width">
                  <span className="meta-label">Chất liệu:</span>
                  <span className="meta-val">{outfit.chat_lieu}</span>
                </div>
              )}
            </div>

            {/* Nguồn tư liệu */}
            {outfit.nguon_tham_khao && (
              <div className="culture-card__source">
                <span className="meta-label">Tư liệu tham khảo:</span>
                <p className="culture-card__source-text">{outfit.nguon_tham_khao}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nút bật tắt chi tiết (cho di động hoặc khi không hover) */}
      <button
        type="button"
        className="culture-card__toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={showFullDetails}
      >
        <span>{showFullDetails ? 'Thu gọn thông tin' : 'Rê chuột hoặc bấm để xem chi tiết di sản'}</span>
        <span className={`toggle-arrow ${showFullDetails ? 'is-expanded' : ''}`}>▾</span>
      </button>
    </div>
  );
}

function getRegionClass(region) {
  const r = (region || '').toLowerCase();
  if (r.includes('bắc') || r === 'bắc') return 'badge-bac';
  if (r.includes('trung') || r === 'trung') return 'badge-trung';
  if (r.includes('nam') || r === 'nam') return 'badge-nam';
  return 'badge-chung';
}
