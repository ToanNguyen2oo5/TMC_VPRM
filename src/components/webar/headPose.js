/**
 * Head Pose Estimation (headPose.js)
 * Hàm thuần toán học: Nhận MediaPipe Face Landmarks -> Tính toán vị trí, kích thước và góc nghiêng đầu
 */

export function estimateHeadPose(landmarks, canvasWidth, canvasHeight, isMirrored = false) {
  if (!landmarks || landmarks.length < 468) return null;

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

  const dxCheeks = p454.x - p234.x;
  const dyCheeks = p454.y - p234.y;
  const headWidth = Math.hypot(dxCheeks, dyCheeks);

  const dxFace = p152.x - p10.x;
  const dyFace = p152.y - p10.y;
  const headHeight = Math.hypot(dxFace, dyFace);

  // Khi lật gương, mắt trái và mắt phải đổi chỗ trên màn hình,
  // do đó vector đi từ trái qua phải của màn hình cũng bị đảo ngược
  const dxEyes = isMirrored ? (p33.x - p263.x) : (p263.x - p33.x);
  const dyEyes = isMirrored ? (p33.y - p263.y) : (p263.y - p33.y);
  const rollRad = Math.atan2(dyEyes, dxEyes);

  const centerX = (p10.x + p152.x) / 2;
  const centerY = (p10.y + p152.y) / 2;

  const headUpVector = { x: -Math.sin(rollRad), y: -Math.cos(rollRad) };
  const topHeadOffset = headHeight * 0.22;
  const topHeadX = p10.x + headUpVector.x * topHeadOffset;
  const topHeadY = p10.y + headUpVector.y * topHeadOffset;

  const midCheeksX = (p234.x + p454.x) / 2;
  const yawRatio = (p1.x - midCheeksX) / (headWidth / 2);

  return {
    centerX, centerY, headWidth, headHeight, rollRad, yawRatio,
    forehead: { x: p10.x, y: p10.y },
    topHead: { x: topHeadX, y: topHeadY },
    chin: { x: p152.x, y: p152.y },
    leftCheek: { x: p234.x, y: p234.y },
    rightCheek: { x: p454.x, y: p454.y },
    leftEye: { x: p33.x, y: p33.y },
    rightEye: { x: p263.x, y: p263.y },
    nose: { x: p1.x, y: p1.y },
    source: 'FACE'
  };
}

export function estimateHeadPoseFromBody(bodyPose, canvasWidth, canvasHeight, isMirrored = false) {
  if (!bodyPose || !bodyPose.nose || !bodyPose.leftEar || !bodyPose.rightEar) return null;

  const toPx = (pt) => ({
    // mappedBodyPose đã được lật trong CameraView, không lật lại nữa
    x: pt.x * canvasWidth,
    y: pt.y * canvasHeight,
    z: pt.z || 0
  });

  const nose = toPx(bodyPose.nose);
  const leftEye = toPx(bodyPose.leftEye);
  const rightEye = toPx(bodyPose.rightEye);
  const leftEar = toPx(bodyPose.leftEar);
  const rightEar = toPx(bodyPose.rightEar);

  const dxEars = rightEar.x - leftEar.x;
  const dyEars = rightEar.y - leftEar.y;
  const headWidth = Math.hypot(dxEars, dyEars) * 1.5; 
  const headHeight = headWidth * 1.35;

  // Reverse the eye vector to fix the upside-down hat when standing far away
  const dxEyes = isMirrored ? (rightEye.x - leftEye.x) : (leftEye.x - rightEye.x);
  const dyEyes = isMirrored ? (rightEye.y - leftEye.y) : (leftEye.y - rightEye.y);
  const rollRad = Math.atan2(dyEyes, dxEyes);

  const centerX = nose.x;
  const centerY = nose.y;

  const headUpVector = { x: -Math.sin(rollRad), y: -Math.cos(rollRad) };
  const topHeadOffset = headHeight * 0.45;
  const topHeadX = nose.x + headUpVector.x * topHeadOffset;
  const topHeadY = nose.y + headUpVector.y * topHeadOffset;
  const foreheadX = nose.x + headUpVector.x * (topHeadOffset * 0.7);
  const foreheadY = nose.y + headUpVector.y * (topHeadOffset * 0.7);
  const chinX = nose.x - headUpVector.x * (headHeight * 0.45);
  const chinY = nose.y - headUpVector.y * (headHeight * 0.45);

  return {
    centerX, centerY, headWidth, headHeight, rollRad, yawRatio: 0,
    forehead: { x: foreheadX, y: foreheadY },
    topHead: { x: topHeadX, y: topHeadY },
    chin: { x: chinX, y: chinY },
    leftCheek: leftEar,
    rightCheek: rightEar,
    leftEye: leftEye,
    rightEye: rightEye,
    nose: nose,
    source: 'BODY'
  };
}
