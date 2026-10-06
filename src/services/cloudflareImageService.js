import { buildSnapshotPrompt } from './outfitPromptHelper';

/**
 * Service sinh ảnh cao cấp bằng FLUX.1 [schnell] qua Cloudflare Workers AI
 * Model: @cf/black-forest-labs/flux-1-schnell
 * Hạn mức miễn phí: 10,000 neurons/ngày (~250-300 ảnh/ngày)
 * Tốc độ: ~2-4 giây/ảnh
 */
export async function generateOutfitWithCloudflare(outfitData, angle = 0, customizations = {}, userPhotoBase64 = null, seed = null) {
  const accountId = import.meta.env.VITE_CF_ACCOUNT_ID;
  const apiToken = import.meta.env.VITE_CF_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error('Chưa cấu hình VITE_CF_ACCOUNT_ID hoặc VITE_CF_API_TOKEN trong file .env');
  }

  // Xây dựng prompt chi tiết
  const basePrompt = buildSnapshotPrompt(outfitData, angle, customizations);

  // Tối ưu độ dài prompt vì Cloudflare Workers AI giới hạn nghiêm ngặt prompt <= 2048 ký tự
  let cleanPrompt = basePrompt;
  if (cleanPrompt.length > 1750) {
    cleanPrompt = cleanPrompt.substring(0, 1750).replace(/,[^,]*$/, '');
  }

  // Tinh chỉnh prompt với các từ khóa kích thích chất lượng ảnh đỉnh cao
  let enhancedPrompt = `${cleanPrompt}, 8k portrait, cinematic natural lighting, award-winning photography, ultra-detailed fabric textures, traditional Vietnamese costume masterpiece, photorealistic`;

  if (userPhotoBase64) {
    enhancedPrompt += ', preserving Vietnamese youthful facial features, natural Asian skin tone and elegant posture';
  }

  // Khống chế nghiêm ngặt tối đa 2000 ký tự (Cloudflare giới hạn <= 2048)
  if (enhancedPrompt.length > 2000) {
    enhancedPrompt = enhancedPrompt.substring(0, 1980).replace(/,[^,]*$/, '') + ', 8k photorealistic';
  }

  console.group(`⚡ [CLOUDFLARE WORKERS AI - FLUX.1 SCHNELL] - ${outfitData.ten} (Góc ${angle}°)`);
  console.log('📌 OUTFIT:', outfitData.ten, '| GÓC:', angle, '| SEED:', seed);
  console.log('🚀 MODEL: @cf/black-forest-labs/flux-1-schnell');
  console.log('📝 PROMPT:\n', enhancedPrompt);
  console.groupEnd();

  // Dùng proxy /cloudflare-ai khi ở môi trường dev để tránh lỗi CORS
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev ? '/cloudflare-ai' : 'https://api.cloudflare.com';
  const endpoint = `${baseUrl}/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

  const bodyData = {
    prompt: enhancedPrompt,
    steps: 4
  };
  // Do NOT pass seed to CF Workers AI as it throws 400 Bad Request
  // if (seed !== null && seed !== undefined) {
  //   bodyData.seed = seed;
  // }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      const errText = await response.text();
      let errDetail = errText;
      try {
        const errJson = JSON.parse(errText);
        errDetail = errJson.errors?.[0]?.message || errText;
      } catch (_) { }
      throw new Error(`Cloudflare AI error (${response.status}): ${errDetail}`);
    }

    const data = await response.json();
    if (data.result && data.result.image) {
      console.log('✅ Sinh ảnh thành công qua Cloudflare FLUX.1 schnell!');
      return data.result.image; // Chuỗi base64 của ảnh JPEG
    } else {
      throw new Error('Cloudflare không trả về dữ liệu ảnh trong result.image');
    }
  } catch (error) {
    console.warn('⚠️ Cloudflare Workers AI gặp lỗi:', error.message);
    throw error;
  }
}
