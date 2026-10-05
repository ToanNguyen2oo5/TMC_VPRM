import { ACCESSORIES_CONFIG } from './accessoryConfigs';
import './AccessorySelector.css';

/**
 * AccessorySelector Component
 * Thanh chọn phụ kiện truyền thống (Khăn đóng, Nón quai thao, Nón lá)
 */
export default function AccessorySelector({ selectedId, onSelect }) {
  const accessories = Object.values(ACCESSORIES_CONFIG);

  return (
    <div className="accessory-selector-container">
      <div className="accessory-selector-scroll">
        {accessories.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              className={`accessory-card-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelect(item.id)}
              aria-pressed={isSelected}
              aria-label={`Chọn phụ kiện ${item.name}`}
            >
              <div className="accessory-thumb-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  className="accessory-thumb-img"
                  loading="lazy"
                />
              </div>
              <div className="accessory-info">
                <span className="accessory-name">{item.name}</span>
                <span className="accessory-sub">{item.subtitle}</span>
              </div>
              {isSelected && <span className="active-glow-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
