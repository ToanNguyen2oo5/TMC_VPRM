import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { COSTUME_META } from '../data/costumeMeta';
import './LookbookExport.css';

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
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const shareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  if (!outfit || !imageBase64) return null;

  const meta = COSTUME_META[outfit.id] || null;

  // Generate shareable URL with parameters (Priority 5)
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

  const handleCopyLink = async () => {
    const url = generateShareUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
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
      link.download = `viet-phuc-remix-${outfit.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      if (onToast) onToast('📥 Đã tải poster Lookbook thành công!');
    } catch (err) {
      console.error('Lỗi xuất lookbook:', err);
      alert('Không thể xuất ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl();
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

  return (
    <section className="lookbook-export" id="lookbook-export">
      <div className="lookbook-export__header animate-fade-in-up">
        <span className="lookbook-export__label">Heritage Poster</span>
        <h2 className="lookbook-export__title">
          <span className="text-gradient">Lưu & chia sẻ</span> phong cách của bạn
        </h2>
      </div>

      {/* Lookbook Poster Card (Capturable as HD Image) */}
      <div className="lookbook-card-wrapper animate-fade-in-up">
        <div className="lookbook-card" ref={cardRef}>
          {/* Card background overlay */}
          <div className="lookbook-card__bg" />

          {/* Image */}
          <div className="lookbook-card__image">
            <img
              src={imageBase64.startsWith('http') ? imageBase64 : `data:image/png;base64,${imageBase64}`}
              alt={outfit.ten}
              crossOrigin="anonymous"
            />
          </div>

          {/* Info */}
          <div className="lookbook-card__info">
            <div className="lookbook-card__brand">
              <img
                src="/src/assets/images/vietphuc_remix_logo_1791040969620.jpg"
                alt="Logo Việt Phục Remix"
                className="lookbook-card__logo-img"
                referrerPolicy="no-referrer"
              />
              <span className="lookbook-card__brand-text">Việt Phục Remix</span>
            </div>

            <h3 className="lookbook-card__name">{outfit.ten}</h3>
            <p className="lookbook-card__region">{outfit.vung_mien} • {outfit.era}</p>

            <div className="lookbook-card__colors">
              {outfit.mau_dac_trung.slice(0, 3).map((color, i) => (
                <span key={i} className="lookbook-card__color">{color}</span>
              ))}
            </div>

            {cultureInfo?.y_nghia_dien_giai && (
              <p className="lookbook-card__desc">
                {cultureInfo.y_nghia_dien_giai.slice(0, 140)}...
              </p>
            )}

            {/* Priority 7: Photo Spots & Rental Price */}
            {meta && (
              <div className="lookbook-card__meta-box">
                <div className="meta-spots">
                  <strong className="meta-heading">📸 Gợi ý địa điểm chụp:</strong>
                  <span className="meta-text">
                    {meta.photoSpots.map(s => s.name).join(' • ')}
                  </span>
                </div>
                <div className="meta-rental">
                  <strong className="meta-heading">🏷️ Thuê tham khảo:</strong>
                  <span className="meta-price">{meta.rentalEstimate}</span>
                  <small className="meta-note">(*Giá tham khảo theo thị trường)</small>
                </div>
              </div>
            )}
          </div>

          {/* Watermark */}
          <div className="lookbook-card__watermark">
            vietphucremix.app • Di sản & Đương đại
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="lookbook-export__actions animate-fade-in-up">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleDownload}
          disabled={isExporting}
          id="download-lookbook"
        >
          {isExporting ? '⏳ Đang xuất poster...' : '📥 Tải poster HD'}
        </button>

        <button
          className="btn btn-secondary btn-lg"
          onClick={handleCopyLink}
          id="copy-lookbook-link"
          title="Sao chép đường dẫn bộ phối"
        >
          {copiedLink ? '✓ Đã chép link' : '🔗 Sao chép link'}
        </button>

        {shareSupported && (
          <button
            className="btn btn-secondary btn-lg"
            onClick={handleShare}
            disabled={isExporting}
            id="share-lookbook"
          >
            📤 Chia sẻ
          </button>
        )}
      </div>
    </section>
  );
}
