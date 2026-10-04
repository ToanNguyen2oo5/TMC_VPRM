import './OutfitComparison.css';

export default function OutfitComparison({ comparedOutfits = [], onRemoveOutfit, onSelectOutfit }) {
  if (!comparedOutfits || comparedOutfits.length === 0) {
    return (
      <section className="comparison-section" id="comparison-section">
        <div className="section-header text-center animate-fade-in-up">
          <span className="section-badge">So sánh phương án</span>
          <h2 className="section-title">
            So sánh <span className="text-gradient">Side-by-Side</span>
          </h2>
          <p className="section-subtitle">
            Chưa có bộ phối đồ nào được thêm vào danh sách so sánh. Hãy phối đồ và bấm "Thêm vào so sánh" nhé!
          </p>
        </div>

        <div className="empty-compare glass-panel text-center animate-fade-in">
          <span className="empty-icon">⚖️</span>
          <h3>Danh sách so sánh đang trống</h3>
          <p>Bạn có thể so sánh tối đa 3 bộ phối đồ cạnh nhau để tìm ra set đồ ưng ý nhất cho sự kiện của mình.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="comparison-section" id="comparison-section">
      <div className="section-header text-center animate-fade-in-up">
        <span className="section-badge">Phân tích đa chiều</span>
        <h2 className="section-title">
          So sánh <span className="text-gradient">Phương Án Phối</span>
        </h2>
        <p className="section-subtitle">
          So sánh trực quan giữa các bộ trang phục, bảng màu, phụ kiện và điểm số văn hóa để chọn ra set đồ hoàn hảo nhất
        </p>
      </div>

      <div className="comparison-table-wrapper glass-panel animate-fade-in-up stagger-1">
        <div className="comparison-grid" style={{ gridTemplateColumns: `repeat(${comparedOutfits.length}, 1fr)` }}>
          {comparedOutfits.map((item, index) => {
            const outfit = item.outfit;
            const evalScores = item.evalScores || { harmonyScore: 85, culturalScore: 90, genZScore: 82, totalScore: 87 };
            const colors = item.colors || { primary: '#B22222', secondary: '#DAA520', accent: '#FAF9F6' };
            const accessories = item.accessories || [];

            return (
              <div key={item.id || index} className="compare-card glass-card">
                <div className="compare-card__header">
                  <span className="set-tag">Phương án #{index + 1}</span>
                  {onRemoveOutfit && (
                    <button 
                      className="remove-btn" 
                      onClick={() => onRemoveOutfit(item.id || index)}
                      title="Xóa khỏi so sánh"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="compare-card__image-box">
                  {item.image ? (
                    <img 
                      src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `data:image/png;base64,${item.image}`} 
                      alt={outfit.ten} 
                      className="compare-img"
                    />
                  ) : (
                    <div className="compare-placeholder">
                      <span>👘</span>
                      <p>{outfit.ten}</p>
                    </div>
                  )}
                </div>

                <div className="compare-card__body">
                  <h3 className="outfit-name">{outfit.ten}</h3>
                  <div className="meta-row">
                    <span className="meta-badge">{outfit.vung_mien}</span>
                    <span className="meta-badge">{item.event ? `Dịp: ${item.event}` : outfit.boi_canh_phu_hop[0]}</span>
                  </div>

                  {/* Bảng màu */}
                  <div className="compare-section-row">
                    <span className="row-title">Bảng màu:</span>
                    <div className="color-swatches">
                      <span className="swatch" style={{ background: colors.primary }} title={`Chính: ${colors.primary}`} />
                      <span className="swatch" style={{ background: colors.secondary }} title={`Phụ: ${colors.secondary}`} />
                      <span className="swatch" style={{ background: colors.accent }} title={`Nhấn: ${colors.accent}`} />
                    </div>
                  </div>

                  {/* Phụ kiện */}
                  <div className="compare-section-row">
                    <span className="row-title">Phụ kiện ({accessories.length}):</span>
                    <p className="acc-names">
                      {accessories.length > 0 
                        ? accessories.map(a => typeof a === 'string' ? a : a.name).join(', ')
                        : outfit.phu_kien_di_kem.slice(0, 2).join(', ')}
                    </p>
                  </div>

                  {/* Điểm số đánh giá */}
                  <div className="scores-box">
                    <div className="score-item">
                      <span className="score-label">🎨 Hài hòa màu:</span>
                      <span className="score-val">{evalScores.harmonyScore}%</span>
                    </div>
                    <div className="score-bar-bg">
                      <div className="score-bar-fill fill-color" style={{ width: `${evalScores.harmonyScore}%` }} />
                    </div>

                    <div className="score-item">
                      <span className="score-label">📖 Phù hợp văn hóa:</span>
                      <span className="score-val">{evalScores.culturalFit || evalScores.culturalScore}%</span>
                    </div>
                    <div className="score-bar-bg">
                      <div className="score-bar-fill fill-culture" style={{ width: `${evalScores.culturalFit || evalScores.culturalScore}%` }} />
                    </div>

                    <div className="score-item">
                      <span className="score-label">⚡ Phong cách Gen Z:</span>
                      <span className="score-val">{evalScores.genZScore}%</span>
                    </div>
                    <div className="score-bar-bg">
                      <div className="score-bar-fill fill-genz" style={{ width: `${evalScores.genZScore}%` }} />
                    </div>

                    <div className="total-score-badge">
                      <span>Tổng điểm: </span>
                      <strong>{evalScores.totalScore || 88}/100</strong>
                    </div>
                  </div>

                  {/* Cảnh báo (nếu có) */}
                  {item.warnings && item.warnings.length > 0 ? (
                    <div className="compare-warning-box">
                      <span className="warn-icon">⚠️</span>
                      <p>{item.warnings[0].message}</p>
                    </div>
                  ) : (
                    <div className="compare-safe-box">
                      <span>✅ Chuẩn mực, không có cảnh báo văn hóa</span>
                    </div>
                  )}

                  {/* Nút hành động */}
                  <div className="compare-action-btn">
                    <button 
                      className="btn btn-primary btn-block"
                      onClick={() => onSelectOutfit && onSelectOutfit(item)}
                    >
                      🌟 Chọn bộ này
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
