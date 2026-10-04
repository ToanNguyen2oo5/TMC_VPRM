import { useState } from 'react';
import './AppLogo.css';

export const LOGO_VARIANTS = {
  emblem: {
    id: 'emblem',
    name: 'Biểu Tượng Sen Vàng & Giao Lĩnh Tân Thời',
    shortName: 'Emblem Tân Thời',
    src: '/src/assets/images/vietphuc_remix_logo_1791040969620.jpg',
    description: 'Sự hòa quyện giữa đài sen vàng cung đình và nếp gấp vạt chéo Áo Giao Lĩnh / Nhật Bình, kết hợp hình khối hiện đại đại diện cho tinh thần Remix của thế hệ trẻ.',
  },
  crest: {
    id: 'crest',
    name: 'Ấn Triện Hoàng Gia Triều Nguyễn',
    shortName: 'Ấn Triện Cung Đình',
    src: '/src/assets/images/vietphuc_logo_crest_1791040981262.jpg',
    description: 'Ấn triện tròn phong cách hoàng cung Huế với nền sơn mài chu sa thắm, vân mây triều đình dát vàng và họa tiết sen hoàng triều trang trọng, uy nghi.',
  },
};

export default function AppLogo({
  variant = 'emblem',
  size = 'md',
  showBadge = false,
  interactive = false,
  className = '',
  onClick,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(variant);

  const activeLogo = LOGO_VARIANTS[selectedVariant] || LOGO_VARIANTS.emblem;

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (interactive) {
      e.stopPropagation();
      setShowModal(true);
    }
  };

  const handleDownload = (logoSrc, name) => {
    const link = document.createElement('a');
    link.href = logoSrc;
    link.download = `viet-phuc-remix-logo-${name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    link.click();
  };

  return (
    <>
      <div
        className={`app-logo-wrapper app-logo-wrapper--${size} ${className} ${interactive ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
        title={interactive ? "Bấm để xem chi tiết nhận diện thương hiệu & tải Logo" : "Việt Phục Remix Logo"}
        role={interactive ? "button" : "img"}
        tabIndex={interactive ? 0 : -1}
      >
        <img
          src={activeLogo.src}
          alt="Việt Phục Remix Logo"
          className="app-logo-img"
          referrerPolicy="no-referrer"
        />
        {showBadge && <span className="app-logo-badge">VP</span>}
      </div>

      {showModal && (
        <div className="logo-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="logo-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="logo-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Đóng"
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)' }}>
                Thiết Kế Nhận Diện Thương Hiệu
              </span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '0.35rem', fontFamily: 'var(--font-serif)' }}>
                Logo <span className="text-gradient">Việt Phục Remix</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                Biểu tượng di sản y quan nghìn năm giao hòa công nghệ sáng tạo đương đại
              </p>
            </div>

            {/* Selector between variants */}
            <div className="logo-preview-row">
              {Object.values(LOGO_VARIANTS).map((item) => (
                <div
                  key={item.id}
                  className={`logo-choice-box ${selectedVariant === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedVariant(item.id)}
                >
                  <div className="app-logo-wrapper app-logo-wrapper--lg">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="app-logo-img"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="logo-choice-title">{item.shortName}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item.src, item.id);
                    }}
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                  >
                    ⬇ Tải Logo HD
                  </button>
                </div>
              ))}
            </div>

            {/* Design Philosophy & Symbolism */}
            <div className="logo-philosophy-grid">
              <div className="logo-philosophy-item">
                <h4>🪷 Hoa Sen Hoàng Triều</h4>
                <p>
                  Quốc hoa thanh khiết, tượng trưng cho cốt cách thanh cao và văn hóa Phật giáo thời Lý - Trần thịnh vượng.
                </p>
              </div>

              <div className="logo-philosophy-item">
                <h4>👘 Cổ Áo Giao Lĩnh & Nhật Bình</h4>
                <p>
                  Đường gấp vạt chéo và dải ngũ sắc cung đình tạo nên cấu trúc hình học hài hòa, tôn vinh dáng hình Việt phục.
                </p>
              </div>

              <div className="logo-philosophy-item">
                <h4>🔴 Sắc Đỏ Chu Sa & Vàng Đồng</h4>
                <p>
                  Màu sơn mài truyền thống kết hợp kim hoàng gia, phản ánh sự quý phái của cung đình và may mắn trong phong thủy Việt.
                </p>
              </div>

              <div className="logo-philosophy-item">
                <h4>⚡ Tinh Thần "Remix"</h4>
                <p>
                  Đường nét tối giản, hiện đại (modern minimalist emblem) để thế hệ Gen Z dễ dàng tiếp cận và tự hào lan tỏa di sản.
                </p>
              </div>
            </div>

            <div className="logo-actions-bar">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleDownload(activeLogo.src, selectedVariant)}
              >
                💾 Tải Logo Đang Chọn ({activeLogo.shortName})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
