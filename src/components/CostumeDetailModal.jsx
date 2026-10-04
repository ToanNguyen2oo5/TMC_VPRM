import { useState, useEffect } from 'react';
import { COSTUME_META } from '../data/costumeMeta';
import './CostumeDetailModal.css';

export default function CostumeDetailModal({ outfit, isOpen, onClose, onSelectForMixer }) {
  const [isSourceOpen, setIsSourceOpen] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !outfit) return null;

  const isModern = outfit.category === 'hien_dai' || outfit.id.includes('cach_tan');
  const meta = COSTUME_META[outfit.id] || null;

  return (
    <div className="costume-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="costume-modal-card animate-scale-up">
        {/* Header */}
        <div className="costume-modal-header">
          <div>
            <div className="costume-modal-badges">
              <span className={`badge ${isModern ? 'badge-modern' : 'badge-heritage'}`}>
                {isModern ? '✨ Dòng Cách Tân' : '🏛️ Dòng Cổ Truyền'}
              </span>
              <span className="badge badge-subtle">{outfit.vung_mien}</span>
              <span className="verified-pill">✓ Đã đối chiếu tư liệu bảo tàng</span>
            </div>
            <h3 className="costume-modal-title">{outfit.ten}</h3>
            <span className="costume-modal-era">
              Triều đại: {outfit.era || 'Cổ truyền Việt Nam'}
            </span>
          </div>
          <button
            type="button"
            className="costume-modal-close"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="costume-modal-body">
          {/* 1. Ý nghĩa cấu trúc & văn hóa */}
          <div className="costume-modal-section">
            <span className="costume-modal-section-title">📖 Ý nghĩa cấu trúc & Văn hóa</span>
            <p className="costume-modal-text">{outfit.y_nghia || outfit.mo_ta_ngan}</p>
          </div>

          {/* 2. Chất liệu & Màu sắc */}
          <div className="costume-modal-section">
            <span className="costume-modal-section-title">🧵 Chất liệu & Sắc thái tiêu biểu</span>
            <p className="costume-modal-text">
              <strong>Chất liệu:</strong> {outfit.chat_lieu}
              <br />
              <strong>Sắc thái:</strong> {outfit.mau_dac_trung?.join(', ')}
            </p>
          </div>

          {/* 3. Phụ kiện cổ phong */}
          <div className="costume-modal-section">
            <span className="costume-modal-section-title">🎀 Phụ kiện đi kèm chuẩn phong vị</span>
            <p className="costume-modal-text">
              {outfit.phu_kien_di_kem?.join(' • ')}
            </p>
          </div>

          {/* 4. Gợi ý địa điểm & Chi phí thuê tham khảo (Priority 7) */}
          {meta && (
            <div className="costume-modal-extra-grid">
              <div className="costume-modal-section">
                <span className="costume-modal-section-title">📍 Gợi ý địa điểm chụp ảnh (Tham khảo)</span>
                <div className="photo-spots-chips">
                  {meta.photoSpots.map((spot, i) => (
                    <span key={i} className="photo-spot-chip" title={spot.desc}>
                      📸 {spot.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="costume-modal-section">
                <span className="costume-modal-section-title">🏷️ Chi phí thuê tham khảo</span>
                <p className="costume-modal-text" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                  Khoảng: {meta.rentalEstimate}
                </p>
                <small className="costume-modal-caption">*{meta.rentalNote}</small>
              </div>
            </div>
          )}

          {/* 5. Nguồn khảo cứu (Accordion - Priority 3) */}
          <div className="costume-modal-section source-accordion-section">
            <button
              type="button"
              className="source-toggle-btn"
              onClick={() => setIsSourceOpen(!isSourceOpen)}
              aria-expanded={isSourceOpen}
            >
              <span>📚 Nguồn khảo cứu & Thư tịch cổ đối chiếu</span>
              <span className="accordion-arrow">{isSourceOpen ? '▲' : '▼'}</span>
            </button>
            {isSourceOpen && (
              <div className="source-accordion-body animate-fade-in">
                <p className="costume-modal-text source-text">
                  {outfit.nguon_tham_khao || 'Trần Quang Đức, "Ngàn năm áo mũ", NXB Thế giới; Bảo tàng Phụ nữ Việt Nam; Trung tâm Bảo tồn Di tích Cố đô Huế.'}
                </p>
                <span className="source-disclaimer">
                  ℹ️ Mọi thông tin đều được đối chiếu cẩn trọng với các công trình khảo cứu di sản trang phục uy tín tại Việt Nam.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="costume-modal-footer">
          <button
            type="button"
            className="btn btn-secondary modal-action-btn"
            onClick={onClose}
          >
            Đóng lại
          </button>
          {onSelectForMixer && (
            <button
              type="button"
              className="btn btn-primary modal-action-btn"
              onClick={() => {
                onSelectForMixer(outfit);
                onClose();
              }}
            >
              ✨ Phối đồ với bộ này ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
