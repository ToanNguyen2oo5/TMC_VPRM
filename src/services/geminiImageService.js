import { GoogleGenAI } from '@google/genai';
import { generateOutfitImageWithFaceHF } from './hfImageService';
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

// Model chính: Gemini 3 Pro Image (Model sinh ảnh cao cấp nhất của Google DeepMind)
// Sẽ hoạt động khi người dùng cấu hình billing / pay-as-you-go trên Google AI Studio
const IMAGE_MODEL = 'gemini-3-pro-image';

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
 * Sinh ảnh mockup nhân vật mặc trang phục ở một góc cụ thể
 * @param {string|null} userPhotoBase64 - Ảnh người dùng dạng base64 (null nếu dùng nhân vật mẫu)
 * @param {object} outfitData - Dữ liệu outfit từ trangphuc.json
 * @param {number} angle - Góc xoay (0, 45, 90, 135, 180, 225, 270, 315)
 * @param {string|null} referenceImageBase64 - Ảnh tham chiếu (ảnh góc 0°) cho các góc sau
 * @returns {Promise<string>} base64 image data
 */
export async function generateOutfitImage(userPhotoBase64, outfitData, angle = 0, referenceImageBase64 = null, customizations = {}) {
  if (DEMO_MODE) {
    return getDemoImage(outfitData.id, angle);
  }

  // Nếu người dùng upload ảnh mặt, sử dụng Hugging Face FLUX PuLID (với token trong .env)
  if (userPhotoBase64) {
    try {
      console.log('Sử dụng Hugging Face FLUX PuLID cho:', outfitData.ten);
      return await generateOutfitImageWithFaceHF(userPhotoBase64, outfitData, angle, customizations);
    } catch (hfError) {
      console.warn('Hugging Face FLUX PuLID gặp lỗi hoặc hết Quota GPU:', hfError.message);
      console.info('Tự động chuyển tiếp sang Gemini API với ảnh khuôn mặt tham chiếu...');
    }
  }

  try {
    const genAI = getAI();
    const prompt = buildOutfitPrompt(outfitData, angle, customizations);

    const contents = [];

    // Build parts array
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

    contents.push({ role: 'user', parts });

    console.group(`🎨 [GEMINI IMAGE GENERATION PROMPT] - ${outfitData.ten} (Góc ${angle}°)`);
    console.log('📌 OUTFIT ID:', outfitData.id, '| ANGLE:', angle);
    console.log('📝 PROMPT HOÀN CHỈNH TIÊM VÀO MODEL:\n\n' + prompt);
    if (userPhotoBase64) {
      const facePart = parts.find(p => p.text && p.text.includes('tham chiếu'));
      if (facePart) {
        console.log('👤 LỆNH BẢO TOÀN KHUÔN MẶT THAM CHIẾU:\n\n' + facePart.text);
      }
    }
    console.groupEnd();

    const response = await genAI.models.generateContent({
      model: IMAGE_MODEL,
      contents: contents,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        console.log('✅ Sinh ảnh thành công bằng Google Gemini 3 Pro Image!');
        return part.inlineData.data;
      }
    }
    throw new Error('Gemini không trả về ảnh.');
  } catch (error) {
    const isQuotaError = error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED');
    if (isQuotaError) {
      console.warn('⚠️ Google Gemini API bị giới hạn Quota = 0 (Free Tier).');
    } else {
      console.warn('⚠️ Google Gemini API gặp lỗi:', error.message);
    }
    console.info('🚀 Tự động kích hoạt Model xịn thế hệ mới: FLUX.1 Realism (Black Forest Labs 12B - Ultra HD Photorealism)...');
    return await generateFallbackImage(outfitData, angle, customizations);
  }
}

/**
 * Sinh ảnh cao cấp bằng FLUX.1 Realism (Black Forest Labs 12B model qua Pollinations.ai)
 * Model FLUX.1 Realism chuyên tạo ảnh chân dung chân thực, độ nét cao, sợi chỉ thêu vàng và nếp vải rủ tự nhiên.
 * Độ phân giải chuẩn: 896x1152 (tỉ lệ 3:4 chân dung toàn thân sắc nét).
 */
async function generateFallbackImage(outfitData, angle = 0, customizations = {}) {
  const basePrompt = buildSnapshotPrompt(outfitData, angle, customizations);
  const fullPrompt = `${basePrompt} Negative prompt: ${SNAPSHOT_NEGATIVE_PROMPT}`;

  console.group(`🎨 [AI ENGINE: FLUX.1 REALISM (12B)] - ${outfitData.ten} (Góc ${angle}°)`);
  console.log('📌 OUTFIT ID:', outfitData.id, '| ANGLE:', angle);
  console.log('🚀 MODEL: FLUX.1 Realism (Black Forest Labs 12B Parameters - Ultra Photorealism)');
  console.log('📐 RESOLUTION: 896x1152 (HD Portrait Head-to-Toe)');
  console.log('📝 PROMPT HOÀN CHỈNH TIÊM VÀO FLUX:\n\n' + fullPrompt);
  console.groupEnd();

  // Random seed để các góc không bị trùng ảnh nếu prompt quá giống nhau
  const seed = Math.floor(Math.random() * 100000);
  const encodedPrompt = encodeURIComponent(fullPrompt);

  // FLUX.1 Realism với kích thước 896x1152, nologo=true, enhance=false để giữ nguyên prompt văn hóa chuẩn
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=896&height=1152&nologo=true&model=flux-realism&enhance=false&seed=${seed}`;
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
