import { useState, useRef } from 'react';
import './UserPhotoUploadModal.css';

export default function UserPhotoUploadModal({ isOpen, onClose, onConfirmPhoto }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileProcess = (file) => {
    if (!file) return;

    // Check MIME type or file extension (supports Windows registry quirks)
    const isImage = (file.type && file.type.startsWith('image/')) || 
                    /\.(jpe?g|png|webp|gif|bmp|svg|jfif)$/i.test(file.name);
    if (!isImage) {
      alert('Vui lòng chọn file hình ảnh (JPG, PNG, WebP, JFIF)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 20MB.');
      return;
    }

    setSelectedFile(file);
    setZoomLevel(1);
    setIsLoading(true);
    setLoadError(null);

    // Read as Base64 Data URL so it renders instantly and reliably in every environment
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreviewUrl(dataUrl);
      setIsLoading(false);
    };
    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      try {
        const fallbackUrl = URL.createObjectURL(file);
        setPreviewUrl(fallbackUrl);
        setIsLoading(false);
      } catch (e2) {
        console.error('Blob URL fallback error:', e2);
        setLoadError('Không thể đọc file ảnh này. Vui lòng thử ảnh khác.');
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (selectedFile && previewUrl) {
      const base64Only = previewUrl.startsWith('data:') 
        ? previewUrl.split(',')[1] 
        : null;
      onConfirmPhoto(selectedFile, zoomLevel, previewUrl, base64Only);
      onClose();
    }
  };

  return (
    <div className="upload-modal-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="upload-modal-card animate-scale-up">
        {/* Header */}
        <div className="upload-modal-header">
          <h3 className="upload-modal-title">📸 Tải ảnh chân dung để thử đồ</h3>
          <button type="button" className="upload-modal-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* Guidance Box with silhouette */}
        <div className="upload-guide-box">
          <div className="upload-silhouette" title="Dáng chụp khuyến nghị">
            👤
          </div>
          <ul className="upload-tips-list">
            <li><strong>Tư thế:</strong> Đứng thẳng hoặc ngồi ngay ngắn, thấy rõ vai và thân trên.</li>
            <li><strong>Ánh sáng:</strong> Đủ sáng, phông nền đơn giản hoặc ít chi tiết rườm rà.</li>
            <li><strong>Trang phục:</strong> Áo gọn gàng để hệ thống ướm cổ phục chuẩn xác nhất.</li>
          </ul>
        </div>

        {/* Upload Dropzone or Preview */}
        {isLoading ? (
          <div className="upload-loading-area">
            <span className="upload-spinner" />
            <p>Đang đọc và tối ưu hiển thị ảnh...</p>
          </div>
        ) : !previewUrl ? (
          <div
            className={`upload-dropzone ${isDragOver ? 'upload-dropzone--active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="dropzone-icon">📤</div>
            <p className="dropzone-text">Chạm để chọn ảnh hoặc kéo thả vào đây</p>
            <span className="dropzone-sub">Hỗ trợ JPG, PNG, WebP, JFIF (Tối đa 20MB)</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
                e.target.value = '';
              }}
              accept="image/*,.jfif,.jpg,.jpeg,.png,.webp"
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="upload-preview-area">
            <div className="preview-img-container">
              {loadError ? (
                <div className="preview-error-box">
                  <span style={{ fontSize: '2rem' }}>⚠️</span>
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem' }}>{loadError}</p>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Xem trước ảnh của bạn"
                  className="preview-img"
                  style={{ transform: `scale(${zoomLevel})` }}
                  onError={() => {
                    setLoadError('Ảnh không tương thích định dạng trình duyệt.');
                  }}
                />
              )}
            </div>

            <div className="zoom-slider-wrap">
              <span>🔍 Thu nhỏ</span>
              <input
                type="range"
                min="0.8"
                max="1.8"
                step="0.05"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              />
              <span>Phóng to</span>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
                setLoadError(null);
              }}
            >
              🔄 Chọn ảnh khác
            </button>
          </div>
        )}

        {/* Privacy Note */}
        <p className="upload-privacy-note">
          <span>🔒</span>
          <span>Ảnh được xử lý trực tiếp trên trình duyệt của bạn (Local Client-Side), hoàn toàn không lưu trữ hay tải lên máy chủ ngoài.</span>
        </p>

        {/* Footer Actions */}
        <div className="upload-modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!previewUrl}
          >
            ✓ Xác nhận dùng ảnh này
          </button>
        </div>
      </div>
    </div>
  );
}
