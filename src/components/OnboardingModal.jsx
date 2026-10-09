import { useState, useEffect } from 'react';
import './OnboardingModal.css';

const STEPS = [
  {
    step: '1/3',
    icon: '🪷',
    badge: 'Chào mừng đến với Việt Phục Remix',
    title: 'Khám Phá Di Sản Y Phục Ngàn Năm',
    desc: 'Tìm hiểu 7 dòng trang phục truyền thống tiêu biểu của Đại Việt: Áo dài, Áo ngũ thân, Áo tấc, Áo Nhật Bình cung đình, Áo tứ thân và Áo bà ba theo từng sự kiện và vùng miền.'
  },
  {
    step: '2/3',
    icon: '🎨',
    badge: 'Sáng tạo & Cá nhân hóa',
    title: 'Phối Màu Ngũ Hành & Phụ Kiện Cổ Phong',
    desc: 'Tự do tùy biến màu sắc truyền thống (Đỏ son, Vàng nghệ, Xanh chàm, Nâu non...), chất liệu lụa gấm và phụ kiện chuẩn phong vị (Khăn đóng, Nón quai thao, Kiềng bạc, Khăn rằn).'
  },
  {
    step: '3/3',
    icon: '✨',
    badge: 'Tôn trọng & Tự hào',
    title: 'Kiểm Tra Hài Hòa & Cảnh Báo Văn Hóa',
    desc: 'Hệ thống đánh giá độ hòa hợp màu sắc và cảnh báo văn hóa tế nhị, giúp bạn diện cổ phục vừa đúng chuẩn mực di sản, vừa thời thượng và tự tin tỏa sáng.'
  }
];

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const current = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  return (
    <div className="onboarding-overlay animate-fade-in" role="dialog" aria-modal="true">
      <div className="onboarding-card animate-scale-up">
        {/* Nút đóng góc trên bên phải */}
        <button
          type="button"
          className="onboarding-close-btn"
          onClick={onClose}
          aria-label="Đóng hướng dẫn"
          title="Đóng hướng dẫn"
        >
          ✕
        </button>

        <span className="onboarding-badge">{current.badge}</span>
        
        <div className="onboarding-icon-wrap">
          {current.icon}
        </div>

        <h3 className="onboarding-title">{current.title}</h3>
        <p className="onboarding-desc">{current.desc}</p>

        {/* Dots */}
        <div className="onboarding-dots">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`onboarding-dot ${i === currentStep ? 'onboarding-dot--active' : ''}`}
              onClick={() => setCurrentStep(i)}
              aria-label={`Chuyển đến bước ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions đối xứng 2 bên */}
        <div className="onboarding-actions">
          {currentStep > 0 ? (
            <button
              type="button"
              className="onboarding-back-btn"
              onClick={handlePrev}
            >
              ← Quay lại
            </button>
          ) : (
            <div className="onboarding-back-spacer" aria-hidden="true" />
          )}

          <button
            type="button"
            className="btn btn-primary onboarding-next-btn"
            onClick={handleNext}
          >
            {isLast ? '✨ Bắt đầu phối đồ ngay' : 'Tiếp tục ➔'}
          </button>
        </div>
      </div>
    </div>
  );
}
