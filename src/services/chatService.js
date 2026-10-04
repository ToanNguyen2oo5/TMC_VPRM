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

const CHAT_MODEL = 'gemini-3.8-flash';

const SYSTEM_INSTRUCTION = `Bạn là "Cố Vấn Việt Phục" — chuyên gia am hiểu sâu sắc về trang phục truyền thống Việt Nam (Việt Phục), bao gồm:
- Áo dài truyền thống (Huế, Hà Nội) & Áo dài cách tân đương đại
- Áo ngũ thân (lập lĩnh, tay chẽn, áo tấc) thời Nguyễn
- Áo Nhật Bình cung đình triều Nguyễn (quy chế màu sắc, ngũ hành, phụ kiện khăn vành dây, trâm phượng)
- Áo tứ thân Kinh Bắc (yếm đào, nón quai thao, bao xanh, liền chị quan họ)
- Áo giao lĩnh cổ truyền thời Lý - Trần - Lê
- Áo bà ba Nam Bộ & khăn rằn mộc mạc sông nước

Nhiệm vụ của bạn:
1. Tư vấn cho người dùng chọn trang phục phù hợp với từng dịp (cưới hỏi, lễ hội, kỷ yếu tốt nghiệp, dạo phố, chụp ảnh di sản).
2. Hướng dẫn phối màu sắc (tôn vinh ngũ hành, màu tương sinh, phối hiện đại Gen Z).
3. Hướng dẫn chọn phụ kiện chuẩn mực (nón lá, nón bài thơ, nón quai thao, kiềng bạc, khăn đóng, guốc mộc).
4. Nhắc nhở các lưu ý văn hóa lịch sự, tránh lai căng hoặc sai lệch cổ phong.

Phong cách trò chuyện:
- Lịch sự, nhã nhặn, am hiểu, gần gũi và truyền cảm hứng tự hào văn hóa dân tộc.
- Câu trả lời súc tích, ngắn gọn (tầm 2-4 đoạn ngắn), dùng gạch đầu dòng rõ ràng.
- Nếu người dùng hỏi điều ngoài chủ đề văn hóa / thời trang Việt Phục, nhẹ nhàng hướng họ quay lại chủ đề trang phục truyền thống.`;

// Các câu trả lời thông minh mẫu khi offline hoặc lỗi API
const FALLBACK_ANSWERS = {
  wedding: 'Trong ngày cưới trọng đại, các lựa chọn Việt phục tuyệt đẹp gồm:\n- **Cô dâu**: Áo Nhật Bình đỏ son thêu phượng hoàng hoặc Áo dài lụa thêu tơ sen cao cấp, kết hợp khăn vành dây.\n- **Chú rể**: Áo tấc / Áo ngũ thân xanh thẫm hoặc vàng đồng cài 5 cúc ngũ thường, đội khăn đóng nghiêm trang.\nSự kết hợp này vừa tôn vinh cội nguồn, vừa vô cùng lộng lẫy và sang trọng!',
  color: 'Bí quyết phối màu Việt phục thanh lịch:\n- **Cổ điển ngũ hành**: Thân áo chính màu son hoặc xanh chàm, quần lụa trắng ngà hoặc đen, dải yếm/viền màu vàng mỡ gà hoặc xanh ngọc.\n- **Hiện đại trẻ trung**: Tông màu pastel như hồng phấn, xanh mint, be kem kết hợp phụ kiện bạc tinh tế.',
  default: 'Xin chào! Tôi là Cố Vấn Việt Phục. Bạn đang cần tìm hiểu trang phục cho dịp lễ hội, cưới hỏi, hay muốn tư vấn cách phối màu sắc và phụ kiện cho Áo dài, Áo tấc, Nhật Bình hay Tứ thân?'
};

export async function sendChatMessage(chatHistory, userMessage) {
  try {
    const genAI = getAI();

    // Chuẩn bị contents array
    const contents = [];

    // Lịch sử tin nhắn gần nhất (tối đa 8 tin nhắn)
    const recentHistory = chatHistory.slice(-8);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Tin nhắn mới của user
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await genAI.models.generateContent({
      model: CHAT_MODEL,
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 600
      }
    });

    const reply = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('Không nhận được phản hồi từ model');
    return reply;
  } catch (error) {
    console.warn('Chatbot Gemini API error:', error.message);

    const lower = userMessage.toLowerCase();
    if (lower.includes('cưới') || lower.includes('hỏi') || lower.includes('hôn lễ')) {
      return FALLBACK_ANSWERS.wedding;
    }
    if (lower.includes('màu') || lower.includes('phối màu') || lower.includes('sắc')) {
      return FALLBACK_ANSWERS.color;
    }
    return FALLBACK_ANSWERS.default;
  }
}
