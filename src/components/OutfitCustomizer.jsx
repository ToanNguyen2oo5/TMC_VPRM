import { useState, useEffect, useMemo } from 'react';
import { fileToBase64 } from '../services/geminiImageService';
import { PRESET_PALETTES, TRADITIONAL_COLORS, calculateColorHarmony } from '../services/colorHarmonyService';
import { evaluateCulturalWarnings } from '../services/culturalWarningService';
import { ACCESSORIES } from '../data/accessoriesData';
import OutfitPreview from './OutfitPreview';
import UserPhotoUploadModal from './UserPhotoUploadModal';
import './OutfitCustomizer.css';

const SAMPLE_AVATARS = [
  { id: 'female_1', label: 'Nữ mẫu 1', emoji: '👩' },
  { id: 'male_1', label: 'Nam mẫu 1', emoji: '👨' },
  { id: 'female_2', label: 'Nữ mẫu 2', emoji: '👩‍🦱' },
];

const MATERIALS = [
  { id: 'lua_to_tam', name: 'Lụa tơ tằm Vạn Phúc', icon: '🧵', desc: 'Mềm mại, óng ả, rủ tà tha thướt' },
  { id: 'gam_cung_dinh', name: 'Gấm hoa chìm Cung đình', icon: '👑', desc: 'Dày dặn, vương giả, uy nghiêm hoàng tộc' },
  { id: 'vai_dui_tho', name: 'Vải đũi / thô mộc tự nhiên', icon: '🌾', desc: 'Bình dị, thoáng khí, mộc mạc Bắc Bộ' },
  { id: 'taffeta_ren', name: 'Taffeta / Organza cách tân', icon: '✨', desc: 'Giữ phom hiện đại, trẻ trung Gen Z' }
];

export default function OutfitCustomizer({ 
  onCustomizeAndGenerate, 
  selectedOutfit, 
  selectedScene, 
  isGenerating 
}) {
  // Mobile Bottom Sheet Active Tab: 'colors' | 'materials' | 'accessories' | 'fit' | 'summary'
  const [mobileTab, setMobileTab] = useState('colors');

  // Bottom Sheet expansion on mobile: 'half' (default ~58vh) | 'full' (~85vh) | 'peek' (~25vh)
  const [sheetSnap, setSheetSnap] = useState('half');

  // Fullscreen Preview Modal state (Priority 1)
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // User Photo Upload Guidance Modal state (Priority 6)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Left Column Tab State on Desktop: 'colors' | 'materials' | 'accessories' | 'fit'
  const [selectorTab, setSelectorTab] = useState('colors');

  // Upload & Avatar states
  const [preview, setPreview] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState('female_1');

  // Customization states
  const [fit, setFit] = useState('Vừa vặn');
  const [length, setLength] = useState('Dài (chấm gót)');
  const [collar] = useState('Truyền thống');
  const [sleeve] = useState('Dài tay');
  const [height, setHeight] = useState('162');
  const [material, setMaterial] = useState('Lụa tơ tằm Vạn Phúc');
  const [isHeritageExpanded, setIsHeritageExpanded] = useState(false);

  // Angle Mode: 'single' | 'multi'
  const [angleMode, setAngleMode] = useState('single');

  // Color Palette State
  const defaultPalette = useMemo(() => PRESET_PALETTES[0], []);
  const [primaryColor, setPrimaryColor] = useState(defaultPalette.primary);
  const [secondaryColor, setSecondaryColor] = useState(defaultPalette.secondary);
  const [accentColor, setAccentColor] = useState(defaultPalette.accent);
  const [selectedPresetId, setSelectedPresetId] = useState(defaultPalette.id);

  // Accessories Selection
  const compatibleAccessories = useMemo(() => {
    if (!selectedOutfit) return ACCESSORIES.slice(0, 8);
    return ACCESSORIES.filter(a => a.phu_hop_voi.includes(selectedOutfit.id));
  }, [selectedOutfit]);

  const [selectedAccessories, setSelectedAccessories] = useState([]);

  useEffect(() => {
    if (selectedOutfit) {
      const initial = compatibleAccessories.slice(0, 2).map(a => a.id);
      setSelectedAccessories(initial);
    }
  }, [selectedOutfit, compatibleAccessories]);

  // Color Harmony Calculation
  const harmonyResult = useMemo(() => {
    return calculateColorHarmony(primaryColor, secondaryColor, accentColor, selectedScene);
  }, [primaryColor, secondaryColor, accentColor, selectedScene]);

  // Cultural Warnings Calculation
  const culturalWarnings = useMemo(() => {
    return evaluateCulturalWarnings({
      outfit: selectedOutfit,
      event: selectedScene,
      accessories: selectedAccessories,
      colors: { primary: primaryColor, secondary: secondaryColor, accent: accentColor }
    });
  }, [selectedOutfit, selectedScene, selectedAccessories, primaryColor, secondaryColor, accentColor]);

  // Handlers
  const handleSelectPresetPalette = (palette) => {
    setSelectedPresetId(palette.id);
    setPrimaryColor(palette.primary);
    setSecondaryColor(palette.secondary);
    setAccentColor(palette.accent);
  };

  const handleToggleAccessory = (accId) => {
    setSelectedAccessories(prev => 
      prev.includes(accId) ? prev.filter(id => id !== accId) : [...prev, accId]
    );
  };

  const handleApplyWarningFix = (warning) => {
    if (!warning.fixAction) return;
    if (warning.fixAction.type === 'color') {
      setPrimaryColor(warning.fixAction.primary);
    } else if (warning.fixAction.type === 'replace_accessory') {
      setSelectedAccessories(prev => {
        const withoutOld = prev.filter(id => id !== warning.fixAction.remove);
        return [...withoutOld, warning.fixAction.add];
      });
    } else if (warning.fixAction.type === 'material') {
      setMaterial(warning.fixAction.material);
    }
  };

  const handleConfirmUserPhoto = async (file, zoom = 1, dataUrl = null, base64 = null) => {
    const finalBase64 = base64 || await fileToBase64(file);
    const finalPreview = dataUrl || `data:image/png;base64,${finalBase64}`;
    setPreview(finalPreview);
    setUserPhoto(finalBase64);
    setSelectedAvatar(null);
  };

  const handleFinishAndGenerate = () => {
    const selectedAccObjects = ACCESSORIES.filter(a => selectedAccessories.includes(a.id));
    onCustomizeAndGenerate({
      userPhoto,
      customizations: { fit, length, collar, sleeve, height, material },
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor
      },
      accessories: selectedAccObjects,
      evalScores: harmonyResult,
      angleMode
    });
  };

  // Reusable selector content
  const renderColorsPane = () => (
    <div className="selector-pane animate-fade-in">
      <label className="pane-section-label">Bảng phối màu gợi ý ngũ hành:</label>
      <div className="preset-palettes-grid">
        {PRESET_PALETTES.map(p => (
          <button
            key={p.id}
            type="button"
            className={`preset-palette-btn ${selectedPresetId === p.id ? 'preset-palette-btn--active' : ''}`}
            onClick={() => handleSelectPresetPalette(p)}
          >
            <div className="palette-preview-dots">
              <span style={{ background: p.primary }} />
              <span style={{ background: p.secondary }} />
              <span style={{ background: p.accent }} />
            </div>
            <span className="palette-name">{p.name}</span>
          </button>
        ))}
      </div>

      <label className="pane-section-label" style={{ marginTop: '1.25rem' }}>
        8 Sắc màu truyền thống Việt Nam:
      </label>
      <div className="trad-colors-grid">
        {TRADITIONAL_COLORS.slice(0, 8).map(c => (
          <button
            key={c.id}
            type="button"
            className={`trad-color-chip ${primaryColor.toLowerCase() === c.hex.toLowerCase() ? 'trad-color-chip--active' : ''}`}
            onClick={() => {
              setPrimaryColor(c.hex);
              setSelectedPresetId(null);
            }}
            title={`${c.name} (${c.element}): ${c.meaning}`}
          >
            <span className="trad-chip-dot" style={{ background: c.hex }} />
            <div className="trad-chip-text">
              <strong>{c.name}</strong>
              <small>{c.element}</small>
            </div>
          </button>
        ))}
      </div>

      {/* Tự tinh chỉnh từng phần */}
      <div className="custom-colors-row" style={{ marginTop: '1.25rem' }}>
        <div className="color-picker-box">
          <label>Tà áo chính</label>
          <div className="picker-input-wrap">
            <input 
              type="color" 
              value={primaryColor} 
              onChange={(e) => { setPrimaryColor(e.target.value); setSelectedPresetId(null); }}
              className="color-wheel"
            />
            <span className="hex-val">{primaryColor}</span>
          </div>
        </div>
        <div className="color-picker-box">
          <label>Quần lụa / Cổ</label>
          <div className="picker-input-wrap">
            <input 
              type="color" 
              value={secondaryColor} 
              onChange={(e) => { setSecondaryColor(e.target.value); setSelectedPresetId(null); }}
              className="color-wheel"
            />
            <span className="hex-val">{secondaryColor}</span>
          </div>
        </div>
        <div className="color-picker-box">
          <label>Viền / Yếm</label>
          <div className="picker-input-wrap">
            <input 
              type="color" 
              value={accentColor} 
              onChange={(e) => { setAccentColor(e.target.value); setSelectedPresetId(null); }}
              className="color-wheel"
            />
            <span className="hex-val">{accentColor}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaterialsPane = () => (
    <div className="selector-pane animate-fade-in">
      <label className="pane-section-label">Chất liệu dệt truyền thống:</label>
      <div className="materials-list">
        {MATERIALS.map(m => (
          <button
            key={m.id}
            type="button"
            className={`material-item-btn ${material === m.name ? 'material-item-btn--active' : ''}`}
            onClick={() => setMaterial(m.name)}
          >
            <span className="material-icon">{m.icon}</span>
            <div className="material-info">
              <strong>{m.name}</strong>
              <p>{m.desc}</p>
            </div>
            {material === m.name && <span className="material-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAccessoriesPane = () => (
    <div className="selector-pane animate-fade-in">
      <label className="pane-section-label">
        Phụ kiện phối kèm ({compatibleAccessories.length} mẫu tương thích):
      </label>
      <div className="accessories-selector-grid">
        {compatibleAccessories.map(acc => {
          const isPicked = selectedAccessories.includes(acc.id);
          return (
            <button
              key={acc.id}
              type="button"
              className={`acc-card-btn ${isPicked ? 'acc-card-btn--active' : ''}`}
              onClick={() => handleToggleAccessory(acc.id)}
            >
              <span className="acc-card-icon">{acc.icon}</span>
              <div className="acc-card-details">
                <span className="acc-card-name">{acc.name}</span>
                <span className="acc-card-desc">{acc.categoryName}</span>
              </div>
              <span className="acc-card-toggle">{isPicked ? '✓' : '+'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderFitPane = () => (
    <div className="selector-pane animate-fade-in">
      <div className="form-group-block">
        <label className="pane-section-label">Độ ôm tà áo:</label>
        <div className="options-pill-group">
          {['Vừa vặn', 'Thoải mái', 'Ôm nhẹ'].map(opt => (
            <button
              key={opt}
              type="button"
              className={`option-pill ${fit === opt ? 'option-pill--active' : ''}`}
              onClick={() => setFit(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group-block" style={{ marginTop: '1rem' }}>
        <label className="pane-section-label">Độ dài tà áo:</label>
        <div className="options-pill-group">
          {['Dài (chấm gót)', 'Lửng (ngang bắp chân)', 'Ngắn (cách tân)'].map(opt => (
            <button
              key={opt}
              type="button"
              className={`option-pill ${length === opt ? 'option-pill--active' : ''}`}
              onClick={() => setLength(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group-block" style={{ marginTop: '1rem' }}>
        <label className="pane-section-label">Chiều cao của bạn (cm):</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="height-number-input"
          min="140"
          max="200"
        />
      </div>
    </div>
  );

  const renderSummaryPane = () => (
    <div className="selector-pane animate-fade-in">
      {/* 1. Điểm hài hòa màu sắc */}
      <div className="harmony-score-box">
        <div className="harmony-score-header">
          <span className="score-label">Độ Hài Hòa Màu Sắc</span>
          <span className="score-value" style={{ color: harmonyResult.harmonyScore >= 80 ? '#3F7D58' : '#C8A15A' }}>
            {harmonyResult.harmonyScore} / 100
          </span>
        </div>
        <div className="score-meter-bar">
          <div
            className="score-meter-fill"
            style={{
              width: `${harmonyResult.harmonyScore}%`,
              background: harmonyResult.harmonyScore >= 80 
                ? 'linear-gradient(90deg, #C8A15A, #3F7D58)' 
                : 'linear-gradient(90deg, #A4262C, #C8A15A)'
            }}
          />
        </div>
        <p className="score-reason-text">
          💡 {harmonyResult.explanation || 'Tông màu chính và màu phụ có độ tương phản nhã nhặn, tôn vinh ngũ hành truyền thống.'}
        </p>
      </div>

      {/* 2. Cảnh báo văn hóa thân thiện (Cultural Warnings) */}
      <div className="cultural-warnings-section">
        <label className="pane-section-label">
          <span>🧭</span> Nhận định văn hóa:
        </label>
        {culturalWarnings.length === 0 ? (
          <div className="no-warning-card">
            <span>✅</span>
            <p>Tuyệt vời! Set đồ phối hợp hài hòa, chuẩn mực và tôn trọng bản sắc di sản.</p>
          </div>
        ) : (
          <div className="warnings-list">
            {culturalWarnings.map((w, idx) => (
              <div key={idx} className={`warning-item-card warning-item-card--${w.type}`}>
                <div className="warning-item-header">
                  <span className="warning-type-tag">
                    {w.type === 'warning' ? '🚫 Lưu ý' : w.type === 'caution' ? '⚠️ Cân nhắc' : 'ℹ️ Thông tin'}
                  </span>
                  <strong>{w.title}</strong>
                </div>
                <p className="warning-item-msg">{w.message}</p>
                {w.suggestion && (
                  <div className="warning-suggestion-box">
                    <span>Gợi ý: {w.suggestion}</span>
                    {w.fixAction && (
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost warning-fix-btn"
                        onClick={() => handleApplyWarningFix(w)}
                      >
                        💡 Áp dụng gợi ý
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Tóm tắt trang phục & ý nghĩa dạng Accordion gọn gàng */}
      {selectedOutfit?.y_nghia && (
        <div className="outfit-heritage-accordion">
          <button
            type="button"
            className="heritage-accordion-toggle"
            onClick={() => setIsHeritageExpanded(!isHeritageExpanded)}
            aria-expanded={isHeritageExpanded}
          >
            <span>📖 {isHeritageExpanded ? 'Thu gọn ý nghĩa di sản' : 'Đọc ý nghĩa & quy chế di sản'}</span>
            <span className="accordion-arrow">{isHeritageExpanded ? '▲' : '▼'}</span>
          </button>
          {isHeritageExpanded && (
            <div className="heritage-accordion-content animate-fade-in">
              <p className="heritage-summary-text">
                {selectedOutfit.y_nghia}
              </p>
              {selectedOutfit.nguon_tham_khao && (
                <small className="heritage-source-text">
                  Nguồn: {selectedOutfit.nguon_tham_khao}
                </small>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <section className="outfit-customizer" id="outfit-customizer">
      {/* ========================================================
          MOBILE SPLIT LAYOUT (PRIORITY 1)
          Upper ~42vh: Fixed Mannequin Preview (Always visible)
          Lower ~58vh: Bottom Sheet with internal scrolling
          ======================================================== */}
      <div className="customizer-mobile-split">
        {/* Sticky Upper Preview Area (40-45% viewport height) */}
        <div className="mobile-preview-sticky">
          {/* Floating Summary Chip over mannequin */}
          <div className="mobile-floating-chip">
            <span className="floating-chip-dot" />
            <span className="floating-chip-text">
              ✨ Hài hòa {harmonyResult.harmonyScore}/100 {culturalWarnings.length > 0 ? `· ⚠️ ${culturalWarnings.length} lưu ý` : '· Chuẩn mực'}
            </span>
          </div>

          {/* Fullscreen zoom button */}
          <button
            type="button"
            className="mobile-fullscreen-btn"
            onClick={() => setIsFullscreenPreview(true)}
            title="Phóng to toàn màn hình"
            aria-label="Phóng to"
          >
            🔍 Phóng to
          </button>

          {/* Live Mannequin */}
          <div className="mobile-mannequin-wrapper">
            <OutfitPreview
              selectedOutfit={selectedOutfit}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              accentColor={accentColor}
              selectedAccessories={compatibleAccessories.filter(a => selectedAccessories.includes(a.id))}
              harmonyScore={harmonyResult.harmonyScore}
              fit={fit}
              length={length}
            />
          </div>

          {/* Quick Avatar / Photo Upload pill at bottom of preview */}
          <div className="mobile-avatar-pill-bar">
            <span className="mobile-outfit-tag">{selectedOutfit?.ten}</span>
            <button
              type="button"
              className="mobile-photo-guide-btn"
              onClick={() => setIsUploadModalOpen(true)}
            >
              {preview ? '📸 Đã chọn ảnh' : '👤 Thử ảnh của bạn'}
            </button>
          </div>
        </div>

        {/* Bottom Sheet for Selectors (Lower Half) */}
        <div className={`mobile-bottom-sheet mobile-bottom-sheet--${sheetSnap}`}>
          {/* Drag / Snap Handle */}
          <div
            className="bottom-sheet-drag-handle"
            onClick={() => setSheetSnap(prev => prev === 'half' ? 'full' : 'half')}
            title="Chạm để mở rộng hoặc thu gọn"
          >
            <span className="drag-bar" />
          </div>

          {/* Bottom Sheet Navigation Tabs */}
          <div className="mobile-sheet-tabs">
            <button
              type="button"
              className={`mobile-sheet-tab ${mobileTab === 'colors' ? 'mobile-sheet-tab--active' : ''}`}
              onClick={() => setMobileTab('colors')}
            >
              Màu sắc
            </button>
            <button
              type="button"
              className={`mobile-sheet-tab ${mobileTab === 'materials' ? 'mobile-sheet-tab--active' : ''}`}
              onClick={() => setMobileTab('materials')}
            >
              Chất liệu
            </button>
            <button
              type="button"
              className={`mobile-sheet-tab ${mobileTab === 'accessories' ? 'mobile-sheet-tab--active' : ''}`}
              onClick={() => setMobileTab('accessories')}
            >
              Phụ kiện ({selectedAccessories.length})
            </button>
            <button
              type="button"
              className={`mobile-sheet-tab ${mobileTab === 'fit' ? 'mobile-sheet-tab--active' : ''}`}
              onClick={() => setMobileTab('fit')}
            >
              Phom dáng
            </button>
            <button
              type="button"
              className={`mobile-sheet-tab ${mobileTab === 'summary' ? 'mobile-sheet-tab--active' : ''}`}
              onClick={() => setMobileTab('summary')}
            >
              Đánh giá
            </button>
          </div>

          {/* Scrollable Bottom Sheet Body */}
          <div className="mobile-sheet-body">
            {mobileTab === 'colors' && renderColorsPane()}
            {mobileTab === 'materials' && renderMaterialsPane()}
            {mobileTab === 'accessories' && renderAccessoriesPane()}
            {mobileTab === 'fit' && renderFitPane()}
            {mobileTab === 'summary' && renderSummaryPane()}
          </div>

          {/* Persistent Finish CTA on mobile sheet */}
          <div className="mobile-sheet-footer">
            <button
              type="button"
              className="btn btn-primary btn-block cta-finish-btn"
              onClick={handleFinishAndGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Đang khởi tạo...' : '✨ Hoàn tất & Xuất Lookbook'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          DESKTOP 3-COLUMN LAYOUT
          (Visible on viewport width >= 992px)
          ======================================================== */}
      <div className="customizer-3col-layout">
        
        {/* CỘT 1 (TRÁI): BẢNG CHỌN */}
        <div className="customizer-col customizer-col--left glass-panel animate-fade-in-up">
          <div className="selector-tabs-header">
            <button
              type="button"
              className={`selector-tab-btn ${selectorTab === 'colors' ? 'selector-tab-btn--active' : ''}`}
              onClick={() => setSelectorTab('colors')}
            >
              Màu sắc
            </button>
            <button
              type="button"
              className={`selector-tab-btn ${selectorTab === 'materials' ? 'selector-tab-btn--active' : ''}`}
              onClick={() => setSelectorTab('materials')}
            >
              Chất liệu
            </button>
            <button
              type="button"
              className={`selector-tab-btn ${selectorTab === 'accessories' ? 'selector-tab-btn--active' : ''}`}
              onClick={() => setSelectorTab('accessories')}
            >
              Phụ kiện ({selectedAccessories.length})
            </button>
            <button
              type="button"
              className={`selector-tab-btn ${selectorTab === 'fit' ? 'selector-tab-btn--active' : ''}`}
              onClick={() => setSelectorTab('fit')}
            >
              Phom dáng
            </button>
          </div>

          <div className="selector-tab-content">
            {selectorTab === 'colors' && renderColorsPane()}
            {selectorTab === 'materials' && renderMaterialsPane()}
            {selectorTab === 'accessories' && renderAccessoriesPane()}
            {selectorTab === 'fit' && renderFitPane()}
          </div>
        </div>

        {/* CỘT 2 (GIỮA): KHUNG XEM TRƯỚC */}
        <div className="customizer-col customizer-col--center animate-fade-in-up">
          <div className="center-preview-card glass-panel">
            <div className="preview-top-bar">
              <div>
                <h4 className="preview-outfit-name">{selectedOutfit?.ten}</h4>
                <span className="preview-outfit-era">{selectedOutfit?.vung_mien} • {material}</span>
              </div>
              <div className="angle-mode-toggles">
                <button
                  type="button"
                  className={`angle-toggle-btn ${angleMode === 'single' ? 'angle-toggle-btn--active' : ''}`}
                  onClick={() => setAngleMode('single')}
                  title="Chính diện"
                >
                  Chính diện
                </button>
                <button
                  type="button"
                  className={`angle-toggle-btn ${angleMode === 'multi' ? 'angle-toggle-btn--active' : ''}`}
                  onClick={() => setAngleMode('multi')}
                  title="4 góc 360°"
                >
                  360° Đa góc
                </button>
                <button
                  type="button"
                  className="angle-toggle-btn"
                  onClick={() => setIsFullscreenPreview(true)}
                  title="Phóng to xem chi tiết"
                >
                  🔍 Phóng to
                </button>
              </div>
            </div>

            {/* Mannequin Live View */}
            <div className="mannequin-frame-wrap">
              <OutfitPreview
                selectedOutfit={selectedOutfit}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                selectedAccessories={compatibleAccessories.filter(a => selectedAccessories.includes(a.id))}
                harmonyScore={harmonyResult.harmonyScore}
                fit={fit}
                length={length}
              />
            </div>

            {/* Avatar & Photo Upload Selector */}
            <div className="avatar-selector-section">
              <span className="avatar-sec-title">Nhân vật thử đồ:</span>
              <div className="avatar-sample-chips">
                {SAMPLE_AVATARS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    className={`avatar-sample-btn ${selectedAvatar === av.id ? 'avatar-sample-btn--active' : ''}`}
                    onClick={() => {
                      setSelectedAvatar(av.id);
                      setPreview(null);
                      setUserPhoto(null);
                    }}
                  >
                    <span>{av.emoji}</span>
                    <span>{av.label}</span>
                  </button>
                ))}
                
                {/* Custom Photo Upload Trigger with guidance modal */}
                <button
                  type="button"
                  className={`avatar-upload-btn ${preview ? 'avatar-upload-btn--active' : ''}`}
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  {preview ? '📸 Đã chọn ảnh của bạn' : '📤 Tải ảnh chân dung của bạn'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT 3 (PHẢI): BẢNG TÓM TẮT & CẢNH BÁO */}
        <div className="customizer-col customizer-col--right glass-panel animate-fade-in-up">
          <h3 className="summary-col-title">
            <span>📋</span> Tóm tắt phối đồ
          </h3>

          {renderSummaryPane()}

          {/* CTA */}
          <div className="customizer-cta-wrap">
            <button
              type="button"
              className="btn btn-primary btn-block btn-lg cta-finish-btn"
              onClick={handleFinishAndGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Đang khởi tạo hình ảnh...' : '✨ Hoàn tất & Xuất Lookbook'}
            </button>
            <small className="cta-subtip">
              Poster nghệ thuật & Tùy chọn so sánh phương án sẽ sẵn sàng ở Bước 4
            </small>
          </div>
        </div>

      </div>

      {/* Fullscreen Mannequin Modal (Priority 1) */}
      {isFullscreenPreview && (
        <div className="fullscreen-preview-overlay animate-fade-in" role="dialog">
          <div className="fullscreen-preview-dialog animate-scale-up">
            <div className="fullscreen-preview-header">
              <span className="fullscreen-title">
                {selectedOutfit?.ten} • {material}
              </span>
              <button
                type="button"
                className="fullscreen-close-btn"
                onClick={() => setIsFullscreenPreview(false)}
                aria-label="Đóng phóng to"
              >
                ✕ Đóng
              </button>
            </div>
            <div className="fullscreen-mannequin-body">
              <OutfitPreview
                selectedOutfit={selectedOutfit}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                selectedAccessories={compatibleAccessories.filter(a => selectedAccessories.includes(a.id))}
                harmonyScore={harmonyResult.harmonyScore}
                fit={fit}
                length={length}
              />
            </div>
          </div>
        </div>
      )}

      {/* User Photo Upload Guidance Modal (Priority 6) */}
      <UserPhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onConfirmPhoto={handleConfirmUserPhoto}
      />
    </section>
  );
}
