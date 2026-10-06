import { useState, useEffect, useMemo } from 'react';
import { fileToBase64 } from '../services/geminiImageService';
import { PRESET_PALETTES, TRADITIONAL_COLORS, calculateColorHarmony } from '../services/colorHarmonyService';
import { evaluateCulturalWarnings } from '../services/culturalWarningService';
import { ACCESSORIES } from '../data/accessoriesData';
import OutfitPreview from './OutfitPreview';
import UserPhotoUploadModal from './UserPhotoUploadModal';
import StudioLayout from './StudioLayout';
import './OutfitCustomizer.css';

const SAMPLE_AVATARS = [
  { id: 'female_1', label: 'Nữ mẫu 1' },
  { id: 'male_1', label: 'Nam mẫu 1' },
  { id: 'female_2', label: 'Nữ mẫu 2' },
];

const MATERIALS = [
  { id: 'lua_to_tam', name: 'Lụa tơ tằm Vạn Phúc', icon: '✨', desc: 'Mềm mại, óng ả, rủ tà tha thướt' },
  { id: 'gam_cung_dinh', name: 'Gấm hoa chìm Cung đình', icon: '👑', desc: 'Dày dặn, vương giả, uy nghiêm hoàng tộc' },
  { id: 'vai_dui_tho', name: 'Vải đũi / thô mộc tự nhiên', icon: '🌿', desc: 'Bình dị, thoáng khí, mộc mạc Bắc Bộ' },
  { id: 'taffeta_ren', name: 'Taffeta / Organza cách tân', icon: '🌸', desc: 'Giữ phom hiện đại, trẻ trung Gen Z' }
];

export default function OutfitCustomizer({ 
  onCustomizeAndGenerate, 
  selectedOutfit, 
  selectedScene, 
  isGenerating 
}) {
  // Fullscreen Preview Modal state
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  // User Photo Upload Guidance Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Left Column Tab State: 'colors' | 'materials' | 'accessories' | 'fit'
  const [selectorTab, setSelectorTab] = useState('colors');

  // Stage View: 'front' | 'zoom'
  const [stageView, setStageView] = useState('front');

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
    const avatarObj = SAMPLE_AVATARS.find(a => a.id === selectedAvatar);
    const avatarLabel = userPhoto ? 'Ảnh chân dung của bạn' : (avatarObj?.label || 'Nữ mẫu 1');

    onCustomizeAndGenerate({
      userPhoto,
      selectedAvatar,
      avatarLabel,
      isUsingSampleAvatar: !userPhoto,
      customizations: { fit, length, collar, sleeve, height, material },
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor
      },
      accessories: selectedAccObjects,
      evalScores: harmonyResult,
      angleMode: 'single'
    });
  };

  // Reusable selector content
  const renderColorsPane = () => (
    <div className="vp-pane-block animate-fade-in">
      <span className="vp-pane-title">Bảng phối gợi ý ngũ hành:</span>
      <div className="vp-preset-grid">
        {PRESET_PALETTES.map(p => (
          <button
            key={p.id}
            type="button"
            className={`vp-preset-btn ${selectedPresetId === p.id ? 'is-active' : ''}`}
            onClick={() => handleSelectPresetPalette(p)}
          >
            <div className="vp-preset-dots">
              <span style={{ background: p.primary }} />
              <span style={{ background: p.secondary }} />
              <span style={{ background: p.accent }} />
            </div>
            <span className="vp-preset-name">{p.name}</span>
          </button>
        ))}
      </div>

      <span className="vp-pane-title">8 Sắc màu truyền thống:</span>
      <div className="vp-trad-grid">
        {TRADITIONAL_COLORS.slice(0, 8).map(c => (
          <button
            key={c.id}
            type="button"
            className={`vp-trad-btn ${primaryColor.toLowerCase() === c.hex.toLowerCase() ? 'is-active' : ''}`}
            onClick={() => {
              setPrimaryColor(c.hex);
              setSelectedPresetId(null);
            }}
            title={`${c.name} (${c.element}): ${c.meaning}`}
          >
            <span className="vp-trad-dot" style={{ background: c.hex }} />
            <div className="vp-trad-info">
              <strong>{c.name}</strong>
              <small>{c.element}</small>
            </div>
          </button>
        ))}
      </div>

      {/* Tự tinh chỉnh từng phần */}
      <div className="vp-custom-colors">
        <div className="vp-color-picker-box">
          <label>Tà áo chính</label>
          <div className="vp-color-input-wrap">
            <input 
              type="color" 
              value={primaryColor} 
              onChange={(e) => { setPrimaryColor(e.target.value); setSelectedPresetId(null); }}
            />
            <span className="vp-color-hex">{primaryColor}</span>
          </div>
        </div>
        <div className="vp-color-picker-box">
          <label>Quần lụa / Cổ</label>
          <div className="vp-color-input-wrap">
            <input 
              type="color" 
              value={secondaryColor} 
              onChange={(e) => { setSecondaryColor(e.target.value); setSelectedPresetId(null); }}
            />
            <span className="vp-color-hex">{secondaryColor}</span>
          </div>
        </div>
        <div className="vp-color-picker-box">
          <label>Viền / Yếm</label>
          <div className="vp-color-input-wrap">
            <input 
              type="color" 
              value={accentColor} 
              onChange={(e) => { setAccentColor(e.target.value); setSelectedPresetId(null); }}
            />
            <span className="vp-color-hex">{accentColor}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaterialsPane = () => (
    <div className="vp-pane-block animate-fade-in">
      <span className="vp-pane-title">Chất liệu dệt truyền thống:</span>
      <div className="vp-materials-list">
        {MATERIALS.map(m => (
          <button
            key={m.id}
            type="button"
            className={`vp-material-item ${material === m.name ? 'is-active' : ''}`}
            onClick={() => setMaterial(m.name)}
          >
            <span style={{ fontSize: '18px' }}>{m.icon}</span>
            <div className="vp-material-body">
              <strong>{m.name}</strong>
              <p>{m.desc}</p>
            </div>
            {material === m.name && <span className="vp-material-check">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAccessoriesPane = () => (
    <div className="vp-pane-block animate-fade-in">
      <span className="vp-pane-title">
        Phụ kiện phối kèm ({compatibleAccessories.length} mẫu):
      </span>
      <div className="vp-accessories-grid">
        {compatibleAccessories.map(acc => {
          const isPicked = selectedAccessories.includes(acc.id);
          return (
            <button
              key={acc.id}
              type="button"
              className={`vp-accessory-btn ${isPicked ? 'is-active' : ''}`}
              onClick={() => handleToggleAccessory(acc.id)}
            >
              <div className="vp-accessory-main">
                <span className="vp-accessory-icon">{acc.icon}</span>
                <div className="vp-accessory-text">
                  <strong>{acc.name}</strong>
                  <small>{acc.categoryName}</small>
                </div>
              </div>
              <span className="vp-accessory-badge">{isPicked ? '✓' : '+'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderFitPane = () => (
    <div className="vp-pane-block animate-fade-in">
      <div className="vp-fit-group">
        <span className="vp-pane-title">Độ ôm tà áo:</span>
        <div className="vp-pills">
          {['Vừa vặn', 'Thoải mái', 'Ôm nhẹ'].map(opt => (
            <button
              key={opt}
              type="button"
              className={`vp-pill-btn ${fit === opt ? 'is-active' : ''}`}
              onClick={() => setFit(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="vp-fit-group">
        <span className="vp-pane-title">Độ dài tà áo:</span>
        <div className="vp-pills">
          {['Dài (chấm gót)', 'Lửng (ngang bắp chân)', 'Ngắn (cách tân)'].map(opt => (
            <button
              key={opt}
              type="button"
              className={`vp-pill-btn ${length === opt ? 'is-active' : ''}`}
              onClick={() => setLength(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="vp-fit-group">
        <span className="vp-pane-title">Chiều cao của bạn (cm):</span>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="vp-height-input"
          min="140"
          max="200"
        />
      </div>
    </div>
  );

  // Controls JSX (Left column)
  const controlsNode = (
    <div>
      <div className="vp-control-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectorTab === 'colors'}
          className={`vp-control-tab-btn ${selectorTab === 'colors' ? 'is-active' : ''}`}
          onClick={() => setSelectorTab('colors')}
        >
          Màu sắc
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectorTab === 'materials'}
          className={`vp-control-tab-btn ${selectorTab === 'materials' ? 'is-active' : ''}`}
          onClick={() => setSelectorTab('materials')}
        >
          Chất liệu
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectorTab === 'accessories'}
          className={`vp-control-tab-btn ${selectorTab === 'accessories' ? 'is-active' : ''}`}
          onClick={() => setSelectorTab('accessories')}
        >
          Phụ kiện ({selectedAccessories.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectorTab === 'fit'}
          className={`vp-control-tab-btn ${selectorTab === 'fit' ? 'is-active' : ''}`}
          onClick={() => setSelectorTab('fit')}
        >
          Phom dáng
        </button>
      </div>

      <div className="vp-control-body">
        {selectorTab === 'colors' && renderColorsPane()}
        {selectorTab === 'materials' && renderMaterialsPane()}
        {selectorTab === 'accessories' && renderAccessoriesPane()}
        {selectorTab === 'fit' && renderFitPane()}
      </div>
    </div>
  );

  // Stage JSX (Center mannequin)
  const stageNode = (
    <OutfitPreview
      selectedOutfit={selectedOutfit}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      selectedAccessories={compatibleAccessories.filter(a => selectedAccessories.includes(a.id))}
      harmonyScore={harmonyResult.harmonyScore}
      fit={fit}
      length={length}
      fabricTexture={material.includes('Lụa') ? 'silk' : material.includes('Gấm') ? 'brocade' : 'linen'}
      variant="stage"
    />
  );

  // Meaning & Sources
  const meaningNode = selectedOutfit?.y_nghia ? (
    <p>{selectedOutfit.y_nghia}</p>
  ) : null;

  const sourcesNode = selectedOutfit?.citations && selectedOutfit.citations.length > 0 ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <strong style={{ color: 'var(--vang-nhat)', fontSize: '11.5px' }}>📚 Tư liệu khảo chứng:</strong>
      {selectedOutfit.citations.map((cite, i) => (
        <div key={i} style={{ fontSize: '11px', color: 'var(--chu-mo)' }}>
          • <strong>{cite.sourceName}</strong> {cite.author && `— ${cite.author}`} {cite.pages && `(${cite.pages})`}
          {cite.url && (
            <a
              href={cite.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--vang)', marginLeft: '6px', textDecoration: 'underline' }}
            >
              [Tra cứu ↗]
            </a>
          )}
        </div>
      ))}
    </div>
  ) : selectedOutfit?.nguon_tham_khao ? (
    <small style={{ color: 'var(--chu-mo)' }}>
      Nguồn: {selectedOutfit.nguon_tham_khao}
    </small>
  ) : null;

  const paletteList = [
    { label: 'Tà áo chính', color: primaryColor },
    { label: 'Quần lụa / Cổ', color: secondaryColor },
    { label: 'Viền / Yếm', color: accentColor },
  ];

  const accessoriesList = compatibleAccessories
    .filter(a => selectedAccessories.includes(a.id))
    .map(a => `${a.icon || '✨'} ${a.name}`);

  return (
    <section className="outfit-customizer" id="outfit-customizer">
      <StudioLayout
        outfitName={selectedOutfit?.ten || "Áo dài truyền thống"}
        subtitle={`${selectedOutfit?.vung_mien || "Cả ba miền"} • ${material}`}
        harmony={harmonyResult.harmonyScore}
        harmonyNote={harmonyResult.explanation}
        culturalWarnings={culturalWarnings}
        onApplyWarningFix={handleApplyWarningFix}
        facePhoto={preview}
        onPickFace={() => setIsUploadModalOpen(true)}
        onClearFace={() => {
          setPreview(null);
          setUserPhoto(null);
          setSelectedAvatar('female_1');
        }}
        models={SAMPLE_AVATARS}
        activeModel={selectedAvatar}
        onPickModel={(id) => {
          setSelectedAvatar(id);
          setPreview(null);
          setUserPhoto(null);
        }}
        palette={paletteList}
        accessories={accessoriesList}
        view={stageView}
        onViewChange={(v) => setStageView(v)}
        onFullscreen={() => setIsFullscreenPreview(true)}
        controls={controlsNode}
        stage={stageNode}
        meaning={meaningNode}
        sources={sourcesNode}
        onGenerate={handleFinishAndGenerate}
        isGenerating={isGenerating}
      />

      {/* Fullscreen Mannequin Modal */}
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
                fabricTexture={material.includes('Lụa') ? 'silk' : material.includes('Gấm') ? 'brocade' : 'linen'}
              />
            </div>
          </div>
        </div>
      )}

      {/* User Photo Upload Guidance Modal */}
      <UserPhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onConfirmPhoto={handleConfirmUserPhoto}
      />
    </section>
  );
}
