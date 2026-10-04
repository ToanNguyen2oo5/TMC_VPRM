import { useState, useMemo } from 'react';
import { STORE_PARTNERS, GROUP_TIERS } from '../data/storePartnersData';
import { COSTUME_META } from '../data/costumeMeta';
import './RentalModal.css';

export default function RentalModal({ isOpen, onClose, outfit, onToast }) {
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' | 'group'
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedStoreId, setSelectedStoreId] = useState(STORE_PARTNERS[0].id);
  const [rentalDays, setRentalDays] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [pickupMethod, setPickupMethod] = useState('store'); // 'store' | 'delivery'
  const [hasStudentCard, setHasStudentCard] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Group booking state
  const [groupSize, setGroupSize] = useState(20);
  const [schoolName, setSchoolName] = useState('THPT Chuyên / Đại học');
  const [className, setClassName] = useState('12A1');
  const [repPhone, setRepPhone] = useState('');
  const [groupBookingSuccess, setGroupBookingSuccess] = useState(false);

  const meta = outfit?.id ? COSTUME_META[outfit.id] : null;
  const basePricePerDay = meta?.basePrice || 180000;

  // Filter stores
  const filteredStores = useMemo(() => {
    if (selectedCity === 'all') return STORE_PARTNERS;
    if (selectedCity === 'hn') return STORE_PARTNERS.filter(s => s.region === 'bac');
    if (selectedCity === 'hue') return STORE_PARTNERS.filter(s => s.region === 'trung');
    if (selectedCity === 'sg') return STORE_PARTNERS.filter(s => s.region === 'nam');
    return STORE_PARTNERS;
  }, [selectedCity]);

  const activeStore = STORE_PARTNERS.find(s => s.id === selectedStoreId) || STORE_PARTNERS[0];

  // Calculate Individual Price
  const studentDiscountPct = hasStudentCard ? 0.15 : 0;
  const rawSubtotal = basePricePerDay * rentalDays;
  const discountAmount = Math.round(rawSubtotal * studentDiscountPct);
  const deliveryFee = pickupMethod === 'delivery' ? 40000 : 0;
  const individualTotal = rawSubtotal - discountAmount + deliveryFee;
  const escrowDeposit = Math.round(basePricePerDay * 1.5); // Tiền cọc bảo chứng Escrow

  // Calculate Group Tier & Price
  const groupTier = useMemo(() => {
    return GROUP_TIERS.find(t => groupSize >= t.minQuantity && groupSize <= t.maxQuantity) || GROUP_TIERS[2];
  }, [groupSize]);

  const groupRawTotal = basePricePerDay * groupSize * rentalDays;
  const groupDiscountAmount = Math.round(groupRawTotal * (groupTier.discountPercent / 100));
  const groupFinalTotal = groupRawTotal - groupDiscountAmount;
  const groupPerPerson = Math.round(groupFinalTotal / groupSize);

  if (!isOpen) return null;

  const handleConfirmIndividualBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      onClose();
      if (onToast) {
        onToast(`🎉 Đã gửi yêu cầu giữ đồ bộ ${outfit?.ten || 'Việt phục'} tới ${activeStore.name}!`);
      }
    }, 2000);
  };

  const handleConfirmGroupBooking = () => {
    setGroupBookingSuccess(true);
    setTimeout(() => {
      setGroupBookingSuccess(false);
      onClose();
      if (onToast) {
        onToast(`📋 Đã lưu đăng ký ưu đãi kỷ yếu lớp ${className} (${groupSize} bạn)! Tư vấn viên sẽ liên hệ trong 15 phút.`);
      }
    }, 2000);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="rental-modal glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="rental-modal__header">
          <div className="rental-title-wrap">
            <span className="rental-badge">Hệ Sinh Thái Di Sản B2B2C</span>
            <h2 className="rental-title">
              👘 Mạng Lưới Thuê Cổ Phục & <span className="text-gradient">Ưu Đãi Kỷ Yếu</span>
            </h2>
            <p className="rental-sub">
              Hiện thực hóa bộ phối <strong>{outfit?.ten}</strong> qua mạng lưới đối tác uy tín với quỹ bảo chứng an toàn
            </p>
          </div>
          <button type="button" className="rental-close-btn" onClick={onClose} aria-label="Đóng">✕</button>
        </div>

        {/* Tab Switcher: Cá nhân vs Đơn nhóm */}
        <div className="rental-tabs">
          <button
            type="button"
            className={`rental-tab ${activeTab === 'individual' ? 'active' : ''}`}
            onClick={() => setActiveTab('individual')}
          >
            <span>👤 Thuê Lẻ Cá Nhân</span>
            <small>Đặt lịch thử & giữ đồ ngay</small>
          </button>
          <button
            type="button"
            className={`rental-tab ${activeTab === 'group' ? 'active' : ''}`}
            onClick={() => setActiveTab('group')}
          >
            <span>🎓 Đơn Nhóm Kỷ Yếu / Lớp (-25%)</span>
            <small>Ưu đãi học sinh - sinh viên</small>
          </button>
        </div>

        {/* TAB 1: INDIVIDUAL RENTAL */}
        {activeTab === 'individual' && (
          <div className="rental-content">
            {bookingSuccess ? (
              <div className="booking-success-box animate-fade-in">
                <span className="success-icon">✨</span>
                <h3>Đặt Giữ Đồ Thành Công!</h3>
                <p>Mã đặt chỗ của bạn: <strong>VP-{Date.now().toString().slice(-6)}</strong></p>
                <p>Tiệm <strong>{activeStore.name}</strong> đã ghi nhận và chuẩn bị sẵn size <strong>{selectedSize}</strong> cho bạn.</p>
              </div>
            ) : (
              <div className="rental-grid">
                {/* Left Column: Store Selection */}
                <div className="rental-left-col">
                  <div className="filter-city-row">
                    <span className="col-label">Khu vực:</span>
                    <div className="city-chips">
                      <button 
                        type="button" 
                        className={`city-chip ${selectedCity === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCity('all')}
                      >
                        Toàn quốc
                      </button>
                      <button 
                        type="button" 
                        className={`city-chip ${selectedCity === 'hn' ? 'active' : ''}`}
                        onClick={() => setSelectedCity('hn')}
                      >
                        Hà Nội
                      </button>
                      <button 
                        type="button" 
                        className={`city-chip ${selectedCity === 'hue' ? 'active' : ''}`}
                        onClick={() => setSelectedCity('hue')}
                      >
                        Huế
                      </button>
                      <button 
                        type="button" 
                        className={`city-chip ${selectedCity === 'sg' ? 'active' : ''}`}
                        onClick={() => setSelectedCity('sg')}
                      >
                        TP.HCM
                      </button>
                    </div>
                  </div>

                  {/* Store Partner Cards */}
                  <div className="store-list">
                    {filteredStores.map(store => (
                      <div
                        key={store.id}
                        className={`store-card ${selectedStoreId === store.id ? 'selected' : ''}`}
                        onClick={() => setSelectedStoreId(store.id)}
                      >
                        <div className="store-card__header">
                          <span className="store-badge">{store.badge}</span>
                          <span className="store-dist">📍 {store.distance}</span>
                        </div>
                        <h4 className="store-name">{store.name}</h4>
                        <p className="store-addr">{store.address}</p>
                        <div className="store-footer">
                          <span className="store-rating">⭐ {store.rating} ({store.reviewCount} đánh giá)</span>
                          <span className="store-phone">📞 {store.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Cost Estimator & Options */}
                <div className="rental-right-col">
                  <div className="config-box">
                    <h4 className="config-heading">Tùy Chọn Thuê Đồ</h4>
                    
                    {/* Size Selection */}
                    <div className="config-row">
                      <span className="config-label">Chọn Size:</span>
                      <div className="size-selector">
                        {['S', 'M', 'L', 'XL'].map(sz => (
                          <button
                            key={sz}
                            type="button"
                            className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                            onClick={() => setSelectedSize(sz)}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rental Days */}
                    <div className="config-row">
                      <span className="config-label">Thời gian thuê:</span>
                      <div className="days-selector">
                        {[1, 2, 3].map(d => (
                          <button
                            key={d}
                            type="button"
                            className={`day-btn ${rentalDays === d ? 'active' : ''}`}
                            onClick={() => setRentalDays(d)}
                          >
                            {d} ngày
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pickup method */}
                    <div className="config-row">
                      <span className="config-label">Giao nhận:</span>
                      <div className="pickup-toggle">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="pickup"
                            value="store"
                            checked={pickupMethod === 'store'}
                            onChange={() => setPickupMethod('store')}
                          />
                          Nhận tại tiệm (Miễn phí)
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="pickup"
                            value="delivery"
                            checked={pickupMethod === 'delivery'}
                            onChange={() => setPickupMethod('delivery')}
                          />
                          Giao tận nơi (+40k)
                        </label>
                      </div>
                    </div>

                    {/* Student Discount Checkbox */}
                    <div className="student-checkbox-wrap">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={hasStudentCard}
                          onChange={(e) => setHasStudentCard(e.target.checked)}
                        />
                        <span>Áp dụng giảm 15% thẻ Học sinh - Sinh viên</span>
                      </label>
                    </div>

                    {/* Price Breakdown */}
                    <div className="price-breakdown">
                      <div className="breakdown-row">
                        <span>Giá thuê cơ bản ({rentalDays} ngày):</span>
                        <span>{rawSubtotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      {hasStudentCard && (
                        <div className="breakdown-row discount">
                          <span>Ưu đãi HSSV (-15%):</span>
                          <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}
                      {pickupMethod === 'delivery' && (
                        <div className="breakdown-row">
                          <span>Phí giao tận nơi:</span>
                          <span>+40.000đ</span>
                        </div>
                      )}
                      <div className="breakdown-divider" />
                      <div className="breakdown-row total">
                        <strong>Tổng thanh toán:</strong>
                        <strong className="total-num">{individualTotal.toLocaleString('vi-VN')}đ</strong>
                      </div>
                      <div className="breakdown-row escrow">
                        <small>🛡️ Cọc bảo chứng hoàn lại: {escrowDeposit.toLocaleString('vi-VN')}đ</small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-block btn-book"
                      onClick={handleConfirmIndividualBooking}
                    >
                      ✨ Đặt Lịch Thử & Giữ Đồ Tại Tiệm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GROUP YEARBOOK BOOKING */}
        {activeTab === 'group' && (
          <div className="rental-content">
            {groupBookingSuccess ? (
              <div className="booking-success-box animate-fade-in">
                <span className="success-icon">🎓</span>
                <h3>Đã Lưu Hồ Sơ Đơn Nhóm!</h3>
                <p>Mã đăng ký kỷ yếu: <strong>KYEU-{Date.now().toString().slice(-6)}</strong></p>
                <p>Chuyên viên phụ trách kỷ yếu sẽ liên hệ bạn qua số <strong>{repPhone || 'đã cung cấp'}</strong> để gửi mẫu thử tận trường.</p>
              </div>
            ) : (
              <div className="group-booking-container">
                {/* Hero tier promo */}
                <div className="group-tier-card glass-panel">
                  <div className="tier-header">
                    <span className="tier-badge">Gói Kỷ Yếu & Sự Kiện Trường Lớp</span>
                    <span className="tier-discount">TIẾT KIỆM {groupTier.discountPercent}%</span>
                  </div>
                  <h3 className="tier-title">{groupTier.label}</h3>
                  <p className="tier-perks">🎁 <strong>Đặc quyền:</strong> {groupTier.perks}</p>
                </div>

                <div className="group-calc-grid">
                  {/* Calculator controls */}
                  <div className="calc-controls">
                    <div className="control-group">
                      <label className="group-label">Số lượng bạn tham gia: <strong>{groupSize} người</strong></label>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="1"
                        value={groupSize}
                        onChange={(e) => setGroupSize(parseInt(e.target.value, 10))}
                        className="group-slider"
                      />
                      <div className="slider-labels">
                        <span>5 bạn</span>
                        <span>20 bạn (Lớp)</span>
                        <span>40 bạn</span>
                        <span>60 bạn (Khóa)</span>
                      </div>
                    </div>

                    <div className="group-inputs-grid">
                      <div>
                        <label className="input-label">Trường học / Viện:</label>
                        <input
                          type="text"
                          className="group-input"
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          placeholder="Ví dụ: THPT Chuyên KHTN, VNU-UET..."
                        />
                      </div>
                      <div>
                        <label className="input-label">Lớp / Chi đoàn:</label>
                        <input
                          type="text"
                          className="group-input"
                          value={className}
                          onChange={(e) => setClassName(e.target.value)}
                          placeholder="Ví dụ: 12A1, K68..."
                        />
                      </div>
                      <div className="full-width">
                        <label className="input-label">Số điện thoại liên hệ (Lớp trưởng / Đại diện):</label>
                        <input
                          type="tel"
                          className="group-input"
                          value={repPhone}
                          onChange={(e) => setRepPhone(e.target.value)}
                          placeholder="0912.xxx.xxx (để nhận báo giá chi tiết qua Zalo)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculator results */}
                  <div className="calc-summary glass-panel">
                    <h4 className="summary-title">Bảng Dự Toán Chi Phí Đoàn</h4>
                    
                    <div className="summary-row">
                      <span>Đơn giá gốc:</span>
                      <span>{basePricePerDay.toLocaleString('vi-VN')}đ / người</span>
                    </div>
                    <div className="summary-row">
                      <span>Tổng tiền gốc ({groupSize} bạn):</span>
                      <span>{groupRawTotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="summary-row discount">
                      <span>Chiết khấu đơn nhóm (-{groupTier.discountPercent}%):</span>
                      <span>-{groupDiscountAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row highlight">
                      <span>Chỉ còn mỗi bạn:</span>
                      <span className="per-person-price">{groupPerPerson.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="summary-row total-group">
                      <strong>Tổng chi phí cả lớp:</strong>
                      <strong>{groupFinalTotal.toLocaleString('vi-VN')}đ</strong>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-block btn-lg"
                      style={{ marginTop: '1rem' }}
                      onClick={handleConfirmGroupBooking}
                    >
                      📋 Nhận Báo Giá Chi Tiết & Mẫu Thử
                    </button>
                    <small className="group-disclaimer">
                      *Được hỗ trợ bảo lãnh cọc qua tổ chức Đoàn/Hội sinh viên không cần đặt cọc lớn.
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
