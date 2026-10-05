import { useState, useCallback, useMemo } from 'react';
import CameraView from './CameraView';
import AccessorySelector from './AccessorySelector';
import CapturePreview from './CapturePreview';
import { ACCESSORIES_CONFIG, DEFAULT_ACCESSORY_ID } from './accessoryConfigs';
import './WebARPage.css';

/**
 * WebARPage Component
 * Màn hình "Thử phụ kiện với Camera" (WebAR Real-time)
 * Tương thích toàn diện cho cả Laptop / PC và Điện thoại (iOS / Android)
 */
export default function WebARPage({ onExit, onToast }) {
  const [selectedId, setSelectedId] = useState(DEFAULT_ACCESSORY_ID);
  const [trackingState, setTrackingState] = useState('starting'); // 'starting' | 'noFace' | 'tracking' | 'error'
  const [stateMessage, setStateMessage] = useState('Đang khởi động camera...');
  const [isMirrored, setIsMirrored] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [fps, setFps] = useState(0);

  // Danh sách thiết bị camera (cho laptop có webcam ngoài hoặc điện thoại có nhiều camera)
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  // Outfit Selector State
  const [selectedOutfitId, setSelectedOutfitId] = useState('ao-dai');
  const [outfitTrackingState, setOutfitTrackingState] = useState('off');

  const OUTFITS = useMemo(() => [
    { 
      id: 'ao-dai-real', name: 'Áo Dài (Thật)', image: '/garments/ao-dai-placeholder.png',
      keypoints: {
        neck: { x: 0.5, y: 0.02 },
        shoulderL: { x: 0.70, y: 0.08 },
        shoulderR: { x: 0.30, y: 0.08 },
        elbowL: { x: 0.85, y: 0.40 },
        elbowR: { x: 0.15, y: 0.40 },
        wristL: { x: 0.95, y: 0.65 },
        wristR: { x: 0.05, y: 0.65 },
        waist: { x: 0.5, y: 0.50 },
        hem: { x: 0.5, y: 0.95 }
      },
      category: 'dress', widthScale: 1.25, bodyHeightScale: 2.35, verticalOffset: 0.1
    },
    { 
      id: 'ba-ba-real', name: 'Bà Ba (Thật)', image: '/garments/ba-ba-placeholder.png',
      keypoints: {
        neck: { x: 0.5, y: 0.02 },
        shoulderL: { x: 0.70, y: 0.08 },
        shoulderR: { x: 0.30, y: 0.08 },
        elbowL: { x: 0.85, y: 0.35 },
        elbowR: { x: 0.15, "y": 0.35 },
        wristL: { x: 0.95, y: 0.60 },
        wristR: { x: 0.05, y: 0.60 },
        waist: { x: 0.5, y: 0.45 },
        hem: { x: 0.5, y: 0.85 }
      },
      category: 'upper', widthScale: 1.1, bodyHeightScale: 1.05, verticalOffset: 0.1
    },
    // Fallback cũ (đã đổi tên)
    { 
      id: 'ao-dai', name: 'Áo Dài (Vector)', image: '/costumes/ao-dai.svg?v=3',
      shoulderL: { x: 220/350, y: 122/600 }, shoulderR: { x: 134/350, y: 122/600 },
      hemY: 540/600, coverTo: 'ankle', widthScale: 1.2
    },
    { 
      id: 'tu-than', name: 'Tứ Thân (Vector)', image: '/costumes/tu-than.svg?v=3',
      shoulderL: { x: 220/350, y: 120/600 }, shoulderR: { x: 120/350, y: 120/600 },
      hemY: 450/600, coverTo: 'ankle', widthScale: 1.25
    },
    { id: 'none', name: 'Không Mặc', image: null }
  ], []);

  // Chế độ Debug
  const [isDebug, setIsDebug] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('debug') === '1';
    } catch {
      return false;
    }
  });

  // Chụp ảnh
  const [captureTrigger, setCaptureTrigger] = useState(0);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);

  const selectedAccessory = useMemo(() => {
    return ACCESSORIES_CONFIG[selectedId] || ACCESSORIES_CONFIG[DEFAULT_ACCESSORY_ID];
  }, [selectedId]);

  // Cập nhật thông điệp trạng thái dựa trên state machine
  const handleTrackingStateChange = useCallback((newState, customMsg) => {
    setTrackingState(newState);
    if (newState === 'starting') {
      setStateMessage('Đang khởi động camera...');
    } else if (newState === 'noFace') {
      setStateMessage('Hãy đưa khuôn mặt vào giữa khung hình.');
    } else if (newState === 'tracking') {
      setStateMessage('Đã nhận diện khuôn mặt ✓');
    } else if (newState === 'error') {
      setStateMessage(customMsg || 'Đã xảy ra sự cố kết nối camera.');
    }
  }, []);

  const handleTriggerCapture = () => {
    setCaptureTrigger(Date.now());
  };

  const handleToggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  // Chọn camera từ dropdown
  const handleSelectCamera = (e) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    
    const device = availableDevices.find(d => d.deviceId === newDeviceId);
    if (device && onToast) {
      onToast(`📷 Đã chọn: ${device.label || 'Camera'}`);
    }
  };

  const handleToggleMirror = () => {
    setIsMirrored(prev => {
      const next = !prev;
      if (onToast) onToast(next ? '🪞 Đã bật lật gương (Mirror ON)' : '🖼️ Đã tắt lật gương (Mirror OFF)');
      return next;
    });
  };

  return (
    <div className="webar-page-layout animate-fade-in">
      {/* 1. Header WebAR với các công cụ tương thích */}
      <header className="webar-top-bar">
        <button
          type="button"
          className="btn btn-ghost btn-sm webar-back-btn"
          onClick={onExit}
          title="Thoát khỏi màn hình WebAR"
        >
          ← Quay lại
        </button>

        <div className="webar-header-title">
          <h2>Thử Phụ Kiện <span className="text-gradient">WebAR</span></h2>
          <span className="webar-header-badge">AI Live Mirror • Laptop & Mobile</span>
        </div>

        <div className="webar-header-actions">
          {/* Nút bật/tắt lật gương (Mirror) */}
          <button
            type="button"
            className={`webar-icon-tool-btn ${isMirrored ? 'active' : ''}`}
            onClick={handleToggleMirror}
            title={isMirrored ? 'Đang lật gương (như soi gương) - Bấm để xem chiều thường' : 'Đang xem chiều gốc - Bấm để lật gương'}
          >
            🪞
          </button>

          {/* Dropdown chọn Camera */}
          {availableDevices.length > 0 && (
            <select
              className="webar-camera-select"
              value={selectedDeviceId || ''}
              onChange={handleSelectCamera}
              title="Chọn Camera"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '4px 8px',
                outline: 'none',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                maxWidth: '150px',
                textOverflow: 'ellipsis',
                fontFamily: 'inherit',
                fontSize: '0.9rem'
              }}
            >
              <option value="" disabled style={{ color: '#000' }}>-- Chọn Camera --</option>
              {availableDevices.map((device, idx) => (
                <option key={device.deviceId} value={device.deviceId} style={{ color: '#000' }}>
                  {device.label || `Camera ${idx + 1}`}
                </option>
              ))}
            </select>
          )}

          {/* Nút bật/tắt Debug mode */}
          <button
            type="button"
            className={`webar-icon-tool-btn ${isDebug ? 'active' : ''}`}
            onClick={() => setIsDebug(prev => !prev)}
            title="Bật/Tắt chế độ kỹ thuật Debug"
          >
            🛠️
          </button>
        </div>
      </header>

      {/* 2. Khung Viewport Camera */}
      <main className="webar-viewport-wrapper">
        {isCameraActive ? (
          <CameraView
            selectedAccessory={selectedAccessory}
            onStateChange={handleTrackingStateChange}
            isDebug={isDebug}
            onFpsUpdate={setFps}
            isMirrored={isMirrored}
            selectedDeviceId={selectedDeviceId}
            onDeviceListAvailable={setAvailableDevices}
            onCaptureReady={setCapturedPhotoUrl}
            externalCaptureTrigger={captureTrigger}
            selectedOutfit={OUTFITS.find(o => o.id === selectedOutfitId)}
            onOutfitTrackingChange={setOutfitTrackingState}
          />
        ) : (
          <div className="webar-camera-disabled-card glass-panel">
            <span className="disabled-icon">📷</span>
            <h3>Camera đang tạm tắt</h3>
            <p>Nhấn vào nút bên dưới để mở lại camera và trải nghiệm phụ kiện</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleToggleCamera}
            >
              Bật lại Camera
            </button>
          </div>
        )}

        {/* Thanh trạng thái AI Banner */}
        {isCameraActive && (
          <div className={`webar-status-pill status-${trackingState}`}>
            <span className="status-indicator-dot" />
            <span className="status-text">{stateMessage}</span>
            {isDebug && <span className="fps-counter">FPS: {fps}</span>}
          </div>
        )}
        {isCameraActive && selectedOutfitId !== 'none' && outfitTrackingState === 'stepBack' && (
          <div className="webar-outfit-guidance" role="status">
            Lùi ra 1–2 bước để camera thấy rõ cả hai vai và hông trước khi ướm áo.
          </div>
        )}
      </main>

      {/* 3. Bảng điều khiển chọn phụ kiện & Nút chụp ảnh */}
      <footer className="webar-control-bar glass-panel">
        {/* Thanh chọn phụ kiện & Trang phục */}
        <div className="webar-selector-row" style={{ flexDirection: 'column', gap: '10px' }}>
          
          <div className="outfit-selector" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            <span style={{ color: '#DAA520', fontWeight: 'bold', alignSelf: 'center', whiteSpace: 'nowrap' }}>Trang phục:</span>
            {OUTFITS.map(o => (
              <button
                key={o.id}
                className={`btn ${selectedOutfitId === o.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '0.9rem', borderRadius: '20px', whiteSpace: 'nowrap' }}
                onClick={() => {
                  setSelectedOutfitId(o.id);
                }}
              >
                {o.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#DAA520', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Phụ kiện:</span>
            <AccessorySelector
              selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              if (onToast) {
                const acc = ACCESSORIES_CONFIG[id];
                onToast(`✨ Đã đổi sang: ${acc?.name || id}`);
              }
            }}
            />
          </div>
        </div>

        {/* Cụm hành động đáy: Bật/tắt camera, Nút chụp lớn, Nút thoát */}
        <div className="webar-action-row">
          <button
            type="button"
            className={`btn btn-secondary btn-icon ${!isCameraActive ? 'camera-off' : ''}`}
            onClick={handleToggleCamera}
            title={isCameraActive ? 'Tạm tắt camera' : 'Bật lại camera'}
          >
            {isCameraActive ? '📷 Tắt cam' : '📷 Bật cam'}
          </button>

          {/* Nút chụp ảnh nổi bật chính giữa */}
          <button
            type="button"
            className="webar-shutter-btn"
            onClick={handleTriggerCapture}
            disabled={!isCameraActive}
            aria-label="Chụp ảnh phụ kiện AR"
          >
            <div className="shutter-inner-ring">
              <span className="shutter-icon">📸</span>
            </div>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onExit}
          >
            ✕ Thoát
          </button>
        </div>
      </footer>

      {/* 4. Modal xem trước và lưu ảnh chụp */}
      {capturedPhotoUrl && (
        <CapturePreview
          imageUrl={capturedPhotoUrl}
          onRetake={() => setCapturedPhotoUrl(null)}
          onClose={() => setCapturedPhotoUrl(null)}
          onToast={onToast}
        />
      )}
    </div>
  );
}
