import { useState, useEffect } from 'react';
import { generateCultureDescription } from '../services/geminiTextService';
import { COSTUME_META } from '../data/costumeMeta';
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

  const costumeMeta = COSTUME_META[outfit.id];
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
      {/* Persona Badge: Danh xưng Cổ phong Gen Z */}
      {costumeMeta && (
        <div className="persona-badge-banner" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <div className="persona-badge-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="persona-title-group" style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="persona-crown">👑</span>
              <div>
                <span className="persona-tag" style={{ fontSize: '0.75rem', color: '#DAA520', textTransform: 'uppercase', letterSpacing: '1px' }}>Danh xưng AI phong tặng:</span>
                <h3 className="persona-name" style={{ fontSize: '1.25rem', margin: 0 }}>{costumeMeta.personaTitle}</h3>
              </div>
            </div>
            <span className="persona-authenticity-pill" style={{ background: '#8b0000', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem' }}>{costumeMeta.authenticityTag}</span>
          </div>
          
          <div className="persona-stages" style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ display: 'inline-block', background: '#DAA520', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>GIAI ĐOẠN 1/4</span>
              <div style={{ fontWeight: 'bold' }}>Tuyển chọn tơ lụa di sản</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Lụa Vạn Phúc & gấm tơ tằm theo điển chế triều đại</div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ display: 'inline-block', background: '#DAA520', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '4px' }}>GIAI ĐOẠN 2/4</span>
              <div style={{ fontWeight: 'bold' }}>Hòa sắc Ngũ Hành tương sinh</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Cân bằng Kim - Mộc - Thủy - Hỏa - Thổ mang lại cát tường</div>
            </div>
          </div>
          
          <p className="persona-praise" style={{ fontStyle: 'italic', fontSize: '0.9rem', marginTop: '1rem' }}>"{costumeMeta.funPraise}"</p>
          <div className="persona-meta-chips" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem' }}>
            <span className="persona-chip" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>🔮 {costumeMeta.element}</span>
            <span className="persona-chip" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>🏷️ Thuê tham khảo: {costumeMeta.rentalEstimate}</span>
          </div>
        </div>
      )}

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

            {/* Nguồn tư liệu & Trích dẫn kiểm chứng */}
            {outfit.citations && outfit.citations.length > 0 ? (
              <div className="culture-card__citations-section">
                <span className="meta-label" style={{ display: 'block', marginBottom: '6px' }}>
                  📚 Nguồn kiểm chứng & Mức tin cậy:
                </span>
                <div className="citations-list">
                  {outfit.citations.map((cite, idx) => (
                    <div key={idx} className="citation-badge-item">
                      <div className="citation-header-row">
                        <strong className="citation-source-name">{cite.sourceName}</strong>
                        {cite.confidenceLevel && (
                          <span className="citation-confidence-tag">
                            ✓ {cite.confidenceLevel}
                          </span>
                        )}
                      </div>
                      <div className="citation-sub-info">
                        {cite.author && <span>{cite.author}</span>}
                        {cite.year && <span>({cite.year})</span>}
                        {cite.pages && <span>• {cite.pages}</span>}
                      </div>
                      {cite.hasDebate && cite.debateNote && (
                        <p className="citation-debate-callout">
                          ⚖️ <em>{cite.debateNote}</em>
                        </p>
                      )}
                      {cite.url && (
                        <a
                          href={cite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="citation-ext-link"
                          title="Mở cổng di sản số / tài liệu kiểm chứng"
                        >
                          🔗 Tra cứu nguồn di sản ↗
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : outfit.nguon_tham_khao ? (
              <div className="culture-card__source">
                <span className="meta-label">Tư liệu tham khảo:</span>
                <p className="culture-card__source-text">{outfit.nguon_tham_khao}</p>
              </div>
            ) : null}
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
