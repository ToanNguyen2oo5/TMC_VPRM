import { useState, useRef } from 'react';
import { fileToBase64 } from '../services/geminiImageService';
import './PhotoUpload.css';

const SAMPLE_AVATARS = [
  { id: 'female_1', label: 'Nữ mẫu 1', emoji: '👩' },
  { id: 'male_1', label: 'Nam mẫu 1', emoji: '👨' },
  { id: 'female_2', label: 'Nữ mẫu 2', emoji: '👩‍🦱' },
];

export default function PhotoUpload({ onPhotoSelect, selectedOutfit, onGenerate, isGenerating }) {
  const [preview, setPreview] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh (jpg, png, webp)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Ảnh quá lớn. Vui lòng chọn ảnh dưới 10MB.');
      return;
    }

    const base64 = await fileToBase64(file);
    setPreview(`data:image/png;base64,${base64}`);
    setSelectedAvatar(null);
    onPhotoSelect(base64);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.id);
    setPreview(null);
    onPhotoSelect(null); // null = dùng avatar mẫu, AI tự generate
  };

  const hasSelection = preview || selectedAvatar;

  return (
    <section className="photo-upload" id="photo-upload">
      <div className="photo-upload__header animate-fade-in-up">
        <span className="photo-upload__label">Bước 3</span>
        <h2 className="photo-upload__title">
          Thử <span className="text-gradient">lên đồ</span> nào!
        </h2>
        <p className="photo-upload__subtitle">
          Tải ảnh chân dung của bạn hoặc chọn nhân vật mẫu
        </p>
      </div>

      <div className="photo-upload__content">
        {/* Upload area */}
        <div
          className={`upload-zone glass-panel animate-fade-in-up stagger-1 ${dragOver ? 'upload-zone--drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="upload-zone__preview">
              <img src={preview} alt="Preview" />
              <button
                className="upload-zone__change"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  onPhotoSelect(null);
                }}
              >
                Đổi ảnh khác
              </button>
            </div>
          ) : (
            <>
              <div className="upload-zone__icon">📷</div>
              <p className="upload-zone__text">
                Kéo thả ảnh vào đây hoặc <span className="upload-zone__link">chọn từ máy</span>
              </p>
              <p className="upload-zone__hint">JPG, PNG, WebP • Tối đa 10MB</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            hidden
          />
        </div>

        {/* Divider */}
        <div className="photo-upload__divider animate-fade-in">
          <span>hoặc</span>
        </div>

        {/* Sample avatars */}
        <div className="avatar-grid animate-fade-in-up stagger-2">
          <p className="avatar-grid__label">Chọn nhân vật mẫu</p>
          <div className="avatar-grid__items">
            {SAMPLE_AVATARS.map(avatar => (
              <button
                key={avatar.id}
                className={`avatar-item glass-card ${selectedAvatar === avatar.id ? 'avatar-item--active' : ''}`}
                onClick={() => handleAvatarSelect(avatar)}
                id={`avatar-${avatar.id}`}
              >
                <span className="avatar-item__emoji">{avatar.emoji}</span>
                <span className="avatar-item__label">{avatar.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      {hasSelection && selectedOutfit && (
        <div className="photo-upload__action animate-fade-in-up">
          <button
            className="btn btn-primary btn-lg generate-btn"
            onClick={onGenerate}
            disabled={isGenerating}
            id="generate-btn"
          >
            {isGenerating ? (
              <>
                <span className="spinner" />
                Đang tạo trang phục...
              </>
            ) : (
              <>
                ✨ Tạo trang phục cho tôi
              </>
            )}
          </button>
          <p className="generate-hint">
            AI sẽ tạo hình ảnh bạn mặc <strong>{selectedOutfit.ten}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
