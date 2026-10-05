import { GoogleGenAI } from '@google/genai';
import { generateOutfitImageWithFaceHF } from './hfImageService';
import { generateOutfitWithCloudflare } from './cloudflareImageService';
import { 
  getGarmentContext, 
  translateCustomizations, 
  PHOTOREALISTIC_PROMPT_CONFIG,
  describeCustomColors,
  describeSelectedAccessories,
  buildSnapshotPrompt,
  SNAPSHOT_NEGATIVE_PROMPT
} from './outfitPromptHelper';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

let ai = null;
function getAI() {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env');
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// Danh sách các model sinh ảnh của Google Gemini theo thứ tự ưu tiên
const GEMINI_IMAGE_MODELS = [
  'gemini-2.5-flash-image',
  'gemini-3-pro-image',
  'gemini-3.1-flash-image'
];

/**
 * Chuyển File/Blob thành base64 string (không có prefix data:...)
 */
export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Tạo prompt mô tả outfit chi tiết cho Gemini
 * Cấu trúc snapshot CCD Digicam, Direct on-camera flash, Kodak Portra 400
 */
function buildOutfitPrompt(outfitData, angle = 0, customizations = {}) {
  const prompt = buildSnapshotPrompt(outfitData, angle, customizations);
  return `${prompt}

Negative prompt:
${SNAPSHOT_NEGATIVE_PROMPT}`;
}

/**
 * Sinh ảnh trực tiếp bằng Google Gemini (Multimodal Image Generation)
 */
async function generateWithGemini(userPhotoBase64, outfitData, angle = 0, referenceImageBase64 = null, customizations = {}) {
  const genAI = getAI();
  const prompt = buildOutfitPrompt(outfitData, angle, customizations);

  const parts = [];

  // Thêm ảnh người dùng nếu có
  if (userPhotoBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: userPhotoBase64
      }
    });
    parts.push({
      text: 'QUAN TRỌNG: Đây là ảnh khuôn mặt tham chiếu. A hyper-photorealistic close-up portrait of the same female subject, preserving exact facial identity, skin tone, and proportions. Bạn PHẢI giữ nguyên chính xác các đường nét khuôn mặt, mắt, mũi, miệng, kiểu tóc và kính (nếu có) của người này và ghép vào nhân vật trong ảnh kết quả. BẮT BUỘC PHẢI TẠO ẢNH TOÀN THÂN TỪ ĐỈNH ĐẦU ĐẾN GÓT CHÂN (Full body shot from head to toe, showing entire body, long pants, and feet standing on floor). TUYỆT ĐỐI KHÔNG chụp cận mặt, KHÔNG chụp nửa người hay crop ngang hông.'
    });
  }

  // Thêm ảnh tham chiếu nếu đang sinh góc xoay
  if (referenceImageBase64 && angle !== 0) {
    const colorSpec = describeCustomColors(customizations?.colors, outfitData);
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: referenceImageBase64
      }
    });
    parts.push({
      text: `QUAN TRỌNG: Đây là ảnh nhân vật ở góc 0 độ. Bạn PHẢI giữ nguyên 100% bố cục TOÀN THÂN từ đầu đến chân, loại trang phục Việt Nam này, phom dáng tà áo, kiểu cổ áo, chất liệu vải và CHÍNH XÁC MÀU SẮC của trang phục từ ảnh gốc (${colorSpec.summaryVi}). Giữ nguyên khuôn mặt nhân vật (nhìn từ góc ${angle} độ). Tuyệt đối không thay đổi kiểu dáng trang phục hay đổi màu sắc trang phục, không crop thành nửa người. Chỉ thay đổi góc nhìn sang ${angle} độ.`
    });
  }

  parts.push({ text: prompt });
  const contents = [{ role: 'user', parts }];

  console.group(`🎨 [ƯU TIÊN 1 - GOOGLE GEMINI IMAGE] - ${outfitData.ten} (Góc ${angle}°)`);
  console.log('📌 OUTFIT ID:', outfitData.id, '| ANGLE:', angle);
  console.log('📝 PROMPT HOÀN CHỈNH TIÊM VÀO GEMINI:\n\n' + prompt);
  if (userPhotoBase64) {
    const facePart = parts.find(p => p.text && p.text.includes('tham chiếu'));
    if (facePart) {
      console.log('👤 LỆNH BẢO TOÀN KHUÔN MẶT THAM CHIẾU:\n\n' + facePart.text);
    }
  }
  console.groupEnd();

  let lastError = null;
  for (const model of GEMINI_IMAGE_MODELS) {
    try {
      console.log(`🚀 Đang gửi yêu cầu sinh ảnh tới Google Gemini (${model})...`);
      const response = await genAI.models.generateContent({
        model: model,
        contents: contents,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        }
      });

      const candidateParts = response.candidates?.[0]?.content?.parts || [];
      for (const part of candidateParts) {
        if (part.inlineData && part.inlineData.data) {
          console.log(`✅ Sinh ảnh thành công bằng Google Gemini (${model})!`);
          return part.inlineData.data;
        }
      }
      throw new Error(`Model ${model} không trả về dữ liệu ảnh (inlineData).`);
    } catch (err) {
      console.warn(`⚠️ Google Gemini (${model}) thất bại:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Tất cả model Google Gemini Image đều không thành công.');
}

/**
 * Sinh ảnh mockup nhân vật mặc trang phục ở một góc cụ thể
 * Ưu tiên:
 * 1. Google Gemini Image (Multimodal Generation - Ưu tiên số 1)
 * 2. Hugging Face FLUX PuLID (Dự phòng 1 khi Gemini lỗi và có ảnh mặt)
 * 3. FLUX.1 Realism 12B (Dự phòng 2 khi các model trên lỗi)
 *
 * @param {string|null} userPhotoBase64 - Ảnh người dùng dạng base64 (null nếu dùng nhân vật mẫu)
 * @param {object} outfitData - Dữ liệu outfit từ trangphuc.json
 * @param {number} angle - Góc xoay (0, 45, 90, 135, 180, 225, 270, 315)
 * @param {string|null} referenceImageBase64 - Ảnh tham chiếu (ảnh góc 0°) cho các góc sau
 * @returns {Promise<string>} base64 image data hoặc URL ảnh
 */
export async function generateOutfitImage(userPhotoBase64, outfitData, angle = 0, referenceImageBase64 = null, customizations = {}) {
  if (DEMO_MODE) {
    return getDemoImage(outfitData.id, angle);
  }

  // =========================================================================
  // ƯU TIÊN SỐ 1: GOOGLE GEMINI API (Luôn luôn thực thi trước)
  // =========================================================================
  try {
    console.info(`🎯 [ƯU TIÊN 1] Đang gọi Google Gemini Image Generator cho: ${outfitData.ten} (Góc ${angle}°)...`);
    return await generateWithGemini(userPhotoBase64, outfitData, angle, referenceImageBase64, customizations);
  } catch (geminiError) {
    const isQuotaError = geminiError.message?.includes('429') || geminiError.message?.includes('RESOURCE_EXHAUSTED');
    if (isQuotaError) {
      console.warn('⚠️ Google Gemini API bị giới hạn Quota = 0 (Free Tier yêu cầu Pay-as-you-go). Chi tiết:', geminiError.message);
    } else {
      console.warn('⚠️ Google Gemini API gặp lỗi:', geminiError.message);
    }
  }

  // =========================================================================
  // DỰ PHÒNG 1 (FALLBACK 1): HUGGING FACE FLUX PuLID
  // Chỉ kích hoạt khi Gemini thất bại VÀ người dùng có tải lên ảnh khuôn mặt
  // =========================================================================
  if (userPhotoBase64) {
    try {
      console.info('🔄 [DỰ PHÒNG 1] Chuyển tiếp sang Hugging Face FLUX PuLID ghép mặt cho:', outfitData.ten);
      return await generateOutfitImageWithFaceHF(userPhotoBase64, outfitData, angle, customizations);
    } catch (hfError) {
      console.warn('⚠️ Hugging Face FLUX PuLID gặp lỗi hoặc hết Quota GPU:', hfError.message);
    }
  }

  // =========================================================================
  // DỰ PHÒNG 2 (FALLBACK 2): CLOUDFLARE WORKERS AI - FLUX.1 [SCHNELL]
  // Tốc độ cao (~2-4s), sắc nét đỉnh cao, 10.000 neurons miễn phí mỗi ngày
  // =========================================================================
  try {
    console.info('⚡ [DỰ PHÒNG 2] Tự động kích hoạt Cloudflare Workers AI FLUX.1 [schnell] cho:', outfitData.ten);
    return await generateOutfitWithCloudflare(outfitData, angle, customizations, userPhotoBase64);
  } catch (cfError) {
    console.warn('⚠️ Cloudflare Workers AI gặp lỗi hoặc chưa cấu hình:', cfError.message);
  }

  // =========================================================================
  // DỰ PHÒNG 3 (FALLBACK 3): FLUX.1 REALISM ĐỘC LẬP (POLLINATIONS)
  // Đảm bảo 100% ứng dụng luôn có ảnh trả về với độ nét cao
  // =========================================================================
  console.info('🚀 [DỰ PHÒNG 3] Tự động kích hoạt Model FLUX.1 Dự phòng an toàn...');
  return await generateFallbackImage(outfitData, angle, customizations);
}

/**
 * Sinh ảnh dự phòng an toàn bằng FLUX.1
 * Độ phân giải chuẩn: 896x1152 (tỉ lệ 3:4 chân dung toàn thân sắc nét).
 */
async function generateFallbackImage(outfitData, angle = 0, customizations = {}) {
  const basePrompt = buildSnapshotPrompt(outfitData, angle, customizations);
  const fullPrompt = `${basePrompt}, 8k portrait, cinematic lighting, ultra-detailed fabric textures, traditional Vietnamese costume masterpiece, extremely high quality`;

  console.group(`🎨 [AI ENGINE: FLUX.1 DỰ PHÒNG] - ${outfitData.ten} (Góc ${angle}°)`);
  console.log('📌 OUTFIT ID:', outfitData.id, '| ANGLE:', angle);
  console.log('🚀 MODEL: FLUX.1 High Definition');
  console.log('📐 RESOLUTION: 896x1152 (HD Portrait Head-to-Toe)');
  console.log('📝 PROMPT HOÀN CHỈNH TIÊM VÀO FLUX:\n\n' + fullPrompt);
  console.groupEnd();

  const seed = Math.floor(Math.random() * 1000000);
  const encodedPrompt = encodeURIComponent(fullPrompt);

  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=896&height=1152&nologo=true&model=flux&enhance=true&seed=${seed}`;
}



/**
 * Load ảnh demo từ /public/generated/
 */
async function getDemoImage(outfitId, angle) {
  const url = `/generated/${outfitId}_${angle}deg.png`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Trả về placeholder nếu ảnh chưa có
      return null;
    }
    const blob = await response.blob();
    return await blobToBase64(blob);
  } catch {
    return null;
  }
}

/**
 * Load bộ ảnh turntable demo
 */
async function getDemoTurntableSet(outfitId) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const images = await Promise.all(
    angles.map(angle => getDemoImage(outfitId, angle))
  );
  return images;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
