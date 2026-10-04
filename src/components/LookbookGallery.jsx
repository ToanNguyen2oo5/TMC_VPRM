import { useState, useEffect } from 'react';
import './LookbookGallery.css';

const DEFAULT_TRENDING_LOOKS = [
  {
    id: 'trending_1',
    outfitName: 'Áo dài đỏ son Tết Phú Quý',
    scene: 'Tết Nguyên Đán',
    region: 'Cả ba miền',
    colors: { primary: '#B22222', secondary: '#DAA520', accent: '#FAF9F6' },
    accessories: ['Nón bài thơ', 'Kiềng bạc hoa sen', 'Guốc mộc sơn'],
    scores: { total: 95, harmony: 95, culture: 98, genZ: 90 },
    image: '/generated/ao_dai_hue_0deg.png',
    likes: 128,
    isPreset: true
  },
  {
    id: 'trending_2',
    outfitName: 'Áo tứ thân Kinh Bắc Hội Lim',
    scene: 'Lễ hội truyền thống',
    region: 'Bắc Bộ',
    colors: { primary: '#8D6E63', secondary: '#B22222', accent: '#DAA520' },
    accessories: ['Nón quai thao', 'Yếm đào', 'Thắt lưng bao xanh'],
    scores: { total: 92, harmony: 90, culture: 96, genZ: 88 },
    image: '/generated/ao_tu_than_0deg.png',
    likes: 95,
    isPreset: true
  },
  {
    id: 'trending_3',
    outfitName: 'Áo Nhật Bình Hoàng Gia Cung Đình',
    scene: 'Chụp ảnh di sản / Hỷ sự',
    region: 'Trung Bộ (Huế)',
    colors: { primary: '#DAA520', secondary: '#B22222', accent: '#00897B' },
    accessories: ['Khăn vành dây', 'Hài thêu hoa', 'Trâm ngọc cài tóc'],
    scores: { total: 96, harmony: 96, culture: 99, genZ: 92 },
    image: '/generated/ao_nhat_binh_0deg.png',
    likes: 215,
    isPreset: true
  },
  {
    id: 'trending_4',
    outfitName: 'Áo bà ba Sông Nước Dạo Phố',
    scene: 'Dạo phố / Kỷ yếu',
    region: 'Nam Bộ',
    colors: { primary: '#1C1C1C', secondary: '#FAF9F6', accent: '#008080' },
    accessories: ['Khăn rằn Nam Bộ', 'Nón lá', 'Guốc mộc'],
    scores: { total: 89, harmony: 88, culture: 94, genZ: 85 },
    image: '/generated/ao_ba_ba_nam_bo_0deg.png',
    likes: 76,
    isPreset: true
  }
];

export default function LookbookGallery({ savedOutfits = [], onRemoveFromLookbook, onSelectOutfit }) {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'trending'
  const [likesMap, setLikesMap] = useState({});

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikesMap(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const displayList = activeTab === 'saved' ? savedOutfits : DEFAULT_TRENDING_LOOKS;

  return (
    <section className="lookbook-gallery-section" id="lookbook-section">
      <div className="section-header text-center animate-fade-in-up">
        <span className="section-badge">Bộ sưu tập</span>
        <h2 className="section-title">
          Lookbook <span className="text-gradient">Việt Phục</span>
        </h2>
        <p className="section-subtitle">
          Lưu giữ những khoảnh khắc phối đồ rực rỡ và khám phá các set đồ trending từ cộng đồng Gen Z
        </p>
      </div>

      {/* Tabs */}
      <div className="lookbook-tabs glass-panel animate-fade-in-up stagger-1">
        <button
          className={`lookbook-tab-btn ${activeTab === 'saved' ? 'lookbook-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          💖 Đã lưu của tôi ({savedOutfits.length})
        </button>
        <button
          className={`lookbook-tab-btn ${activeTab === 'trending' ? 'lookbook-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          🔥 Bộ phối Trending ({DEFAULT_TRENDING_LOOKS.length})
        </button>
      </div>

      {/* Empty State */}
      {activeTab === 'saved' && savedOutfits.length === 0 && (
        <div className="lookbook-empty glass-panel text-center animate-fade-in">
          <span className="empty-icon">📭</span>
          <h3>Lookbook cá nhân đang trống</h3>
          <p>Khi phối đồ tại tab Phối đồ, hãy bấm <strong>"Thêm vào Lookbook"</strong> để lưu lại các set đồ yêu thích của bạn tại đây nhé!</p>
        </div>
      )}

      {/* Grid */}
      <div className="lookbook-grid animate-fade-in">
        {displayList.map((item, idx) => {
          const currentLikes = (item.likes || 0) + (likesMap[item.id] || 0);
          const isLiked = !!likesMap[item.id];

          return (
            <article key={item.id || idx} className="lookbook-card glass-card">
              <div className="lookbook-card__media">
                <div className="lookbook-placeholder">
                  <span className="lookbook-placeholder-icon">👘</span>
                  <p className="lookbook-placeholder-title">{item.outfitName || item.outfit?.ten}</p>
                  <span className="lookbook-placeholder-sub">{item.region || item.scene || 'Di sản Việt Nam'}</span>
                </div>
                {item.image && (
                  <img 
                    src={item.image.startsWith('http') || item.image.startsWith('data:') || item.image.startsWith('/generated') ? item.image : `data:image/png;base64,${item.image}`} 
                    alt={item.outfitName || item.outfit?.ten}
                    className="lookbook-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}

                <div className="lookbook-badge-score">
                  ⭐ {item.scores?.total || item.evalScores?.totalScore || 90}/100
                </div>

                <button 
                  className={`like-btn ${isLiked ? 'like-btn--active' : ''}`}
                  onClick={(e) => handleLike(item.id, e)}
                  title="Yêu thích"
                >
                  ❤️ {currentLikes}
                </button>
              </div>

              <div className="lookbook-card__content">
                <div className="lookbook-tags">
                  <span className="tag-scene">📍 {item.scene || item.event || 'Tự do'}</span>
                  <span className="tag-region">{item.region || item.outfit?.vung_mien}</span>
                </div>

                <h3 className="lookbook-title">{item.outfitName || item.outfit?.ten}</h3>

                {/* Bảng màu */}
                {item.colors && (
                  <div className="lookbook-colors">
                    <span className="colors-label">Màu phối:</span>
                    <div className="dots">
                      <span className="dot" style={{ background: item.colors.primary }} />
                      <span className="dot" style={{ background: item.colors.secondary }} />
                      <span className="dot" style={{ background: item.colors.accent }} />
                    </div>
                  </div>
                )}

                {/* Phụ kiện */}
                {item.accessories && (
                  <div className="lookbook-accessories">
                    <span className="acc-label">Phụ kiện:</span>
                    <p className="acc-text">
                      {Array.isArray(item.accessories) 
                        ? item.accessories.map(a => typeof a === 'string' ? a : a.name).join(', ')
                        : 'Nón lá, Guốc mộc'}
                    </p>
                  </div>
                )}

                <div className="lookbook-card__actions">
                  {onSelectOutfit && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectOutfit(item)}
                    >
                      🔄 Thử lại set này
                    </button>
                  )}
                  {activeTab === 'saved' && onRemoveFromLookbook && (
                    <button 
                      className="btn btn-ghost btn-sm text-danger"
                      onClick={() => onRemoveFromLookbook(item.id)}
                    >
                      🗑️ Xóa
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
