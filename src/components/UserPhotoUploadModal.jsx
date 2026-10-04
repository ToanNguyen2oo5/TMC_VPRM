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

  const handleFileProcess = async (file) => {
    if (!file) return;

    // Check extension or MIME type (supports Windows registry quirks where type is empty or octet-stream)
    const ext = (file.name || '').split('.').pop()?.toLowerCase();
    const isImage = (file.type && file.type.startsWith('image/')) || 
                    ['jpg', 'jpeg', 'png', 'webp', 'jfif', 'bmp', 'svg'].includes(ext);
    if (!isImage) {
      alert('Vui lòng chọn file hình ảnh (JPG, PNG, WebP, JFIF)');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 25MB.');
      return;
    }

    setSelectedFile(file);
    setZoomLevel(1);
    setIsLoading(true);
    setLoadError(null);

    try {
      // 1. Read array buffer to inspect magic numbers and fix MIME type
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer.slice(0, 16));

      let detectedMime = 'image/jpeg';
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        detectedMime = 'image/png';
      } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
                 bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
        detectedMime = 'image/webp';
      } else if (ext === 'png') {
        detectedMime = 'image/png';
      } else if (ext === 'webp') {
        detectedMime = 'image/webp';
      } else {
        detectedMime = 'image/jpeg';
      }

      // Check for HEIC signature
      const isHeic = (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) ||
                     ['heic', 'heif'].includes(ext);
      if (isHeic) {
        setLoadError('Ảnh định dạng HEIC (Apple) chưa được trình duyệt hỗ trợ. Bạn vui lòng xuất ảnh sang JPG hoặc PNG.');
        setIsLoading(false);
        return;
      }

      // 2. Read as Data URL with guaranteed image MIME
      const typedBlob = new Blob([buffer], { type: detectedMime });
      let dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(typedBlob);
      });

      // Fix MIME in dataUrl if browser placed octet-stream
      if (!dataUrl.startsWith('data:image/')) {
        dataUrl = dataUrl.replace(/^data:[^;]*/, `data:${detectedMime}`);
      }

      // 3. Canonicalize via HTML Image & Canvas to guarantee valid RGB raster and fix CMYK / EXIF
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.naturalWidth || img.width || 800;
          let height = img.naturalHeight || img.height || 1000;
          const maxDim = 1920;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.92);
          setPreviewUrl(cleanDataUrl);
          setIsLoading(false);
        } catch (canvasErr) {
          console.warn('Canvas export skipped, using dataUrl:', canvasErr);
          setPreviewUrl(dataUrl);
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        // Fallback: try direct blob URL
        try {
          const blobUrl = URL.createObjectURL(typedBlob);
          const img2 = new Image();
          img2.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img2.naturalWidth || img2.width;
            canvas.height = img2.naturalHeight || img2.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img2, 0, 0);
            const cleanDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            URL.revokeObjectURL(blobUrl);
            setPreviewUrl(cleanDataUrl);
            setIsLoading(false);
          };
          img2.onerror = () => {
            URL.revokeObjectURL(blobUrl);
            // Even if test decode had quirks, provide dataUrl
            setPreviewUrl(dataUrl);
            setIsLoading(false);
          };
          img2.src = blobUrl;
        } catch {
          setPreviewUrl(dataUrl);
          setIsLoading(false);
        }
      };

      img.src = dataUrl;
    } catch (err) {
      console.error('File process error:', err);
      setLoadError('Không thể xử lý tệp ảnh này. Vui lòng chọn ảnh khác.');
      setIsLoading(false);
    }
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
                  onError={(e) => {
                    console.error('Image element render error:', e);
                    setLoadError('Trình duyệt gặp lỗi khi giải mã ảnh này. Vui lòng bấm "Chọn ảnh khác".');
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
