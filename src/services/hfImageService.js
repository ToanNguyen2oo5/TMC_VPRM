import { Client } from "@gradio/client";
import { 
  buildSnapshotPrompt,
  SNAPSHOT_NEGATIVE_PROMPT
} from "./outfitPromptHelper";

function base64ToBlob(base64, mimeType = 'image/jpeg') {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

export async function generateOutfitImageWithFaceHF(userPhotoBase64, outfitData, angle = 0, customizations = {}) {
  // Xây dựng prompt chụp ảnh snapshot CCD Digicam & Kodak Portra 400
  const basePrompt = buildSnapshotPrompt(outfitData, angle, customizations);
  const prompt = `${basePrompt} Preserving exact facial identity, skin tone, facial features, and proportions from reference photo seamlessly onto this full-body person.`;
  const negPrompt = SNAPSHOT_NEGATIVE_PROMPT;

  const faceBlob = base64ToBlob(userPhotoBase64);

  // Tham số chuẩn của yanze/PuLID-FLUX
  // prompt, id_image, start_step, guidance, seed, true_cfg, width, height, num_steps, id_weight, neg_prompt, timestep_to_start_cfg, max_sequence_length
  const inputs = [
    prompt,
    faceBlob,
    4,        // start_step
    4,        // guidance
    -1,       // seed (random)
    1,        // true_cfg
    896,      // width
    1152,     // height
    20,       // num_steps
    1.0,      // id_weight
    negPrompt, // neg_prompt
    1,        // timestep_to_start_cfg
    128       // max_sequence_length
  ];

  console.group(`🎨 [HUGGING FACE FLUX PuLID PROMPT] - ${outfitData.ten} (Góc ${angle}°)`);
  console.log('📌 OUTFIT ID:', outfitData.id, '| ANGLE:', angle);
  console.log('📝 PROMPT HOÀN CHỈNH:\n\n' + prompt);
  console.log('🚫 NEGATIVE PROMPT:\n\n' + negPrompt);
  console.groupEnd();

  console.log("Đang kết nối tới Hugging Face Space (yanze/PuLID-FLUX)... Quá trình này có thể mất 1-3 phút nếu server đang ngủ.");
  
  try {
    const hfToken = import.meta.env.VITE_HF_TOKEN;
    const clientOptions = hfToken ? { token: hfToken } : {};
    const client = await Client.connect("yanze/PuLID-FLUX", clientOptions);
    console.log("Đã kết nối! Đang gửi yêu cầu sinh ảnh...");
    
    const result = await client.predict("generate_image", inputs);
    
    if (result && result.data && result.data[0]) {
      // result.data[0] là URL của ảnh kết quả
      const imageUrl = result.data[0].url || result.data[0];
      
      // Chuyển URL thành Base64
      const imageRes = await fetch(imageUrl);
      const blob = await imageRes.blob();
      
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      throw new Error("Không nhận được ảnh từ Hugging Face");
    }
  } catch (err) {
    console.error("Lỗi Hugging Face API:", err);
    throw new Error("Hugging Face API thất bại: " + err.message);
  }
}
