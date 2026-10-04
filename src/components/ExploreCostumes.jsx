import { useState, useMemo } from 'react';
import { getAllOutfits } from '../services/cultureData';
import './ExploreCostumes.css';

export default function ExploreCostumes({ onSelectForMixer }) {
  const allOutfits = useMemo(() => getAllOutfits(), []);
  
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalOutfit, setActiveModalOutfit] = useState(null);
  const [modalTab, setModalTab] = useState('history');

  // Filter outfits
  const filteredOutfits = useMemo(() => {
    return allOutfits.filter(item => {
      // Search
      const matchesSearch = item.ten.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.mo_ta_ngan.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Region
      if (selectedRegion !== 'all') {
        const matchesRegion = item.vung_mien.toLowerCase().includes(selectedRegion.toLowerCase()) ||
                              item.vung_mien === 'Cả ba miền';
        if (!matchesRegion) return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'all' && item.do_kho !== selectedDifficulty) {
        return false;
      }

      // Gender
      if (selectedGender !== 'all') {
        if (item.gioi_tinh !== selectedGender && item.gioi_tinh !== 'cả hai') {
          return false;
        }
      }

      return true;
    });
  }, [allOutfits, searchQuery, selectedRegion, selectedDifficulty, selectedGender]);

  const handleOpenDetail = (outfit) => {
    setActiveModalOutfit(outfit);
    setModalTab('history');
  };

  const handleStartMix = (outfit) => {
    if (onSelectForMixer) {
      onSelectForMixer(outfit);
    }
    setActiveModalOutfit(null);
  };

  return (
    <section className="explore-section" id="explore-section">
      <div className="section-header text-center animate-fade-in-up">
        <span className="section-badge">Bảo tàng số</span>
        <h2 className="section-title">
          Khám phá <span className="text-gradient">Việt Phục</span>
        </h2>
        <p className="section-subtitle">
          Tìm hiểu nguồn gốc, ý nghĩa văn hóa và vẻ đẹp nghìn năm của y phục truyền thống Việt Nam
        </p>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="explore-filters glass-panel animate-fade-in-up stagger-1">
        <div className="search-bar">
          <svg className="search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text"
            placeholder="Tìm kiếm theo tên áo, chất liệu, triều đại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <div className="filter-chips-row">
          <div className="filter-group">
            <span className="filter-label">Vùng miền:</span>
            <div className="chips">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'Bắc', label: 'Bắc Bộ' },
                { id: 'Trung', label: 'Trung Bộ' },
                { id: 'Nam', label: 'Nam Bộ' }
              ].map(chip => (
                <button
                  key={chip.id}
                  className={`chip ${selectedRegion === chip.id ? 'chip--active' : ''}`}
                  onClick={() => setSelectedRegion(chip.id)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Độ phức tạp:</span>
            <div className="chips">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'Dễ phối', label: 'Dễ phối' },
                { id: 'Trung bình', label: 'Tiêu chuẩn' },
                { id: 'Nâng cao', label: 'Cung đình' }
              ].map(d => (
                <button
                  key={d.id}
                  className={`chip ${selectedDifficulty === d.id ? 'chip--active' : ''}`}
                  onClick={() => setSelectedDifficulty(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Đối tượng:</span>
            <div className="chips">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'nữ', label: 'Nữ' },
                { id: 'nam', label: 'Nam' }
              ].map(g => (
                <button
                  key={g.id}
                  className={`chip ${selectedGender === g.id ? 'chip--active' : ''}`}
                  onClick={() => setSelectedGender(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid danh sách trang phục */}
      <div className="costumes-grid">
        {filteredOutfits.map((item, index) => (
          <article 
            key={item.id} 
            className="costume-card glass-card animate-fade-in-up"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="costume-card__header">
              <div className="costume-card__tags">
                <span className="costume-tag tag-region">{item.vung_mien}</span>
                <span className={`costume-tag tag-difficulty ${
                  item.do_kho === 'Dễ phối' ? 'diff-easy' : 
                  item.do_kho === 'Nâng cao' ? 'diff-hard' : 'diff-med'
                }`}>
                  {item.do_kho || 'Dễ phối'}
                </span>
              </div>
              <span className="costume-era">{item.era}</span>
            </div>

            <h3 className="costume-card__title">{item.ten}</h3>

            <div className="costume-card__colors">
              <span className="color-label">Sắc màu:</span>
              <div className="color-dots">
                {item.mau_dac_trung.slice(0, 4).map((c, i) => (
                  <span key={i} className="color-badge" title={c}>{c}</span>
                ))}
              </div>
            </div>

            {/* Hover-reveal drawer for description and buttons */}
            <div className="costume-card__hover-drawer">
              <p className="costume-card__desc">{item.mo_ta_ngan}</p>

              <div className="costume-card__actions">
                <button 
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleOpenDetail(item)}
                >
                  Tìm hiểu
                </button>
                <button 
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleStartMix(item)}
                >
                  Phối đồ ngay
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredOutfits.length === 0 && (
        <div className="empty-state glass-panel text-center">
          <h3>Không tìm thấy trang phục phù hợp</h3>
          <p>Hãy thử xóa bớt bộ lọc hoặc nhập từ khóa tìm kiếm khác nhé!</p>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => { setSelectedRegion('all'); setSelectedDifficulty('all'); setSelectedGender('all'); setSearchQuery(''); }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Modal chi tiết trang phục */}
      {activeModalOutfit && (
        <div className="modal-backdrop" onClick={() => setActiveModalOutfit(null)}>
          <div className="modal-container glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModalOutfit(null)}>✕</button>

            <div className="modal-header">
              <div className="modal-meta">
                <span className="costume-tag tag-region">{activeModalOutfit.vung_mien}</span>
                <span className="costume-tag tag-difficulty">{activeModalOutfit.do_kho}</span>
                <span className="costume-era">{activeModalOutfit.era}</span>
              </div>
              <h2 className="modal-title">{activeModalOutfit.ten}</h2>
            </div>

            {/* Tabs */}
            <div className="modal-tabs">
              <button 
                type="button"
                className={`tab-btn ${modalTab === 'history' ? 'tab-btn--active' : ''}`}
                onClick={() => setModalTab('history')}
              >
                Nguồn gốc & Ý nghĩa
              </button>
              <button 
                type="button"
                className={`tab-btn ${modalTab === 'styling' ? 'tab-btn--active' : ''}`}
                onClick={() => setModalTab('styling')}
              >
                Chất liệu & Phom dáng
              </button>
              <button 
                type="button"
                className={`tab-btn ${modalTab === 'accessories' ? 'tab-btn--active' : ''}`}
                onClick={() => setModalTab('accessories')}
              >
                Phụ kiện đồng bộ
              </button>
              <button 
                type="button"
                className={`tab-btn ${modalTab === 'rules' ? 'tab-btn--active' : ''}`}
                onClick={() => setModalTab('rules')}
              >
                Lưu ý văn hóa
              </button>
            </div>

            <div className="modal-content">
              {modalTab === 'history' && (
                <div className="tab-pane animate-fade-in">
                  <h4>Ý nghĩa văn hóa</h4>
                  <p className="tab-text">{activeModalOutfit.y_nghia}</p>
                  
                  <h4>Bối cảnh sử dụng phù hợp</h4>
                  <div className="chips-tags">
                    {activeModalOutfit.boi_canh_phu_hop.map((bc, idx) => (
                      <span key={idx} className="event-chip">{bc}</span>
                    ))}
                  </div>

                  <div className="reference-box">
                    <strong>Nguồn tư liệu tham khảo:</strong>
                    <p>{activeModalOutfit.nguon_tham_khao}</p>
                  </div>
                </div>
              )}

              {modalTab === 'styling' && (
                <div className="tab-pane animate-fade-in">
                  <h4>Chất liệu vải truyền thống</h4>
                  <p className="tab-text">{activeModalOutfit.chat_lieu}</p>

                  <h4>Bảng màu đặc trưng</h4>
                  <div className="color-pills-list">
                    {activeModalOutfit.mau_dac_trung.map((color, idx) => (
                      <div key={idx} className="color-pill-item">
                        <span className="dot" />
                        <span className="name">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'accessories' && (
                <div className="tab-pane animate-fade-in">
                  <h4>Phụ kiện tôn dáng</h4>
                  <ul className="accessories-list">
                    {activeModalOutfit.phu_kien_di_kem.map((pk, idx) => (
                      <li key={idx} className="acc-item">
                        <span className="acc-bullet">•</span>
                        <span>{pk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {modalTab === 'rules' && (
                <div className="tab-pane animate-fade-in">
                  <h4>Điều nên & Không nên khi mặc</h4>
                  {activeModalOutfit.canh_bao_phoi && activeModalOutfit.canh_bao_phoi.length > 0 ? (
                    <div className="warnings-list">
                      {activeModalOutfit.canh_bao_phoi.map((cb, idx) => (
                        <div key={idx} className={`warning-item warning-item--${cb.type || 'caution'}`}>
                          <strong>{cb.type === 'warning' ? 'Khuyến nghị tránh:' : 'Lưu ý:'}</strong>
                          <p>{cb.ly_do}</p>
                          {cb.suggestion && <p className="sug">Gợi ý: {cb.suggestion}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="tab-text">Trang phục này linh hoạt, rất dễ phối và ít kiêng kỵ khắt khe.</p>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => handleStartMix(activeModalOutfit)}
              >
                Bắt đầu phối đồ với bộ này
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
