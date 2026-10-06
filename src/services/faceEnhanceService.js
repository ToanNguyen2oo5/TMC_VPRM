import { Client } from "@gradio/client";

function base64ToBlob(base64, mimeType = "image/jpeg") {
  const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
  const byteString = atob(cleanBase64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

/**
 * Nâng cao chất lượng khuôn mặt (làm nét, đẹp da, tăng thiện cảm) bằng CodeFormer
 * @param {string} imageBase64OrUrl - Ảnh đã được ghép mặt
 * @returns {Promise<string>} Ảnh kết quả dạng base64
 */
export async function enhanceFaceOnImage(imageBase64OrUrl) {
  if (!imageBase64OrUrl) return imageBase64OrUrl;

  const hfToken = import.meta.env.VITE_HF_TOKEN;
  console.group("✨ [FACE-ENHANCE PIPELINE: LÀM ĐẸP & TĂNG THIỆN CẢM KHUÔN MẶT]");
  console.log("🌸 Sử dụng CodeFormer để làm mượt da, tăng độ nét, giữ thiện cảm...");
  console.groupEnd();

  try {
    let targetBlob;
    if (imageBase64OrUrl.startsWith("http") || imageBase64OrUrl.startsWith("/")) {
      const resp = await fetch(imageBase64OrUrl);
      targetBlob = await resp.blob();
    } else {
      targetBlob = base64ToBlob(imageBase64OrUrl, "image/jpeg");
    }

    const clientOptions = hfToken ? { token: hfToken } : {};
    const client = await Client.connect("sczhou/CodeFormer", clientOptions);
    
    // Tham số CodeFormer (dựa trên API chuẩn của space)
    // 0: image (Blob)
    // 1: face_align (true)
    // 2: background_enhance (true)
    // 3: face_upsample (true)
    // 4: upscale (2)
    // 5: codeformer_fidelity (0.3 - Tăng chất lượng làm đẹp nhưng vẫn giữ danh tính)
    const result = await client.predict("/inference", [
      targetBlob, 
      true, 
      true, 
      true, 
      2, 
      0.3
    ]);
    
    if (result && result.data && result.data[0]) {
      const enhancedUrl = result.data[0].url || result.data[0];
      console.log("✅ Làm đẹp khuôn mặt thành công!");
      
      const imgRes = await fetch(enhancedUrl);
      const blob = await imgRes.blob();
      
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      throw new Error("Không nhận được ảnh phản hồi từ CodeFormer Space");
    }
  } catch (error) {
    console.warn("⚠️ Face Enhance gặp lỗi, sử dụng ảnh cũ:", error.message);
    // Nếu lỗi thì trả về ảnh gốc để ứng dụng không bị crash
    return imageBase64OrUrl;
  }
}

