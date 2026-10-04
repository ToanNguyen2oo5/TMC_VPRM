import { useState } from 'react';
import './MismatchWarning.css';

export default function MismatchWarning({ warnings, onDismiss, onSwitchOutfit, onContinue }) {
  const [dismissed, setDismissed] = useState(false);
  const [expandedRef, setExpandedRef] = useState(null);

  if (!warnings || warnings.length === 0 || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  const handleContinue = () => {
    setDismissed(true);
    if (onContinue) {
      onContinue();
    } else if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className="mismatch-warning animate-fade-in-up" id="mismatch-warning" role="alert">
      <div className="mismatch-warning__content">
        <div className="mismatch-warning__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/src/assets/images/ai_stylist_avatar_1791041447024.jpg"
              alt="Cố Vấn AI"
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-gold)' }}
              referrerPolicy="no-referrer"
            />
            <h4 className="mismatch-warning__title">Cố Vấn AI: Lưu ý điển chế & Gợi ý phối đồ</h4>
          </div>
          <button
            className="mismatch-warning__close"
            onClick={handleDismiss}
            title="Đóng thông báo"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="mismatch-warning__list">
          {warnings.map((w, i) => {
            const type = w.type || 'caution';
            const icon = type === 'warning' ? '🚫' : type === 'info' ? 'ℹ️' : '⚠️';
            const badgeText = type === 'warning' ? 'Khuyến nghị tránh' : type === 'info' ? 'Thông tin' : 'Cân nhắc';

            return (
              <div key={i} className={`warning-box warning-box--${type}`}>
                <div className="warning-box__top">
                  <span className="warning-icon">{icon}</span>
                  <span className="warning-badge">{badgeText}</span>
                  <strong className="warning-title">{w.title || w.from || 'Lưu ý'}</strong>
                </div>

                <p className="warning-msg">{w.message || w.ly_do}</p>

                {w.suggestion && (
                  <p className="warning-sug">
                    💡 <strong>Gợi ý:</strong> {w.suggestion}
                  </p>
                )}

                {/* Khối hành động: Đổi sang trang phục gợi ý hoặc Vẫn tiếp tục */}
                <div className="warning-actions-row">
                  {w.recommendedOutfitId && onSwitchOutfit && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm warning-action-btn"
                      onClick={() => onSwitchOutfit(w.recommendedOutfitId)}
                      id="warning-switch-outfit-btn"
                    >
                      ✨ Đổi sang {w.recommendedOutfitName || 'trang phục phù hợp'}
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm warning-continue-btn"
                    onClick={handleContinue}
                    id="warning-continue-btn"
                  >
                    ➡️ Vẫn tiếp tục phối
                  </button>

                  {w.reference && (
                    <button
                      type="button"
                      className="btn-ref-toggle"
                      onClick={() => setExpandedRef(prev => prev === i ? null : i)}
                    >
                      {expandedRef === i ? '▲ Thu gọn tư liệu' : '📖 Xem lý do & tư liệu ▾'}
                    </button>
                  )}
                </div>

                {expandedRef === i && w.reference && (
                  <p className="warning-ref animate-fade-in" style={{ marginTop: '0.5rem' }}>
                    📚 <em>Tư liệu lịch sử: {w.reference}</em>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mismatch-warning__note">
          Hệ thống đưa ra gợi ý nhằm bảo tồn nét đẹp nguyên bản di sản — bạn hoàn toàn có quyền quyết định phong cách sáng tạo riêng!
        </p>
      </div>
    </div>
  );
}
