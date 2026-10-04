import { createContext, useContext, useState, useEffect } from 'react';

const TRANSLATIONS = {
  vi: {
    // Navbar
    brand_title: 'Việt Phục',
    brand_title_remix: 'Remix',
    brand_subtitle: 'Di sản & Đương đại',
    nav_home: 'Trang chủ',
    nav_mixer: 'Phối đồ',
    nav_explore: 'Bảo tàng số',
    nav_compare: 'So sánh',
    nav_lookbook: 'Lookbook',
    nav_culture: 'Cẩm nang',
    nav_music_play: '🎵 Bật Nhạc',
    nav_music_playing: 'Lanterns on River',
    nav_music_toggle: 'Bật/Tắt Nhạc Nền',
    nav_music_on: 'Nhạc nền: BẬT',
    nav_music_off: 'Nhạc nền: TẮT',
    nav_petals_on: 'Cánh sen: Bật',
    nav_petals_off: 'Cánh sen: Tắt',
    nav_petals_short: 'Cánh sen',
    theme_dark: 'Sơn mài',
    theme_light: 'Giấy dó',
    lang_name: 'Tiếng Việt',
    lang_switch_tooltip: 'Chuyển sang tiếng Anh / Switch to English',

    // Hero Home
    hero_badge: '🌸 Di sản & Đương đại • AI Studio',
    hero_title_1: 'Mặc Việt, ',
    hero_title_2: 'phối theo cách của bạn',
    hero_desc: 'Khám phá và phối trang phục truyền thống Việt Nam theo sự kiện, vùng miền hoặc phong cách cá nhân Gen Z — chuẩn mực di sản, đậm chất riêng.',
    hero_btn_mix: '✨ Bắt đầu phối đồ',
    hero_btn_lookbook: '📚 Xem lookbook mẫu',
    hero_btn_music: '🎶 Nhạc Nền',
    hero_btn_music_play: '🎶 Bật Nhạc Nền',
    hero_btn_music_pause: '⏸ Tắt Nhạc Nền',
    hero_btn_guide: '❓ Hướng dẫn',

    // Quick Event Shortcuts
    event_shortcuts_badge: 'Chọn nhanh theo sự kiện',
    event_shortcuts_title: 'Hôm nay bạn cần trang phục cho ',
    event_shortcuts_question: 'dịp nào?',
    event_tet_title: 'Tết Nguyên Đán',
    event_tet_desc: 'Đoàn viên & sắc đỏ son may mắn, hỷ khí rước tài lộc',
    event_grad_title: 'Lễ tốt nghiệp',
    event_grad_desc: 'Dấu mốc trưởng thành, nghiêm trang và tự hào tà áo tấc',
    event_wedding_title: 'Đám cưới / Hỷ sự',
    event_wedding_desc: 'Ngày trọng đại lứa đôi, vương giả Nhật Bình & Ngũ thân',
    event_yearbook_title: 'Chụp kỷ yếu / Lễ hội',
    event_yearbook_desc: 'Lưu giữ thanh xuân rực rỡ, tinh nghịch và tươi trẻ',

    // Regional Strip
    regional_badge: 'Không gian địa lý',
    regional_title: 'Khám phá di sản theo ',
    regional_title_highlight: 'từng miền đất nước',
    reg_bac: 'Bắc Bộ',
    reg_bac_desc: 'Cái nôi văn hiến Thăng Long & Hội Lim',
    reg_trung: 'Trung Bộ',
    reg_trung_desc: 'Di sản Cố đô Huế & Triều Nguyễn',
    reg_nam: 'Nam Bộ',
    reg_nam_desc: 'Sông nước Cửu Long & Áo bà ba hào sảng',
    reg_highlands: 'Tây Nguyên & Dân tộc',
    reg_highlands_desc: 'Sắc thổ cẩm rực rỡ & Đại ngàn',

    // Daily Heritage Tips
    daily_tip_badge: 'Mẹo văn hóa trong ngày • Đã đối chiếu tư liệu',
    daily_tip_next: 'Đổi mẹo khác 🎲',
    daily_tip_source: 'Nguồn khảo cứu',

    // Steps & Stepper
    step_scene: 'Bối cảnh & sự kiện',
    step_outfit: 'Chọn y phục truyền thống',
    step_custom: 'Phối màu & phụ kiện',
    step_preview: 'Lookbook & Kết quả',
    step_prefix: 'Bước',
    step_of: '/',

    // Stepper Labels
    stepper_step1: '1. Bối cảnh',
    stepper_step2: '2. Chọn y phục',
    stepper_step3: '3. Phối đồ',
    stepper_step4: '4. Lookbook',

    // Angle selection
    angle_mode_title: 'Chế độ tạo ảnh',
    angle_mode_single: '1 góc chính diện (Nhanh)',
    angle_mode_multi: '4 góc xoay 360° (Chi tiết)',

    // Buttons
    btn_generate: 'Sinh ảnh Việt Phục AI',
    btn_generating: 'Đang dệt y phục AI...',
    btn_select_outfit: 'Chọn bộ này',
    btn_try_mix: 'Thử phối đồ',
    btn_learn_more: 'Tìm hiểu di sản',
    btn_download: 'Tải ảnh về máy',
    btn_reset: 'Tạo kiểu mới',

    // Culture Card
    culture_score_title: 'Đánh giá chuẩn mực & sáng tạo',
    culture_score_auth: 'Nguyên bản di sản',
    culture_score_remix: 'Phá cách hiện đại',
    culture_score_harmony: 'Hài hòa thẩm mỹ',
    culture_expand: 'Rê chuột hoặc bấm để xem chi tiết di sản',
    culture_collapse: 'Thu gọn thông tin',
    culture_meaning: 'Ý nghĩa văn hóa',
    culture_context: 'Bối cảnh phù hợp',
    culture_funfact: 'Điểm thú vị',
    culture_materials: 'Chất liệu vải',
    culture_palette: 'Bảng màu sắc',
    culture_accessories: 'Phụ kiện đi kèm',
    culture_source: 'Tư liệu tham khảo',

    // Chatbot
    chat_title: 'Cố Vấn Việt Phục',
    chat_subtitle: 'Chuyên gia văn hóa & thời trang cổ truyền',
    chat_placeholder: 'Hỏi về cách phối áo, bối cảnh, phụ kiện...',
    chat_send: 'Gửi',

    // Comparison & Lookbook
    compare_title: 'So sánh phương án trang phục',
    lookbook_title: 'Lookbook Y Phục Của Bạn',
    brand_identity_badge: 'Nhận diện thương hiệu chính thức',
    brand_identity_title: 'Logo Việt Phục Remix'
  },
  en: {
    // Navbar
    brand_title: 'Viet Phuc',
    brand_title_remix: 'Remix',
    brand_subtitle: 'Heritage & Modernity',
    nav_home: 'Home',
    nav_mixer: 'Mix & Match',
    nav_explore: 'Digital Museum',
    nav_compare: 'Compare',
    nav_lookbook: 'Lookbook',
    nav_culture: 'Handbook',
    nav_music_play: '🎵 Play BGM',
    nav_music_playing: 'Lanterns on River',
    nav_music_toggle: 'Toggle BGM',
    nav_music_on: 'BGM: ON',
    nav_music_off: 'BGM: OFF',
    nav_petals_on: 'Petals: On',
    nav_petals_off: 'Petals: Off',
    nav_petals_short: 'Petals',
    theme_dark: 'Lacquer',
    theme_light: 'Dó Paper',
    lang_name: 'English',
    lang_switch_tooltip: 'Switch to Vietnamese / Chuyển sang tiếng Việt',

    // Hero Home
    hero_badge: '🌸 Heritage & Modernity • AI Studio',
    hero_title_1: 'Wear Vietnamese, ',
    hero_title_2: 'styled your way',
    hero_desc: 'Explore and style traditional Vietnamese garments by occasion, region, or personal Gen Z aesthetics — heritage-accurate, distinctly yours.',
    hero_btn_mix: '✨ Start Styling',
    hero_btn_lookbook: '📚 Sample Lookbook',
    hero_btn_music: '🎶 BGM Music',
    hero_btn_music_play: '🎶 Play BGM',
    hero_btn_music_pause: '⏸ Pause BGM',
    hero_btn_guide: '❓ Guide',

    // Quick Event Shortcuts
    event_shortcuts_badge: 'Quick Event Shortcuts',
    event_shortcuts_title: 'Which occasion are you dressing for ',
    event_shortcuts_question: 'today?',
    event_tet_title: 'Lunar New Year (Tết)',
    event_tet_desc: 'Family reunion & auspicious crimson red, ushering luck and joy',
    event_grad_title: 'Graduation Ceremony',
    event_grad_desc: 'A milestone of maturity, stately and proud in flowing Áo Tấc',
    event_wedding_title: 'Weddings & Celebrations',
    event_wedding_desc: 'Grand nuptials, regal Nhật Bình & aristocratic Ngũ Thân',
    event_yearbook_title: 'Yearbook Photos & Festivals',
    event_yearbook_desc: 'Cherishing vibrant youth, playful, radiant, and contemporary',

    // Regional Strip
    regional_badge: 'Geographic Heritage',
    regional_title: 'Explore heritage across ',
    regional_title_highlight: 'the regions of Vietnam',
    reg_bac: 'Northern Vietnam',
    reg_bac_desc: 'Cradle of Thăng Long culture & Lim festival',
    reg_trung: 'Central Vietnam',
    reg_trung_desc: 'Imperial Huế & Nguyễn Dynasty royalty',
    reg_nam: 'Southern Vietnam',
    reg_nam_desc: 'Mekong Delta & breezy, warmhearted Áo Bà Ba',
    reg_highlands: 'Highlands & Minorities',
    reg_highlands_desc: 'Vibrant brocade weaves & majestic central highlands',

    // Daily Heritage Tips
    daily_tip_badge: 'Daily Cultural Insight • Verified Sources',
    daily_tip_next: 'Next Tip 🎲',
    daily_tip_source: 'Historical Source',

    // Steps & Stepper
    step_scene: 'Context & Occasion',
    step_outfit: 'Select Traditional Garment',
    step_custom: 'Color & Accessory Styling',
    step_preview: 'Lookbook & Results',
    step_prefix: 'Step',
    step_of: '/',

    // Stepper Labels
    stepper_step1: '1. Context',
    stepper_step2: '2. Garment',
    stepper_step3: '3. Styling',
    stepper_step4: '4. Lookbook',

    // Angle selection
    angle_mode_title: 'Rendering View Mode',
    angle_mode_single: 'Single Front Shot (Fast)',
    angle_mode_multi: '4-Angle 360° Turntable (Detailed)',

    // Buttons
    btn_generate: 'Generate AI Fitting',
    btn_generating: 'Weaving heritage silks...',
    btn_select_outfit: 'Select Outfit',
    btn_try_mix: 'Try This Outfit',
    btn_learn_more: 'Learn History',
    btn_download: 'Download Snapshot',
    btn_reset: 'Create New Look',

    // Culture Card
    culture_score_title: 'Heritage & Modernity Evaluation',
    culture_score_auth: 'Authentic Heritage',
    culture_score_remix: 'Modern Remix',
    culture_score_harmony: 'Aesthetic Harmony',
    culture_expand: 'Hover or tap to reveal heritage insights',
    culture_collapse: 'Collapse details',
    culture_meaning: 'Cultural Significance',
    culture_context: 'Suitable Occasions',
    culture_funfact: 'Did You Know?',
    culture_materials: 'Traditional Fabrics',
    culture_palette: 'Color Palette',
    culture_accessories: 'Heritage Accessories',
    culture_source: 'Historical References',

    // Chatbot
    chat_title: 'Heritage Consultant',
    chat_subtitle: 'Cultural & Traditional Fashion Specialist',
    chat_placeholder: 'Ask about tailoring, styling tips, etiquette...',
    chat_send: 'Send',

    // Comparison & Lookbook
    compare_title: 'Compare Outfit Options',
    lookbook_title: 'Your Heritage Lookbook',
    brand_identity_badge: 'Official Brand Identity',
    brand_identity_title: 'Logo Việt Phục Remix'
  }
};

const LanguageContext = createContext({
  lang: 'vi',
  setLang: () => {},
  toggleLang: () => {},
  t: (key) => key
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('vp_lang') || 'vi';
    } catch {
      return 'vi';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vp_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.vi[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
