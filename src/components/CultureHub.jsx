import { useState } from 'react';
import AppLogo, { LOGO_VARIANTS } from './AppLogo';
import './CultureHub.css';

const TIMELINE = [
  {
    era: 'Thế kỷ 11 – 14',
    title: 'Thời Lý – Trần: Cội Nguồn Cổ Phục',
    desc: 'Trang phục phổ biến là Áo giao lĩnh (cổ chéo vạt rộng) và Áo viên lĩnh (cổ tròn). Phong cách thanh tao, Phật giáo ảnh hưởng sâu sắc, chất vải tự nhiên từ tơ tằm, vải đũi mộc mạc và bền bỉ.',
    icon: '🏛️',
    costumes: ['Áo giao lĩnh', 'Áo viên lĩnh', 'Xiêm']
  },
  {
    era: 'Thế kỷ 15 – 18',
    title: 'Thời Lê Sơ – Lê Trung Hưng: Định Chế Triều Nghi',
    desc: 'Luật lệ trang phục được định hình nghiêm cẩn theo quan chế. Áo giao lĩnh vạt rộng, áo tràng vạt dài và hoa văn thêu rồng phượng thời Lê mang nét chạm khắc dứt khoát, uy dũng.',
    icon: '📜',
    costumes: ['Áo giao lĩnh Đại Việt', 'Áo tứ thân sơ khai']
  },
  {
    era: '1744 – 1945',
    title: 'Triều Nguyễn: Cái Nôi Của Áo Ngũ Thân & Áo Dài',
    desc: 'Chúa Nguyễn Phúc Khoát ban sắc dụ định chế y phục xứ Đàng Trong (1744), khai sinh ra Áo ngũ thân lập lĩnh (5 thân, 5 nút). Vua Minh Mạng thống nhất y phục toàn quốc. Cố đô Huế đạt đỉnh cao với Áo Nhật Bình chốn hoàng cung và Áo tấc trang nghiêm.',
    icon: '👑',
    costumes: ['Áo ngũ thân', 'Áo Nhật Bình', 'Áo tấc', 'Khăn vành dây']
  },
  {
    era: 'Thế kỷ 19 – 20',
    title: 'Giao Thoa Văn Hóa & Áo Dài Tân Thời',
    desc: 'Áo bà ba mộc mạc tỏa sáng khắp sông nước Nam Bộ. Thập niên 1930, họa sĩ Cát Tường (Lemur) và Lê Phổ cách tân áo ngũ thân thành Áo dài tân thời tôn dáng người phụ nữ hiện đại, trở thành quốc phục Việt Nam.',
    icon: '🎨',
    costumes: ['Áo dài Lemur / Lê Phổ', 'Áo bà ba Nam Bộ']
  },
  {
    era: 'Thế kỷ 21 (Gen Z)',
    title: 'Việt Phục Remix: Di Sản Trong Đời Sống Mới',
    desc: 'Thế hệ trẻ Gen Z và các hội nhóm phục dựng cổ phục đưa trang phục truyền thống trở lại rực rỡ trong lễ hội, kỷ yếu, MV âm nhạc và đời sống thường nhật thông qua lăng kính sáng tạo, văn minh.',
    icon: '✨',
    costumes: ['Áo dài cách tân', 'Cổ phục đương đại']
  }
];

const DOS_AND_DONTS = {
  dos: [
    {
      title: 'Tôn trọng cấu trúc nguyên bản',
      text: 'Giữ đúng đường xẻ tà, nếp gấp cổ áo và phom dáng đặc trưng của từng loại Việt phục.'
    },
    {
      title: 'Chọn màu sắc phù hợp sự kiện',
      text: 'Ưu tiên Đỏ son, Vàng hoàng gia cho ngày Tết/Cưới hỏi; Trắng ngà, Xanh ngọc cho kỷ yếu và dạo phố thanh lịch.'
    },
    {
      title: 'Phối phụ kiện đồng bộ vùng miền',
      text: 'Nón quai thao đi với Áo tứ thân Kinh Bắc; Khăn rằn đi với Áo bà ba Nam Bộ; Khăn vành dây đi với Áo Nhật Bình Huế.'
    },
    {
      title: 'Tìm hiểu câu chuyện lịch sử',
      text: 'Mỗi tà áo mang một câu chuyện văn hóa — hiểu rõ ý nghĩa sẽ giúp bạn mặc trang phục với sự tự tin và trang trọng nhất.'
    }
  ],
  donts: [
    {
      title: 'Tránh lai tạp văn hóa',
      text: 'Không kết hợp phụ kiện hoặc đường cắt xẻ của Hán phục, sườn xám Qipao, Kimono hay Hanbok vào Việt phục.'
    },
    {
      title: 'Tránh dùng trang phục cung đình cho việc thường nhật',
      text: 'Áo Nhật Bình là lễ phục cung đình tối cao, không nên mặc để dạo phố suồng sã hoặc đi giày thể thao hầm hố.'
    },
    {
      title: 'Tránh tông màu đen - trắng đơn điệu ngày Tết',
      text: 'Trong mỹ tục xưa, tổ hợp đen trắng trơn gắn liền với việc tang lễ, nên điểm xuyết sắc màu tươi tắn đầu năm.'
    },
    {
      title: 'Tránh cách tân làm mất bản sắc',
      text: 'Cách tân là điều đáng khuyến khích nhưng không nên cắt xén tà áo quá đà biến áo dài thành váy ngắn Tây âu.'
    }
  ]
};

const REFERENCES = [
  {
    title: 'Ngàn năm áo mũ',
    author: 'Trần Quang Đức (NXB Thế giới, 2013)',
    desc: 'Công trình khảo cứu lịch sử trang phục Việt Nam toàn diện từ thời Lý đến triều Nguyễn dựa trên tư liệu hiện vật và thư tịch cổ.'
  },
  {
    title: 'Trang phục Việt Nam',
    author: 'Đoàn Thị Tình (NXB Mỹ thuật, 2006)',
    desc: 'Tập hợp các nghiên cứu chuyên sâu về trang phục dân gian các vùng miền và quá trình biến chuyển của tà áo tứ thân, ngũ thân.'
  },
  {
    title: 'Áo dài Việt Nam',
    author: 'Trần Đình Sơn (NXB Văn hoá Nghệ thuật)',
    desc: 'Hành trình lịch sử và vẻ đẹp thẩm mỹ của chiếc áo dài truyền thống qua các thời kỳ lịch sử dân tộc.'
  },
  {
    title: 'Hệ thống Bảo tàng Di sản',
    author: 'Bảo tàng Lịch sử Quốc gia • Bảo tàng Cổ vật Cung đình Huế • Bảo tàng Áo dài',
    desc: 'Nơi lưu giữ các hiện vật cung đình, áo mão hoàng gia và trang phục nguyên bản qua các triều đại.'
  }
];

export default function CultureHub() {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'guide' | 'references'

  return (
    <section className="culture-hub" id="culture-hub">
      <div className="section-header text-center animate-fade-in-up">
        <span className="section-badge">Không gian tri thức</span>
        <h2 className="section-title">
          Văn Hóa <span className="text-gradient">Cổ Phục Việt</span>
        </h2>
        <p className="section-subtitle">
          Tìm về nghìn năm gấm vóc — Hiểu đúng để yêu và tự hào khoác lên mình tà áo Việt
        </p>
      </div>

      {/* Tabs */}
      <div className="hub-tabs glass-panel animate-fade-in-up stagger-1">
        <button 
          className={`hub-tab-btn ${activeTab === 'timeline' ? 'hub-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          ⏳ Dòng thời gian lịch sử
        </button>
        <button 
          className={`hub-tab-btn ${activeTab === 'guide' ? 'hub-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          🧭 Cẩm nang Nên & Không nên
        </button>
        <button 
          className={`hub-tab-btn ${activeTab === 'references' ? 'hub-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('references')}
        >
          📚 Nguồn tư liệu & Sách quý
        </button>
        <button 
          className={`hub-tab-btn ${activeTab === 'brand' ? 'hub-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('brand')}
        >
          ⚜️ Nhận diện Logo
        </button>
      </div>

      {/* Tab 1: Timeline */}
      {activeTab === 'timeline' && (
        <div className="timeline-container animate-fade-in">
          {TIMELINE.map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-marker">
                <span className="marker-icon">{item.icon}</span>
                <span className="marker-line" />
              </div>
              <div className="timeline-card glass-card">
                <span className="timeline-era">{item.era}</span>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
                <div className="timeline-costumes">
                  {item.costumes.map((c, i) => (
                    <span key={i} className="costume-pill">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Dos and Don'ts */}
      {activeTab === 'guide' && (
        <div className="guide-container animate-fade-in">
          <div className="guide-col glass-card dos-col">
            <h3 className="guide-title dos-title">
              <span>✅</span> NÊN LÀM KHI MẶC VIỆT PHỤC
            </h3>
            <div className="guide-items">
              {DOS_AND_DONTS.dos.map((item, idx) => (
                <div key={idx} className="guide-item">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="guide-col glass-card donts-col">
            <h3 className="guide-title donts-title">
              <span>🚫</span> NÊN TRÁNH (KIÊNG KỴ VĂN HÓA)
            </h3>
            <div className="guide-items">
              {DOS_AND_DONTS.donts.map((item, idx) => (
                <div key={idx} className="guide-item">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: References */}
      {activeTab === 'references' && (
        <div className="references-grid animate-fade-in">
          {REFERENCES.map((item, idx) => (
            <div key={idx} className="reference-card glass-card">
              <span className="book-icon">📖</span>
              <h3 className="book-title">{item.title}</h3>
              <p className="book-author">{item.author}</p>
              <p className="book-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Brand Identity & Logo */}
      {activeTab === 'brand' && (
        <div className="culture-brand-showcase animate-fade-in">
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
            <span className="section-badge">Hệ Thống Nhận Diện Thương Hiệu</span>
            <h3 style={{ fontSize: '1.8rem', margin: '0.6rem 0', fontFamily: 'var(--font-serif)' }}>
              Ý Niệm Thiết Kế Logo <span className="text-gradient">Việt Phục Remix</span>
            </h3>
            <p style={{ maxWidth: '720px', margin: '0 auto 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
              Logo được kiến tạo từ sự giao thoa tinh tế giữa đường nét cổ phục hoàng triều (Cổ Giao Lĩnh, Áo Nhật Bình) 
              và đóa sen vàng thanh khiết Đại Việt, bao bọc bởi ấn triện sơn mài chu sa uy nghi của văn hiến phương Nam.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', margin: '2rem 0' }}>
              {Object.values(LOGO_VARIANTS).map((item) => (
                <div key={item.id} className="glass-panel" style={{ padding: '1.75rem', borderRadius: '20px', minWidth: '260px', maxWidth: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AppLogo variant={item.id} size="xl" interactive={true} />
                  <h4 style={{ fontSize: '1.1rem', margin: '1rem 0 0.4rem', color: 'var(--color-gold)', fontWeight: 600 }}>{item.shortName}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', textAlign: 'center' }}>
                    {item.description}
                  </p>
                  <a
                    href={item.src}
                    download={`viet-phuc-remix-${item.id}.jpg`}
                    className="btn btn-primary btn-sm"
                    style={{ textDecoration: 'none' }}
                  >
                    ⬇ Tải Logo {item.shortName}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Design Pillars */}
          <div className="guide-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="guide-col glass-card">
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🪷</span> Hình Tượng Sen Vàng Đại Việt
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Hoa sen là quốc hoa, biểu tượng cho cốt cách kiên cường, "gần bùn mà chẳng hôi tanh mùi bùn". Cánh sen vươn cao tượng trưng cho sự trường tồn và thăng hoa của văn hóa dân tộc.
              </p>
            </div>

            <div className="guide-col glass-card">
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>👘</span> Cổ Áo Giao Lĩnh & Nhật Bình
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Cổ vạt chéo (Giao Lĩnh) và dải ngũ hành cổ áo Nhật Bình cung đình là những đặc điểm nhận diện sâu sắc nhất của trang phục truyền thống Việt Nam qua các triều đại Lý, Trần, Lê, Nguyễn.
              </p>
            </div>

            <div className="guide-col glass-card">
              <h4 style={{ color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🎨</span> Sắc Độ Chu Sa & Vàng Kim
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Đỏ chu sa tượng trưng cho hỷ khí, may mắn và nghệ thuật sơn mài truyền thống; kết hợp sắc hoàng kim quý phái, tạo nên ngôn ngữ thị giác sang trọng, đẳng cấp nhưng giàu chất thơ.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
