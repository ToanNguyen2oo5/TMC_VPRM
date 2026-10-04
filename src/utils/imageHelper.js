/**
 * Helper to resolve image source whether it is a URL, relative path, or raw base64 string
 */
export function resolveImageSrc(img) {
  if (!img) return '';
  const s = String(img).trim();
  if (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('data:') ||
    s.startsWith('blob:') ||
    s.startsWith('/') ||
    s.startsWith('./')
  ) {
    return s;
  }
  return `data:image/png;base64,${s}`;
}
