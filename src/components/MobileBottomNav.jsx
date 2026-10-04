import './MobileBottomNav.css';

export default function MobileBottomNav({
  activeTab,
  onTabChange,
  compareCount = 0,
  lookbookCount = 0
}) {
  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: '🏠' },
    { id: 'mixer', label: 'Phối đồ', icon: '👘' },
    { id: 'explore', label: 'Khám phá', icon: '🔍' },
    { id: 'compare', label: 'So sánh', icon: '⚖️', badge: compareCount },
    { id: 'lookbook', label: 'Lookbook', icon: '📚', badge: lookbookCount },
    { id: 'culture', label: 'Văn hóa', icon: '🏛️' }
  ];

  return (
    <nav className="mobile-bottom-nav glass-panel" aria-label="Thanh điều hướng di động">
      <div className="mobile-bottom-nav__container">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              id={`mobile-nav-${item.id}`}
            >
              <div className="mobile-nav-item__icon-wrapper">
                <span className="mobile-nav-item__icon">{item.icon}</span>
                {item.badge > 0 && (
                  <span className="mobile-nav-item__badge">{item.badge}</span>
                )}
              </div>
              <span className="mobile-nav-item__label">{item.label}</span>
              {isActive && <span className="mobile-nav-item__indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
