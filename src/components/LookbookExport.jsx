import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { COSTUME_META } from '../data/costumeMeta';
import './LookbookExport.css';

const TEMPLATES = [
  { id: 'vogue', name: 'Tạp chí Di sản', icon: '📰', desc: 'Bìa tạp chí thời trang cao cấp Vogue Heritage' },
  { id: 'cinema', name: 'Màn ảnh Điện ảnh', icon: '🎬', desc: 'Tỉ lệ 16:9 viền đen & phụ đề điện ảnh sâu lắng' },
  { id: 'card', name: 'Thẻ bài Cổ phong', icon: '🃏', desc: 'Thẻ bài Ngũ hành viền vàng kim holographic' },
  { id: 'polaroid', name: 'Polaroid Kỷ yếu', icon: '📷', desc: 'Khung ảnh film hoài niệm lưu giữ thanh xuân' }
];

export default function LookbookExport({
  outfit,
  imageBase64,
  cultureInfo,
  colors,
  accessories = [],
  scene,
  onToast
}) {
  const cardRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState('vogue');
  const [imageFitMode, setImageFitMode] = useState('contain'); // 'contain' (vừa vặn, không bị cắt) | 'cover' (lấp đầy khung)
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const shareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  if (!outfit || !imageBase64) return null;

  const meta = COSTUME_META[outfit.id] || null;

  // Generate shareable URL with parameters
  const generateShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const accList = (accessories || []).map(a => typeof a === 'string' ? a : a.id).join(',');
    const params = new URLSearchParams({
      outfit: outfit.id,
      primary: colors?.primary || '#A4262C',
      secondary: colors?.secondary || '#C8A15A',
      accent: colors?.accent || '#FBF7F0',
      scene: scene || 'tet',
      acc: accList
    });
    return `${origin}${pathname}?${params.toString()}`;
  };

  const shareUrl = generateShareUrl();
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}&color=218-165-32&bgcolor=20-16-13`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('input');
        input.value = shareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      if (onToast) onToast('✓ Đã sao chép link bộ phối! Người nhận mở ra sẽ thấy đúng thiết kế này.');
    } catch (err) {
      console.error('Lỗi sao chép link:', err);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#14100D',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `viet-phuc-remix-${selectedTemplate}-${outfit.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      if (onToast) onToast('📥 Đã tải poster Lookbook HD thành công!');
    } catch (err) {
      console.error('Lỗi xuất lookbook:', err);
      alert('Không thể xuất ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (shareSupported) {
      try {
        await navigator.share({
          title: `Việt Phục Remix — ${outfit.ten}`,
          text: `Xem thiết kế phối đồ ${outfit.ten} của mình trên Việt Phục Remix 🇻🇳!`,
          url: shareUrl
        });
      } catch (shareErr) {
        if (shareErr.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const imageSrc = imageBase64.startsWith('http') ? imageBase64 : `data:image/png;base64,${imageBase64}`;

  return (
    <section className="lookbook-export" id="lookbook-export">
      <div className="lookbook-export__header animate-fade-in-up">
        <span className="section-badge">✨ Studio Lookbook Di Sản</span>
        <h2 className="lookbook-export__title">
          Đóng khung <span className="text-gradient">khoảnh khắc kiêu hãnh</span>
        </h2>
        <p className="lookbook-export__subtitle">
          Tùy chọn phong cách đóng khung nghệ thuật để tải ảnh chất lượng cao hoặc chia sẻ lên Story mạng xã hội
        </p>
      </div>

      {/* Template Selector Tabs */}
      <div className="template-selector-bar animate-fade-in-up">
        {TEMPLATES.map(tpl => (
          <button
            key={tpl.id}
            type="button"
            className={`template-tab-btn ${selectedTemplate === tpl.id ? 'active' : ''}`}
            onClick={() => setSelectedTemplate(tpl.id)}
          >
            <span className="template-tab-icon">{tpl.icon}</span>
            <div className="template-tab-text">
              <span className="template-tab-name">{tpl.name}</span>
              <span className="template-tab-desc">{tpl.desc}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tùy chỉnh căn chỉnh ảnh (Fit Mode) */}
      <div className="lookbook-fit-bar animate-fade-in">
        <span className="fit-bar-label">Căn khung ảnh:</span>
        <div className="fit-toggle-group">
          <button
            type="button"
            className={`fit-toggle-btn ${imageFitMode === 'contain' ? 'active' : ''}`}
            onClick={() => setImageFitMode('contain')}
            title="Hiển thị trọn vẹn toàn bộ người & trang phục, không bị cắt xén bất kỳ chi tiết nào"
          >
            🖼️ Vừa vặn trọn vẹn (Không cắt)
          </button>
          <button
            type="button"
            className={`fit-toggle-btn ${imageFitMode === 'cover' ? 'active' : ''}`}
            onClick={() => setImageFitMode('cover')}
            title="Lấp đầy toàn khung hình (tự động căn chuẩn khuôn mặt & mũ/khăn)"
          >
            🔍 Cận cảnh sắc nét
          </button>
        </div>
      </div>

      {/* Capturable Poster Area */}
      <div className="lookbook-card-stage animate-fade-in" style={{ position: 'relative' }}>
        
        {/* Ghost Action Buttons Overlay (Top Right Corner) */}
        <div className="lookbook-actions-overlay">
          <button
            className="ghost-action-btn"
            onClick={handleDownload}
            disabled={isExporting}
            title="Tải Poster HD (2x Retina)"
          >
            {isExporting ? '⏳' : '📥'}
          </button>
          <button
            className="ghost-action-btn"
            onClick={handleCopyLink}
            title="Sao chép link bộ phối"
          >
            {copiedLink ? '✓' : '🔗'}
          </button>
          {shareSupported && (
            <button
              className="ghost-action-btn"
              onClick={handleShare}
              disabled={isExporting}
              title="Sống ảo lên MXH"
            >
              📤
            </button>
          )}
        </div>
        {/* TEMPLATE 1: HERITAGE VOGUE */}
        {selectedTemplate === 'vogue' && (
          <div className="poster-frame poster-frame--vogue" ref={cardRef}>
            <div className="vogue-header">
              <span className="vogue-issue">ISSUE NO. 2026 • AI ARENA SPECIAL EDITION</span>
              <h1 className="vogue-masthead">VIỆT PHỤC REMIX</h1>
              <div className="vogue-divider" />
            </div>

            <div className="vogue-main">
              <div className="vogue-photo-wrap">
                {imageFitMode === 'contain' && (
                  <div 
                    className="vogue-photo-backdrop" 
                    style={{ backgroundImage: `url(${imageSrc})` }} 
                  />
                )}
                <img 
                  src={imageSrc} 
                  alt={outfit.ten} 
                  crossOrigin="anonymous" 
                  className={`vogue-photo vogue-photo--${imageFitMode}`} 
                />
                <div className="vogue-overlay-badge">
                  <span className="badge-year">{outfit.era || 'Ngàn Năm Áo Mũ'}</span>
                  <span className="badge-region">{outfit.vung_mien}</span>
                </div>
              </div>

              <div className="vogue-content-column">
                <span className="vogue-kicker">{meta?.personaTitle || 'Di Sản Ngàn Năm'}</span>
                <h2 className="vogue-title">{outfit.ten}</h2>
                <p className="vogue-quote">"{meta?.funPraise || cultureInfo?.y_nghia_dien_giai?.slice(0, 110)}"</p>
                
                <div className="vogue-meta-details">
                  <div className="vogue-meta-row">
                    <span className="label">Chất liệu:</span>
                    <span className="val">{outfit.chat_lieu || 'Lụa tơ tằm & gấm dệt'}</span>
                  </div>
                  <div className="vogue-meta-row">
                    <span className="label">Ngũ hành:</span>
                    <span className="val">{meta?.element || 'Tương sinh cát tường'}</span>
                  </div>
                  <div className="vogue-meta-row">
                    <span className="label">Thuê tham khảo:</span>
                    <span className="val highlight">{meta?.rentalEstimate || '180.000đ/ngày'}</span>
                  </div>
                </div>

                <div className="vogue-footer-strip">
                  <div className="vogue-barcode">
                    <div className="fake-barcode" />
                    <span>VP-RMX-2026-HERITAGE</span>
                  </div>
                  <div className="vogue-qr">
                    <img src={qrCodeUrl} alt="QR Code" className="qr-img" crossOrigin="anonymous" />
                    <span className="qr-hint">Quét để xem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 2: CINEMATIC 16:9 */}
        {selectedTemplate === 'cinema' && (
          <div className="poster-frame poster-frame--cinema" ref={cardRef}>
            <div className="cinema-top-bar">
              <span className="cinema-rec-dot" />
              <span className="cinema-brand">VIETNAM HERITAGE CINEMA 4K</span>
              <span className="cinema-tc">01 : 45 : 20 : 08</span>
            </div>

            <div className="cinema-body">
              {imageFitMode === 'contain' && (
                <div 
                  className="cinema-backdrop" 
                  style={{ backgroundImage: `url(${imageSrc})` }} 
                />
              )}
              <img 
                src={imageSrc} 
                alt={outfit.ten} 
                crossOrigin="anonymous" 
                className={`cinema-photo cinema-photo--${imageFitMode}`} 
              />
              <div className="cinema-gradient-scrim" />
              
              <div className="cinema-subtitles">
                <p className="cinema-dialogue">
                  "Khoác lên mình dáng hình non nước ngàn năm — {outfit.ten}"
                </p>
                <span className="cinema-translation">
                  [{meta?.personaTitle || 'Vương Triều Di Sản'} • {outfit.vung_mien}]
                </span>
              </div>
            </div>

            <div className="cinema-bottom-bar">
              <div className="cinema-meta-tags">
                <span className="c-tag">ASPECT 16:9</span>
                <span className="c-tag">GEMINI AI VISION</span>
                <span className="c-tag">TURNTABLE 360°</span>
              </div>
              <div className="cinema-qr-inline">
                <img src={qrCodeUrl} alt="QR" className="qr-mini" crossOrigin="anonymous" />
                <span>vietphucremix.app</span>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 3: HERITAGE TRADING CARD */}
        {selectedTemplate === 'card' && (
          <div className="poster-frame poster-frame--card" ref={cardRef}>
            <div className="card-outer-gold">
              <div className="card-inner-box">
                <div className="card-top-header">
                  <span className="card-element-gem">🔮 {meta?.element?.split('(')[0] || 'Ngũ Hành'}</span>
                  <h3 className="card-char-name">{outfit.ten}</h3>
                  <span className="card-rarity">SSR ★★★★★</span>
                </div>

                <div className="card-artwork-frame">
                  {imageFitMode === 'contain' && (
                    <div 
                      className="card-art-backdrop" 
                      style={{ backgroundImage: `url(${imageSrc})` }} 
                    />
                  )}
                  <img 
                    src={imageSrc} 
                    alt={outfit.ten} 
                    crossOrigin="anonymous" 
                    className={`card-art card-art--${imageFitMode}`} 
                  />
                  <div className="card-shine-effect" />
                  <span className="card-art-caption">{meta?.personaTitle || 'Cổ Phong'}</span>
                </div>

                <div className="card-stats-grid">
                  <div className="card-stat">
                    <span className="stat-label">Hòa sắc</span>
                    <span className="stat-value">98/100</span>
                  </div>
                  <div className="card-stat">
                    <span className="stat-label">Điển chế</span>
                    <span className="stat-value">Chuẩn</span>
                  </div>
                  <div className="card-stat">
                    <span className="stat-label">Gen Z Vibe</span>
                    <span className="stat-value">100★</span>
                  </div>
                </div>

                <p className="card-flavor-text">
                  "{meta?.funPraise || outfit.mo_ta_ngan}"
                </p>

                <div className="card-bottom-bar">
                  <span>SERIES 2026 • AI ARENA</span>
                  <div className="card-qr-box">
                    <img src={qrCodeUrl} alt="QR" className="card-qr-img" crossOrigin="anonymous" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEMPLATE 4: RETRO POLAROID */}
        {selectedTemplate === 'polaroid' && (
          <div className="poster-frame poster-frame--polaroid" ref={cardRef}>
            <div className="washi-tape washi-tape--left" />
            <div className="washi-tape washi-tape--right" />
            
            <div className="polaroid-photo-area">
              {imageFitMode === 'contain' && (
                <div 
                  className="polaroid-photo-backdrop" 
                  style={{ backgroundImage: `url(${imageSrc})` }} 
                />
              )}
              <img 
                src={imageSrc} 
                alt={outfit.ten} 
                crossOrigin="anonymous" 
                className={`polaroid-photo polaroid-photo--${imageFitMode}`} 
              />
              <div className="polaroid-stamp">ĐÃ DUYỆT DI SẢN</div>
            </div>

            <div className="polaroid-caption-area">
              <p className="polaroid-handwriting">{outfit.ten} — {meta?.personaTitle || 'Thanh Xuân'}</p>
              <div className="polaroid-subline">
                <span>📍 {meta?.photoSpots?.[0]?.name || outfit.vung_mien}</span>
                <span>📅 Ngày ghi lại: {new Date().toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="polaroid-qr-wrap">
                <img src={qrCodeUrl} alt="QR" className="qr-mini" crossOrigin="anonymous" />
                <small>Quét để phối lại</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
