import { useState, useRef } from 'react';
import './UserPhotoUploadModal.css';

export default function UserPhotoUploadModal({ isOpen, onClose, onConfirmPhoto }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [showFaceGuide, setShowFaceGuide] = useState(true);
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
    setPan({ x: 0, y: 0 });
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

  const handleConfirm = async () => {
    if (selectedFile && previewUrl) {
      // Xuất đúng phần ảnh đã căn trong khung; không chỉ truyền zoom metadata.
      const image = new Image();
      image.onload = () => {
        const outputWidth = 768;
        const outputHeight = 1024;
        const canvas = document.createElement('canvas');
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        const ctx = canvas.getContext('2d');
        const coverScale = Math.max(outputWidth / image.naturalWidth, outputHeight / image.naturalHeight) * zoomLevel;
        const drawnWidth = image.naturalWidth * coverScale;
        const drawnHeight = image.naturalHeight * coverScale;
        const panScaleX = outputWidth / 360;
        const panScaleY = outputHeight / 430;
        const x = (outputWidth - drawnWidth) / 2 + pan.x * panScaleX;
        const y = (outputHeight - drawnHeight) / 2 + pan.y * panScaleY;
        ctx.drawImage(image, x, y, drawnWidth, drawnHeight);
        const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
        onConfirmPhoto(selectedFile, zoomLevel, croppedUrl, croppedUrl.split(',')[1]);
        onClose();
      };
      image.onerror = () => setLoadError('Không thể tạo ảnh đã căn khung. Vui lòng thử lại.');
      image.src = previewUrl;
    }
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y };
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current) return;
    setPan({
      x: dragRef.current.panX + event.clientX - dragRef.current.startX,
      y: dragRef.current.panY + event.clientY - dragRef.current.startY
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
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
            <div
              className={`preview-img-container ${isDragging ? 'preview-img-container--dragging' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {loadError ? (
                <div className="preview-error-box">
                  <span style={{ fontSize: '2rem' }}>⚠️</span>
                  <p style={{ margin: '6px 0 0', fontSize: '0.8rem' }}>{loadError}</p>
                </div>
              ) : (
                <>
                  <img
                    src={previewUrl}
                    alt="Xem trước ảnh của bạn"
                    className="preview-img"
                    style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})` }}
                    onError={(e) => {
                      console.error('Image element render error:', e);
                      setLoadError('Trình duyệt gặp lỗi khi giải mã ảnh này. Vui lòng bấm "Chọn ảnh khác".');
                    }}
                  />

                  {/* Face & Shoulder Silhouette Guide Overlay */}
                  {showFaceGuide && (
                    <div className="face-guide-overlay animate-fade-in" title="Khung định vị khuôn mặt và vai">
                      <svg viewBox="0 0 180 220" className="face-guide-svg">
                        {/* Head/Face Oval */}
                        <ellipse cx="90" cy="80" rx="38" ry="48" stroke="rgba(218, 165, 32, 0.7)" strokeWidth="1.75" strokeDasharray="5 4" fill="none" />
                        {/* Eye level line */}
                        <line x1="72" y1="78" x2="108" y2="78" stroke="rgba(218, 165, 32, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
                        {/* Shoulders curve */}
                        <path d="M 74 128 L 74 144 Q 74 156 56 164 L 16 192" stroke="rgba(218, 165, 32, 0.6)" strokeWidth="1.75" strokeDasharray="5 4" fill="none" />
                        <path d="M 106 128 L 106 144 Q 106 156 124 164 L 164 192" stroke="rgba(218, 165, 32, 0.6)" strokeWidth="1.75" strokeDasharray="5 4" fill="none" />
                      </svg>
                      <span className="face-guide-hint">Căn chỉnh mặt & vai vào khung</span>
                    </div>
                  )}
                </>
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
            <p className="face-guide-hint">Kéo ảnh để căn mặt và vai vào khung, sau đó chỉnh thanh phóng to.</p>

            <div className="preview-action-controls">
              <button
                type="button"
                className={`btn btn-sm ${showFaceGuide ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setShowFaceGuide(!showFaceGuide)}
                title="Bật/Tắt khung định vị khuôn mặt"
              >
                <span>{showFaceGuide ? '👁️ Ẩn khung căn' : '👁️‍🗨️ Hiện khung căn'}</span>
              </button>
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
