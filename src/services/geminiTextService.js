import { GoogleGenAI } from '@google/genai';

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

const TEXT_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-flash-latest'
];

/**
 * Schema cho structured output của culture card
 */
const CULTURE_CARD_SCHEMA = {
  type: 'object',
  properties: {
    ten: {
      type: 'string',
      description: 'Tên trang phục viết lại ngắn gọn, hấp dẫn'
    },
    y_nghia_dien_giai: {
      type: 'string',
      description: 'Ý nghĩa văn hóa được diễn giải lại bằng giọng văn Gen Z, thân thiện, 3-4 câu'
    },
    boi_canh_de_xuat: {
      type: 'string',
      description: 'Gợi ý bối cảnh sử dụng viết dạng casual, thân thiện, 2-3 câu'
    },
    fun_fact: {
      type: 'string',
      description: 'Một fun fact thú vị lấy từ thông tin nguồn, 1-2 câu'
    }
  },
  required: ['ten', 'y_nghia_dien_giai', 'boi_canh_de_xuat', 'fun_fact']
};

/**
 * Sinh mô tả văn hóa cho outfit bằng Gemini (structured output)
 * Chỉ diễn đạt lại dữ liệu từ JSON — KHÔNG tự sinh thông tin mới
 * 
 * @param {object} outfitData - Dữ liệu outfit từ trangphuc.json
 * @returns {Promise<object>} { ten, y_nghia_dien_giai, boi_canh_de_xuat, fun_fact }
 */
export async function generateCultureDescription(outfitData) {
  const prompt = `Bạn là một content creator Gen Z viết về văn hóa Việt Nam. 
Hãy diễn đạt lại thông tin trang phục truyền thống dưới đây bằng giọng văn trẻ trung, thân thiện, dễ hiểu — nhưng vẫn tôn trọng giá trị văn hóa.

QUAN TRỌNG: Chỉ dùng thông tin có trong dữ liệu bên dưới. TUYỆT ĐỐI KHÔNG tự bịa thêm sự kiện lịch sử, nhân vật, hoặc mốc thời gian không có trong nguồn.

Dữ liệu gốc:
- Tên: ${outfitData.ten}
- Vùng miền: ${outfitData.vung_mien}
- Ý nghĩa: ${outfitData.y_nghia}
- Màu sắc đặc trưng: ${outfitData.mau_dac_trung.join(', ')}
- Phụ kiện đi kèm: ${outfitData.phu_kien_di_kem.join(', ')}
- Bối cảnh phù hợp: ${outfitData.boi_canh_phu_hop.join(', ')}
- Nguồn tham khảo: ${outfitData.nguon_tham_khao}

Hãy viết lại theo format yêu cầu. Giọng văn: vui tươi, gần gũi Gen Z nhưng không quá suồng sã, vẫn giữ sự tôn trọng văn hóa.`;

  try {
    const genAI = getAI();

    for (const model of TEXT_MODELS) {
      try {
        const response = await genAI.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: CULTURE_CARD_SCHEMA,
            temperature: 0.7,
          }
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text);
        }
      } catch (modelErr) {
        console.warn(`⚠️ Model ${model} bận hoặc gặp sự cố (${modelErr.message}), thử model tiếp theo...`);
      }
    }
  } catch (error) {
    console.error('Lỗi khi sinh mô tả văn hóa:', error);
  }

  // Fallback: trả về dữ liệu gốc nếu API lỗi
  return {
    ten: outfitData.ten,
    y_nghia_dien_giai: outfitData.y_nghia,
    boi_canh_de_xuat: `Phù hợp cho: ${outfitData.boi_canh_phu_hop.join(', ')}`,
    fun_fact: `Trang phục đặc trưng vùng ${outfitData.vung_mien} với màu sắc ${outfitData.mau_dac_trung[0]}.`
  };
}
