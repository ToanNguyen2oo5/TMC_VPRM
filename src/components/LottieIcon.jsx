import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

/**
 * Component hiển thị hoạt họa Lottie vector với lottie-web
 * Tối ưu hiệu năng, tự động giải phóng bộ nhớ khi unmount
 */
export default function LottieIcon({
  animationData,
  size = 28,
  width,
  height,
  loop = true,
  autoplay = true,
  className = '',
  style = {},
  title = ''
}) {
  const containerRef = useRef(null);
  const animInstanceRef = useRef(null);

  const actualWidth = width || size;
  const actualHeight = height || size;

  useEffect(() => {
    if (!containerRef.current || !animationData) return;

    try {
      // Dọn dẹp animation cũ nếu có
      if (animInstanceRef.current) {
        animInstanceRef.current.destroy();
      }

      animInstanceRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: loop !== false,
        autoplay: autoplay !== false,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: true
        }
      });
    } catch (err) {
      console.warn('Lỗi khởi tạo Lottie animation:', err);
    }

    return () => {
      if (animInstanceRef.current) {
        animInstanceRef.current.destroy();
        animInstanceRef.current = null;
      }
    };
  }, [animationData, loop, autoplay]);

  return (
    <span
      ref={containerRef}
      className={`lottie-icon-wrapper ${className}`}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: actualWidth,
        height: actualHeight,
        lineHeight: 0,
        verticalAlign: 'middle',
        flexShrink: 0,
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}
