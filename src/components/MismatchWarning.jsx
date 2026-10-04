import { useState } from 'react';
import './MismatchWarning.css';

export default function MismatchWarning({ warnings, onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  if (!warnings || warnings.length === 0 || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
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
            <h4 className="mismatch-warning__title">Cố Vấn AI: Lưu ý văn hóa & Gợi ý phối đồ</h4>
          </div>
          <button
            className="mismatch-warning__close"
            onClick={handleDismiss}
            title="Đóng thông báo"
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

                {w.reference && (
                  <p className="warning-ref">
                    📚 <em>Tham khảo: {w.reference}</em>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mismatch-warning__note">
          Hệ thống đưa ra gợi ý nhằm bảo tồn nét đẹp nguyên bản — bạn hoàn toàn có thể sáng tạo tự do theo phong cách riêng!
        </p>
      </div>
    </div>
  );
}
