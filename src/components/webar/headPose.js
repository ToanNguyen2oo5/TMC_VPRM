/**
 * Head Pose Estimation (headPose.js)
 * Hàm thuần toán học: Nhận MediaPipe Face Landmarks -> Tính toán vị trí, kích thước và góc nghiêng đầu
 * 
 * MediaPipe Face Landmarker Landmark IDs quan trọng:
 * - 10: Trán giữa (Forehead center - đỉnh đường chân tóc)
 * - 152: Chóp cằm (Chin tip)
 * - 234: Biên má trái (Left cheek edge)
 * - 454: Biên má phải (Right cheek edge)
 * - 33: Đuôi mắt trái (Left eye outer corner)
 * - 263: Đuôi mắt phải (Right eye outer corner)
 * - 1: Đầu mũi (Nose tip)
 */

/**
 * Tính toán Pose đầu từ mảng landmarks MediaPipe (chuẩn hóa 0..1)
 * @param {Array<{x: number, y: number, z?: number}>} landmarks - 478 landmarks
 * @param {number} canvasWidth - Bề rộng khung hiển thị canvas
 * @param {number} canvasHeight - Chiều cao khung hiển thị canvas
 * @param {boolean} isMirrored - Có đang lật gương camera trước hay không
 * @returns {object|null} Head pose metrics
 */
export function estimateHeadPose(landmarks, canvasWidth, canvasHeight, isMirrored = false) {
  if (!landmarks || landmarks.length < 468) {
    return null;
  }

  // Chuyển đổi tọa độ từ normalized (0..1) sang pixels
  // Chú ý: Nếu lật gương (mirror), x pixel = (1 - x) * canvasWidth
  const toPx = (pt) => ({
    x: (isMirrored ? (1 - pt.x) : pt.x) * canvasWidth,
    y: pt.y * canvasHeight,
    z: pt.z || 0
  });

  const p10 = toPx(landmarks[10]);     // Trán
  const p152 = toPx(landmarks[152]);   // Cằm
  const p234 = toPx(landmarks[234]);   // Má trái
  const p454 = toPx(landmarks[454]);   // Má phải
  const p33 = toPx(landmarks[33]);     // Mắt trái
  const p263 = toPx(landmarks[263]);   // Mắt phải
  const p1 = toPx(landmarks[1]);       // Mũi

  // 1. Độ rộng khuôn mặt (headWidth): khoảng cách giữa 2 má
  const dxCheeks = p454.x - p234.x;
  const dyCheeks = p454.y - p234.y;
  const headWidth = Math.hypot(dxCheeks, dyCheeks);

  // 2. Chiều cao khuôn mặt (headHeight): khoảng cách từ trán đến cằm
  const dxFace = p152.x - p10.x;
  const dyFace = p152.y - p10.y;
  const headHeight = Math.hypot(dxFace, dyFace);

  if (headWidth <= 5 || headHeight <= 5) {
    return null;
  }

  // 3. Góc nghiêng đầu (Roll - radian)
  // Tính theo vector nối giữa hai đuôi mắt (p33 và p263)
  // Nếu lật gương, thứ tự vector từ mắt trái sang mắt phải trên màn hình sẽ đảo chiều tương ứng
  const dxEyes = isMirrored ? (p33.x - p263.x) : (p263.x - p33.x);
  const dyEyes = isMirrored ? (p33.y - p263.y) : (p263.y - p33.y);
  const rollRad = Math.atan2(dyEyes, dxEyes);

  // 4. Tâm khuôn mặt (Center)
  const centerX = (p234.x + p454.x) / 2;
  const centerY = (p10.y + p152.y) / 2;

  // 5. Ước lượng Đỉnh đầu thực tế (Top of Head)
  // Vì MediaPipe landmark 10 chỉ tới chân tóc trán, đỉnh đầu nằm cao hơn landmark 10
  // khoảng 20% - 25% chiều cao mặt, hướng theo trục đối xứng của khuôn mặt
  const headUpVector = {
    x: -Math.sin(rollRad),
    y: -Math.cos(rollRad)
  };
  const topHeadOffset = headHeight * 0.22;
  const topHeadX = p10.x + headUpVector.x * topHeadOffset;
  const topHeadY = p10.y + headUpVector.y * topHeadOffset;

  // 6. Ước tính góc quay trái/phải (Yaw): vị trí mũi so với tâm hai má
  const midCheeksX = (p234.x + p454.x) / 2;
  const yawRatio = (p1.x - midCheeksX) / (headWidth / 2); // -1 (quay trái) đến +1 (quay phải)

  return {
    centerX,
    centerY,
    headWidth,
    headHeight,
    rollRad,
    yawRatio,
    forehead: { x: p10.x, y: p10.y },
    topHead: { x: topHeadX, y: topHeadY },
    chin: { x: p152.x, y: p152.y },
    leftCheek: { x: p234.x, y: p234.y },
    rightCheek: { x: p454.x, y: p454.y },
    leftEye: { x: p33.x, y: p33.y },
    rightEye: { x: p263.x, y: p263.y },
    nose: { x: p1.x, y: p1.y }
  };
}
