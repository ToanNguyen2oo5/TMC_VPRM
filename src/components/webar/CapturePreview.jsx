import { useState } from 'react';
import './CapturePreview.css';

/**
 * CapturePreview Component
 * Hộp thoại xem lại ảnh chụp WebAR và lưu / chia sẻ
 */
export default function CapturePreview({ imageUrl, onRetake, onClose, onToast }) {
  const [isSharing, setIsSharing] = useState(false);

  if (!imageUrl) return null;

  // Xử lý Lưu ảnh hoặc Chia sẻ qua Web Share API
  const handleSavePhoto = async () => {
    try {
      setIsSharing(true);

      // Nếu trình duyệt hỗ trợ Web Share API với files (thường trên iOS Safari / Android Chrome)
      if (navigator.share && navigator.canShare) {
        try {
          const res = await fetch(imageUrl);
          const blob = await res.blob();
          const file = new File([blob], `viet-phuc-remix-ar-${Date.now()}.jpg`, { type: 'image/jpeg' });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'Việt Phục Remix — Thử Phụ Kiện AR',
              text: 'Khoảnh khắc trải nghiệm phụ kiện cổ phục Việt Nam cùng Việt Phục Remix!'
            });
            if (onToast) onToast('✨ Đã chia sẻ ảnh thành công!');
            setIsSharing(false);
            return;
          }
        } catch (shareErr) {
          if (shareErr.name !== 'AbortError') {
            console.warn('Lỗi navigator.share:', shareErr);
          }
        }
      }

      // Fallback: Tải file trực tiếp về máy
      const downloadLink = document.createElement('a');
      downloadLink.href = imageUrl;
      downloadLink.download = `viet-phuc-remix-ar-${Date.now()}.jpg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      if (onToast) onToast('💾 Đã lưu ảnh về thiết bị của bạn!');
    } catch (err) {
      console.error('Lỗi lưu ảnh:', err);
      if (onToast) onToast('⚠️ Không thể tải ảnh, bạn có thể nhấn giữ vào ảnh để lưu nhé.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="capture-modal-backdrop animate-fade-in">
      <div className="capture-modal-card glass-panel animate-fade-in-up">
        <div className="capture-modal-header">
          <h3 className="capture-modal-title">✨ Ảnh Thử Phụ Kiện AR</h3>
          <button
            type="button"
            className="capture-close-btn"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
          >
            ✕
          </button>
        </div>

        <div className="capture-preview-frame">
          <img
            src={imageUrl}
            alt="Ảnh thử phụ kiện cổ phục"
            className="captured-photo-img"
          />
          <div className="capture-watermark">
            <span>Việt Phục Remix • WebAR</span>
          </div>
        </div>

        <div className="capture-modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRetake}
          >
            📸 Chụp lại
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSavePhoto}
            disabled={isSharing}
          >
            {isSharing ? '⏳ Đang lưu...' : '💾 Lưu ảnh về máy'}
          </button>
        </div>
      </div>
    </div>
  );
}
