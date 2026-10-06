import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import SceneSelector from './components/SceneSelector';
import OutfitSuggestions from './components/OutfitSuggestions';
import OutfitCustomizer from './components/OutfitCustomizer';
import TurntableViewer from './components/TurntableViewer';
import CultureCard from './components/CultureCard';
import MismatchWarning from './components/MismatchWarning';
import LookbookExport from './components/LookbookExport';
import ExploreCostumes from './components/ExploreCostumes';
import OutfitComparison from './components/OutfitComparison';
import LookbookGallery from './components/LookbookGallery';
import CultureHub from './components/CultureHub';
import { filterOutfits, getAllOutfits } from './services/cultureData';
import { generateOutfitImage } from './services/geminiImageService';
import { evaluateCulturalWarnings } from './services/culturalWarningService';
import VietnamMap from './components/VietnamMap';
import ChatBot from './components/ChatBot';
import LotusPetals from './components/LotusPetals';
import LottieIcon from './components/LottieIcon';
import AppLogo from './components/AppLogo';
import MusicPlayer from './components/MusicPlayer';
import OnboardingModal from './components/OnboardingModal';
import RentalModal from './components/RentalModal';
import StickyStepper from './components/StickyStepper';
import MobileBottomNav from './components/MobileBottomNav';
import { lanternAnimation } from './assets/lottieAnimations';
import { useTheme } from './hooks/useTheme';
import { useTranslation } from './services/i18n.jsx';
import HeroCarousel from './components/HeroCarousel';
import WeatherCanvas from './components/weather/WeatherCanvas';
import { getRegionWeather } from './services/weatherService';
import WebARPage from './components/webar/WebARPage';
import LiquidNavbar from './motion/LiquidNavbar';
import SilkOverlay from './components/transitions/SilkOverlay';
import { useSmoothScroll } from './motion/useSmoothScroll';
import StorytellingHero from './components/home/HomeView';
import './App.css';


const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// 4 Thẻ lối tắt theo sự kiện trên trang chủ
const EVENT_SHORTCUTS = [
  { id: 'tet', title: 'Tết Nguyên Đán', icon: '🏮', desc: 'Đoàn viên & sắc đỏ son may mắn, hỷ khí rước tài lộc' },
  { id: 'tot-nghiep', title: 'Lễ tốt nghiệp', icon: '🎓', desc: 'Dấu mốc trưởng thành, nghiêm trang và tự hào tà áo tấc' },
  { id: 'dam-cuoi', title: 'Đám cưới / Hỷ sự', icon: '💒', desc: 'Ngày trọng đại lứa đôi, vương giả Nhật Bình & Ngũ thân' },
  { id: 'ky-yeu', title: 'Chụp kỷ yếu / Lễ hội', icon: '📸', desc: 'Lưu giữ thanh xuân rực rỡ, tinh nghịch và tươi trẻ' }
];

// Dải khám phá theo vùng miền
const REGIONAL_STRIPS = [
  { id: 'bac', name: 'Bắc Bộ', emoji: '🏔️', desc: 'Cái nôi văn hiến Thăng Long & Hội Lim' },
  { id: 'trung', name: 'Trung Bộ', emoji: '🌊', desc: 'Di sản Cố đô Huế & Triều Nguyễn' },
  { id: 'nam', name: 'Nam Bộ', emoji: '🌴', desc: 'Sông nước Cửu Long & Áo bà ba hào sảng' },
  { id: 'taynguyen', name: 'Tây Nguyên & Dân tộc', emoji: '🌲', desc: 'Sắc thổ cẩm rực rỡ & Đại ngàn' }
];

// Mẹo văn hóa trong ngày (Daily Heritage Tips)
const DAILY_TIPS = [
  {
    title: 'Ý nghĩa 5 nút cài áo ngũ thân',
    desc: 'Năm hạt nút cài áo tượng trưng cho Ngũ thường Nho giáo: Nhân, Lễ, Nghĩa, Trí, Tín — nền tảng đạo đức cốt lõi của người Việt xưa.',
    source: 'Trần Quang Đức, "Ngàn năm áo mũ"'
  },
  {
    title: 'Viền ngũ hành trên áo Nhật Bình',
    desc: 'Dải hoa văn viền cổ áo kết hợp 5 sắc tượng trưng cho ngũ hành tương sinh: Kim, Mộc, Thủy, Hỏa, Thổ mang lại sự trường tồn, cát tường cho bậc mẫu nghi thiên hạ.',
    source: 'Khâm định Đại Nam hội điển sự lệ'
  },
  {
    title: 'Chiếc nón quai thao & tơ tằm Kinh Bắc',
    desc: 'Nón ba tầm dẹp lọng tròn trịa, quai thao bằng tơ tằm thắt nút duyên dáng, đi cùng yếm đào thắm sắc tôn vinh nét e ấp tình tứ của liền chị Quan họ.',
    source: 'Đoàn Thị Tình, "Trang phục Việt Nam"'
  },
  {
    title: 'Khăn rằn thủy chung sông nước phương Nam',
    desc: 'Họa tiết sọc ô ca-rô hai màu đen trắng của chiếc khăn rằn Nam Bộ tượng trưng cho nghĩa tình trước sau như một của người dân miệt vườn châu thổ.',
    source: 'Bảo tàng Phụ nữ Nam Bộ'
  },
  {
    title: 'Quy cách vạt chéo Hữu Nhậm Đại Việt',
    desc: 'Cổ phục Đại Việt thời Lý - Trần - Lê luôn có vạt áo bên trái đè lên vạt bên phải (hữu nhậm), thể hiện sự hòa hợp âm dương giữa con người và đất trời.',
    source: 'Viện Khảo cổ học Việt Nam'
  }
];

// Map scene IDs to search terms matching trangphuc.json
const SCENE_MAP = {
  'tet': 'Tết',
  'tot-nghiep': 'lễ tốt nghiệp',
  'dam-cuoi': 'đám cưới',
  'ky-yeu': 'kỷ yếu',
  'le-hoi': 'lễ hội',
  'dao-pho': 'dạo phố',
  'chup-anh-di-san': 'chụp ảnh di sản',
};

const REGION_MAP = {
  'all': null,
  'bac': 'Bắc',
  'trung': 'Trung',
  'nam': 'Nam',
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useTranslation();
  const [petalsEnabled, setPetalsEnabled] = useState(() => {
    return localStorage.getItem('vp_petals') !== 'false';
  });

  const handleTogglePetals = () => {
    setPetalsEnabled(prev => {
      const next = !prev;
      localStorage.setItem('vp_petals', String(next));
      return next;
    });
  };

  // Navigation: 'home' | 'mixer' | 'explore' | 'compare' | 'lookbook' | 'culture'
  const [activeTab, _setActiveTab] = useState('home');
  const [pendingTab, setPendingTab] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setActiveTab = useCallback((newTab) => {
    if (newTab === activeTab) return;
    if (newTab === 'webar' || activeTab === 'webar') {
      _setActiveTab(newTab);
      return;
    }
    setPendingTab(newTab);
    setIsTransitioning(true);
  }, [activeTab]);

  const handleSilkHalfway = useCallback(() => {
    if (pendingTab) {
      _setActiveTab(pendingTab);
    }
  }, [pendingTab]);

  const handleSilkComplete = useCallback(() => {
    setIsTransitioning(false);
    setPendingTab(null);
    window.scrollTo({ top: 0 });
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.altKey) {
        switch(e.key.toLowerCase()) {
          case '1': setActiveTab('home'); break;
          case '2': setActiveTab('mixer'); break;
          case '3': setActiveTab('webar'); break;
          case '4': setActiveTab('explore'); break;
          case '5': setActiveTab('lookbook'); break;
          case '6': setActiveTab('culture'); break;
          default: break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  // Logo Variant: 'emblem' | 'crest'
  const [logoVariant] = useState(() => {
    return localStorage.getItem('vp_logo_variant') || 'emblem';
  });

  // Mixer Flow State
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [customizationData, setCustomizationData] = useState(null);
  const [turntableImages, setTurntableImages] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(null);
  const [cultureInfo, setCultureInfo] = useState(null);
  const [mismatchWarnings, setMismatchWarnings] = useState([]);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [angleMode, setAngleMode] = useState('single');
  const [isGeneratingRemaining, setIsGeneratingRemaining] = useState(false);
  const [remainingProgress, setRemainingProgress] = useState(null);
  const [generationSeed, setGenerationSeed] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState('warm');
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [realtimeWeather, setRealtimeWeather] = useState(null);
  const [activeWeatherScene, setActiveWeatherScene] = useState('sunny');

  // Weather states for Canvas
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    try {
      return localStorage.getItem('vp_reduced_motion') === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  });

  useSmoothScroll(activeTab !== 'webar');

  const handleRealtimeWeatherChange = useCallback((data) => {
    setRealtimeWeather(data);
    if (data?.scene) {
      setActiveWeatherScene(data.scene);
    }
  }, []);

  // Daily Cultural Tips & Onboarding Modal state
  const [tipIndex, setTipIndex] = useState(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !localStorage.getItem('vpr_onboarded'));
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    localStorage.setItem('vpr_onboarded', 'true');
  };

  const handleNextTip = () => {
    setTipIndex(prev => (prev + 1) % DAILY_TIPS.length);
  };

  const handleQuickEventSelect = (sceneId) => {
    setSelectedScene(sceneId);
    setSelectedRegion('all');
    setActiveTab('mixer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const ev = EVENT_SHORTCUTS.find(s => s.id === sceneId);
    showToast(`🎯 Đã chọn sự kiện: ${ev?.title || sceneId}! Hãy chọn bộ trang phục phù hợp bên dưới.`);
  };

  // App-wide state: Compared outfits & Saved Lookbooks
  const [comparedOutfits, setComparedOutfits] = useState([]);
  const [savedLookbooks, setSavedLookbooks] = useState(() => {
    try {
      const saved = localStorage.getItem('viet_phuc_lookbook');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync savedLookbooks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('viet_phuc_lookbook', JSON.stringify(savedLookbooks));
    } catch (e) {
      console.warn('Lỗi lưu lookbook vào localStorage:', e);
    }
  }, [savedLookbooks]);

  // Toast auto-hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Parse URL share parameters (Priority 5)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const searchParams = new URLSearchParams(window.location.search);
      const sharedOutfitId = searchParams.get('outfit');
      if (sharedOutfitId) {
        const found = getAllOutfits().find(o => o.id === sharedOutfitId);
        if (found) {
          const sharedScene = searchParams.get('scene') || 'tet';
          const primary = searchParams.get('primary') || '#A4262C';
          const secondary = searchParams.get('secondary') || '#C8A15A';
          const accent = searchParams.get('accent') || '#FBF7F0';
          const accParam = searchParams.get('acc');
          const accList = accParam ? accParam.split(',') : [];

          setSelectedOutfit(found);
          setSelectedScene(sharedScene);
          setCustomizationData({
            colors: { primary, secondary, accent },
            accessories: accList,
            customizations: { fit: 'Vừa vặn', length: 'Dài (chấm gót)' }
          });
          setActiveTab('mixer');
          showToast(`✨ Đã mở bộ phối được chia sẻ: ${found.ten}!`);
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc tham số URL chia sẻ:', e);
    }
  }, []);

  // Lấy thời tiết thời gian thực khi khởi động ứng dụng và cập nhật định kỳ mỗi 10 phút
  useEffect(() => {
    let isMounted = true;
    const fetchLiveWeather = async () => {
      try {
        const regionKey = (selectedRegion === 'all' || selectedRegion === 'taynguyen') ? 'bac' : selectedRegion;
        const data = await getRegionWeather(regionKey);
        if (isMounted && data) {
          setRealtimeWeather(data);
          if (data.scene) {
            setActiveWeatherScene(data.scene);
          }
        }
      } catch (err) {
        console.warn('Weather initial fetch failed:', err);
      }
    };

    fetchLiveWeather();
    const timer = setInterval(fetchLiveWeather, 10 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [selectedRegion]);

  // Compute active mixer step for Sticky Stepper (Priority 4)
  const currentMixerStep = useMemo(() => {
    if (turntableImages) return 4;
    if (selectedOutfit) return 3;
    if (selectedScene) return 2;
    return 1;
  }, [turntableImages, selectedOutfit, selectedScene]);

  const mixerStepTitle = useMemo(() => {
    switch (currentMixerStep) {
      case 1: return t('step_scene');
      case 2: return t('step_outfit');
      case 3: return t('step_custom');
      case 4: return t('step_preview');
      default: return t('nav_mixer');
    }
  }, [currentMixerStep, t]);

  // Refs for scrolling in mixer
  const outfitRef = useRef(null);
  const uploadRef = useRef(null);
  const resultRef = useRef(null);

  // Get filtered outfits for mixer
  const filteredOutfits = selectedScene
    ? filterOutfits({
      scene: SCENE_MAP[selectedScene],
      region: REGION_MAP[selectedRegion],
    })
    : getAllOutfits().slice(0, 4);

  // Handle scene selection
  const handleSceneSelect = useCallback((sceneId) => {
    setSelectedScene(sceneId);
    setSelectedOutfit(null);
    setTurntableImages(null);
    setError(null);
    setTimeout(() => {
      outfitRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 450);
  }, []);

  // Handle region filter
  const handleRegionSelect = useCallback((regionId) => {
    setSelectedRegion(regionId);
  }, []);

  // Handle outfit selection
  const handleOutfitSelect = useCallback((outfit) => {
    setSelectedOutfit(outfit);
    setTurntableImages(null);
    setError(null);

    // Evaluate cultural warnings
    const warnings = evaluateCulturalWarnings({
      outfit,
      event: selectedScene,
      accessories: [],
      colors: {}
    });
    setMismatchWarnings(warnings);

    const hasMajorWarning = warnings.some(w => w.type === 'warning');
    if (hasMajorWarning) {
      setTimeout(() => {
        const warnEl = document.getElementById('mismatch-warning');
        if (warnEl) {
          warnEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      showToast(`⚠️ ${warnings[0].title || 'Có lưu ý văn hóa khi chọn trang phục này!'}`);
    } else {
      setTimeout(() => {
        uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedScene]);

  // Handle quick switch to recommended outfit from warning banner
  const handleSwitchOutfit = useCallback((outfitId) => {
    const all = getAllOutfits();
    const target = all.find(o => o.id === outfitId);
    if (target) {
      handleOutfitSelect(target);
      showToast(`✨ Đã đổi sang ${target.ten}!`);
    }
  }, [handleOutfitSelect]);

  // Handle continuing despite cultural warning
  const handleContinueWithWarning = useCallback(() => {
    setMismatchWarnings([]);
    setTimeout(() => {
      uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    showToast('✨ Tiếp tục phối đồ theo phong cách tự do của bạn!');
  }, []);

  // Handle customize and generate
  const handleCustomizeAndGenerate = useCallback(async (data) => {
    if (!selectedOutfit) return;

    const chosenAngleMode = data.angleMode || 'single';
    setAngleMode(chosenAngleMode);
    setCustomizationData(data);
    setIsGenerating(true);
    setIsGeneratingRemaining(false);
    setRemainingProgress(null);
    setError(null);
    setTurntableImages(null);

    const isSingle = chosenAngleMode === 'single';
    setGenerateProgress({ current: 0, total: isSingle ? 1 : 4 });

    // Check cultural warnings with selected colors & accessories
    const warnings = evaluateCulturalWarnings({
      outfit: selectedOutfit,
      event: selectedScene,
      accessories: data.accessories || [],
      colors: data.colors || {}
    });
    setMismatchWarnings(warnings);

    try {
      setGenerateProgress({ current: 1, total: isSingle ? 1 : 4 });
      const outfitCustomPayload = {
        ...data.customizations,
        colors: data.colors,
        accessories: data.accessories
      };

      const currentSeed = Math.floor(Math.random() * 1000000);
      setGenerationSeed(currentSeed);

      let refImg = null;
      try {
        const svgEl = document.querySelector('.preview-visual-stage');
        if (svgEl) {
          const canvas = await html2canvas(svgEl, { backgroundColor: null });
          refImg = canvas.toDataURL('image/png').split(',')[1];
        }
      } catch (e) {
        console.warn('Failed to capture vector preview', e);
      }

      const frontImage = await generateOutfitImage(
        data.userPhoto,
        selectedOutfit,
        0,
        refImg,
        outfitCustomPayload,
        currentSeed
      );

      setTurntableImages([frontImage]);
      setIsGenerating(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

      // Background loading for other angles (90, 180, 270) ONLY IF multi angle mode
      if (!isSingle) {
        setIsGeneratingRemaining(true);
        const angles = [90, 180, 270];
        let step = 1;
        for (const angle of angles) {
          try {
            step++;
            setRemainingProgress({ current: step, total: 4, angle });
            await new Promise(r => setTimeout(r, 6000));
            const img = await generateOutfitImage(
              data.userPhoto,
              selectedOutfit,
              angle,
              frontImage,
              outfitCustomPayload,
              currentSeed
            );
            setTurntableImages(prev => {
              if (!prev) return [img];
              return [...prev, img];
            });
          } catch (e) {
            console.warn('Background gen failed for angle', angle);
          }
        }
        setIsGeneratingRemaining(false);
        setRemainingProgress(null);
      }
    } catch (err) {
      console.error('Lỗi sinh ảnh:', err);
      setError(err.message || 'Đã xảy ra lỗi khi tạo ảnh. Vui lòng thử lại.');
      setIsGenerating(false);
      setIsGeneratingRemaining(false);
    } finally {
      setGenerateProgress(null);
    }
  }, [selectedOutfit, selectedScene]);

  // Handle generating remaining 3 angles if user started with 1 angle
  const handleGenerateRemainingAngles = useCallback(async () => {
    if (!turntableImages || turntableImages.length === 0 || !selectedOutfit || isGeneratingRemaining) return;

    setIsGeneratingRemaining(true);
    setAngleMode('multi');
    setError(null);

    const frontImage = turntableImages[0];
    const outfitCustomPayload = customizationData ? {
      ...customizationData.customizations,
      colors: customizationData.colors,
      accessories: customizationData.accessories
    } : {};

    const allAngles = [90, 180, 270];
    const alreadyCount = turntableImages.length;
    const anglesToGenerate = allAngles.slice(alreadyCount - 1);
    let step = alreadyCount;

    try {
      for (const angle of anglesToGenerate) {
        step++;
        setRemainingProgress({ current: step, total: 4, angle });
        await new Promise(r => setTimeout(r, 4000));
        const img = await generateOutfitImage(
          customizationData?.userPhoto,
          selectedOutfit,
          angle,
          frontImage,
          outfitCustomPayload,
          generationSeed
        );
        setTurntableImages(prev => {
          if (!prev) return [img];
          return [...prev, img];
        });
      }
      showToast('🎉 Đã tạo thành công đủ 4 góc xoay 360°!');
    } catch (err) {
      console.error('Lỗi tạo thêm góc xoay:', err);
      showToast('⚠️ Không thể tạo thêm một số góc: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setIsGeneratingRemaining(false);
      setRemainingProgress(null);
    }
  }, [turntableImages, selectedOutfit, customizationData, isGeneratingRemaining]);

  // Reset mixer flow
  const handleReset = useCallback(() => {
    setSelectedScene(null);
    setSelectedRegion('all');
    setSelectedOutfit(null);
    setCustomizationData(null);
    setTurntableImages(null);
    setIsGenerating(false);
    setIsGeneratingRemaining(false);
    setRemainingProgress(null);
    setGenerateProgress(null);
    setCultureInfo(null);
    setMismatchWarnings([]);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Save current outfit combo to Lookbook
  const handleSaveToLookbook = () => {
    if (!selectedOutfit) return;
    const newEntry = {
      id: 'look_' + Date.now(),
      outfitName: selectedOutfit.ten,
      outfit: selectedOutfit,
      scene: SCENE_MAP[selectedScene] || 'Tự do',
      region: selectedOutfit.vung_mien,
      colors: customizationData?.colors || { primary: '#B22222', secondary: '#DAA520', accent: '#FAF9F6' },
      accessories: customizationData?.accessories || [],
      evalScores: customizationData?.evalScores || { totalScore: 92 },
      image: turntableImages ? turntableImages[0] : selectedOutfit.anh_dai_dien,
      createdAt: new Date().toISOString(),
      likes: 1
    };

    setSavedLookbooks(prev => [newEntry, ...prev]);
    showToast('💖 Đã lưu set đồ thành công vào Lookbook của bạn!');
  };

  // Add current outfit combo to Comparison list
  const handleAddToCompare = () => {
    if (!selectedOutfit) return;
    if (comparedOutfits.length >= 3) {
      showToast('⚠️ Bạn chỉ có thể so sánh tối đa 3 bộ cùng lúc. Hãy xóa bớt 1 bộ trong tab So sánh nhé!');
      return;
    }

    const exists = comparedOutfits.some(item => item.outfit.id === selectedOutfit.id);
    if (exists) {
      showToast('ℹ️ Bộ trang phục này đã có trong danh sách so sánh.');
      return;
    }

    const newCompareItem = {
      id: 'comp_' + Date.now(),
      outfit: selectedOutfit,
      event: SCENE_MAP[selectedScene] || 'Tự do',
      colors: customizationData?.colors || { primary: '#B22222', secondary: '#DAA520', accent: '#FAF9F6' },
      accessories: customizationData?.accessories || [],
      evalScores: customizationData?.evalScores || { harmonyScore: 90, culturalFit: 95, genZScore: 88, totalScore: 91 },
      warnings: mismatchWarnings,
      image: turntableImages ? turntableImages[0] : selectedOutfit.anh_dai_dien
    };

    setComparedOutfits(prev => [...prev, newCompareItem]);
    showToast('⚖️ Đã thêm vào danh sách So sánh phương án!');
  };

  // Nạp 2 phương án mẫu để so sánh ngay lập tức
  const handleLoadSampleOutfits = useCallback(() => {
    const all = getAllOutfits();
    const aoDaiCachTan = all.find(o => o.id === 'ao_dai_cach_tan');
    const aoTac = all.find(o => o.id === 'ao_ngu_than_ao_tac');
    if (!aoDaiCachTan || !aoTac) return;

    const sample1 = {
      id: 'sample_compare_1',
      outfit: aoDaiCachTan,
      image: '/generated/ao_dai_cach_tan_0deg.png',
      event: 'Kỷ yếu & Dạo phố',
      colors: { primary: '#E8A598', secondary: '#F5E6D3', accent: '#D4AF37' },
      accessories: ['Túi clutch', 'Giày mules hiện đại'],
      evalScores: { harmonyScore: 92, culturalScore: 88, genZScore: 96, totalScore: 92 }
    };

    const sample2 = {
      id: 'sample_compare_2',
      outfit: aoTac,
      image: '/generated/ao_the_khan_xep_0deg.png',
      event: 'Lễ tốt nghiệp & Kỷ yếu trang nghiêm',
      colors: { primary: '#1B365D', secondary: '#FAF9F6', accent: '#C5A059' },
      accessories: ['Khăn đóng truyền thống', 'Quạt lụa'],
      evalScores: { harmonyScore: 96, culturalScore: 98, genZScore: 84, totalScore: 93 }
    };

    setComparedOutfits([sample1, sample2]);
    showToast('⚖️ Đã nạp 2 phương án so sánh mẫu: Áo dài cách tân vs Áo tấc!');
  }, []);

  // Handle selection from Explore or Lookbook -> load into mixer
  const handleSelectFromOtherViews = (outfitItem) => {
    const targetOutfit = outfitItem.outfit || outfitItem;
    setSelectedOutfit(targetOutfit);
    setSelectedScene('tet');
    setActiveTab('mixer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`👗 Đã chọn ${targetOutfit.ten}! Hãy tùy chỉnh màu sắc và phụ kiện.`);
  };

  return (
    <div className="app">
      <SilkOverlay 
        isAnimating={isTransitioning} 
        pendingTab={pendingTab} 
        onHalfway={handleSilkHalfway} 
        onComplete={handleSilkComplete} 
      />

      {/* HIỆU ỨNG THỜI TIẾT REAL-TIME BAO PHỦ CẢ TRANG WEB (WeatherFX) */}
      <WeatherCanvas
        scene={activeWeatherScene}
        isReducedMotion={isReducedMotion}
        isFullScreen={true}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification animate-bounce-in">
          {toastMessage}
        </div>
      )}

      {/* TOP NAVIGATION BAR - LIQUID GLASS */}
      <LiquidNavbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logoVariant={logoVariant}
        t={t}
        comparedOutfits={comparedOutfits}
        savedLookbooks={savedLookbooks}
        realtimeWeather={realtimeWeather}
        petalsEnabled={petalsEnabled}
        handleTogglePetals={handleTogglePetals}
        lang={lang}
        toggleLang={toggleLang}
        theme={theme}
        toggleTheme={toggleTheme}
        showToast={showToast}
      />

      {/* VIEW 1: HOME */}
      {activeTab === 'home' && (
        <div className="home-view">
          <StorytellingHero 
            EVENT_SHORTCUTS={EVENT_SHORTCUTS}
            handleQuickEventSelect={handleQuickEventSelect}
            handleSelectFromOtherViews={handleSelectFromOtherViews}
            t={t}
          />

          {/* 2. DẢI KHÁM PHÁ THEO VÙNG MIỀN */}
          <section className="container regional-explore-strip animate-fade-in-up">
            <div className="section-header text-center" style={{ marginBottom: '0.75rem' }}>
              <span className="section-badge">{t('regional_badge')}</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', margin: '0.2rem 0' }}>
                {t('regional_title')}<span className="text-gradient">{t('regional_title_highlight')}</span>
              </h3>
            </div>
            <div className="regional-strip-grid">
              {REGIONAL_STRIPS.map(reg => {
                const regName = reg.id === 'bac' ? t('reg_bac') :
                  reg.id === 'trung' ? t('reg_trung') :
                    reg.id === 'nam' ? t('reg_nam') :
                      t('reg_highlands');
                const regDesc = reg.id === 'bac' ? t('reg_bac_desc') :
                  reg.id === 'trung' ? t('reg_trung_desc') :
                    reg.id === 'nam' ? t('reg_nam_desc') :
                      t('reg_highlands_desc');
                return (
                  <button
                    key={reg.id}
                    type="button"
                    className="regional-strip-card glass-panel"
                    onClick={() => {
                      setSelectedRegion(reg.id);
                      setActiveTab('mixer');
                      showToast(`📍 ${lang === 'en' ? 'Filtered by region: ' : 'Đã lọc trang phục vùng: '}${regName}`);
                    }}
                  >
                    <span className="regional-strip-emoji">{reg.emoji}</span>
                    <div>
                      <span className="regional-strip-title">{regName}</span>
                      <span className="regional-strip-desc">{regDesc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. PHẦN MẸO VĂN HÓA TRONG NGÀY (DAILY HERITAGE TIP) */}
          <section className="container daily-tip-container animate-fade-in-up">
            <div className="daily-tip-card glass-panel">
              <div className="daily-tip-content">
                <span className="daily-tip-badge">
                  <span>💡</span> {t('daily_tip_badge')}
                </span>
                <h4 className="daily-tip-title">{DAILY_TIPS[tipIndex].title}</h4>
                <p className="daily-tip-desc">{DAILY_TIPS[tipIndex].desc}</p>
                <small className="daily-tip-source">{t('daily_tip_source')}: {DAILY_TIPS[tipIndex].source}</small>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleNextTip}
                title={lang === 'en' ? 'Explore next cultural tip' : 'Khám phá mẹo văn hóa tiếp theo'}
              >
                {t('daily_tip_next')}
              </button>
            </div>
          </section>

          {/* Bản đồ di sản 3 miền Bắc - Trung - Nam */}
          <div className="container" style={{ margin: '2.5rem auto 1.5rem' }}>
            <VietnamMap onSelectOutfitForMixer={handleSelectFromOtherViews} />
          </div>

          {/* Highlights Section */}
          <section className="container home-highlights">
            <div className="section-header text-center">
              <span className="section-badge">Bộ sưu tập tiêu biểu</span>
              <h2 className="section-title">Trang phục <span className="text-gradient">nổi bật</span></h2>
              <p className="section-subtitle">Chiêm ngưỡng những tinh hoa trang phục qua các triều đại lịch sử</p>
            </div>

            <div className="highlights-grid">
              {getAllOutfits().slice(0, 4).map((outfit, i) => (
                <div key={outfit.id} className="highlight-card glass-card animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="highlight-card__header">
                    <span className="costume-tag tag-region">{outfit.vung_mien}</span>
                    <span className="highlight-era">{outfit.era}</span>
                  </div>
                  <h3 className="highlight-title">{outfit.ten}</h3>
                  <p className="highlight-desc">{outfit.mo_ta_ngan}</p>
                  <div className="highlight-actions">
                    <button
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() => handleSelectFromOtherViews(outfit)}
                    >
                      ✨ Thử phối bộ này
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="home-banner-hub glass-panel animate-fade-in-up">
              <div className="banner-text">
                <h3>📖 Bạn có biết ý nghĩa của 5 nút cài áo ngũ thân?</h3>
                <p>Năm hạt nút tượng trưng cho Ngũ thường của Nho giáo: Nhân, Lễ, Nghĩa, Trí, Tín — nền tảng đạo đức của người Việt xưa.</p>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveTab('culture')}>
                Tìm hiểu thêm ở Văn hóa ➔
              </button>
            </div>

            {/* Banner Tư Vấn AI Cổ Phục */}
            <div className="home-banner-hub glass-panel animate-fade-in-up" style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <img
                  src="/src/assets/images/ai_stylist_avatar_1791041447024.jpg"
                  alt="Cố Vấn AI"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--color-gold)',
                    boxShadow: '0 0 15px rgba(212, 160, 23, 0.4)',
                    flexShrink: 0
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="banner-text">
                  <h3>💬 Cố Vấn Việt Phục AI: Tư vấn chọn & phối trang phục</h3>
                  <p>Hỏi đáp trực tiếp về lễ phục ngày cưới, kỷ yếu, sự kiện, quy tắc phối màu ngũ hành và phụ kiện cung đình truyền thống.</p>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const fab = document.querySelector('.chatbot-fab');
                  if (fab) fab.click();
                }}
              >
                ✨ Mở Cửa Sổ Tư Vấn AI
              </button>
            </div>

            {/* Banner Mạng Lưới Thuê Cổ Phục & Đơn Nhóm Kỷ Yếu */}
            <div className="home-banner-hub glass-panel animate-fade-in-up" style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>👘</span>
                <div className="banner-text">
                  <h3>👘 Mạng Lưới Thuê Cổ Phục & Ưu Đãi Kỷ Yếu Lớp (-25%)</h3>
                  <p>Kết nối hơn 6+ tiệm cổ phục đối tác tại Hà Nội, Huế, TP.HCM với quỹ bảo chứng cọc minh bạch và ưu đãi đặc quyền cho học sinh - sinh viên.</p>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ background: 'linear-gradient(135deg, rgba(218, 165, 32, 0.25) 0%, rgba(139, 0, 0, 0.3) 100%)', borderColor: '#daa520' }}
                onClick={() => setIsRentalModalOpen(true)}
              >
                🤝 Mở Danh Bạ & Dự Toán
              </button>
            </div>

            {/* Banner Gương Soi WebAR Thử Phụ Kiện Với Camera */}
            <div className="home-banner-hub glass-panel animate-fade-in-up" style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>🪞</span>
                <div className="banner-text">
                  <h3>🪞 Gương Soi WebAR: Thử Khăn Đóng, Nón Lá, Nón Quai Thao</h3>
                  <p>Bật camera để phụ kiện cổ phục bám theo khuôn mặt bạn theo thời gian thực (Real-time Face Tracking) và chụp ảnh lưu lại khoảnh khắc di sản.</p>
                </div>
              </div>
              <button
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #d4a017 0%, #c0392b 100%)' }}
                onClick={() => {
                  setActiveTab('webar');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                ✨ Mở Gương WebAR
              </button>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: MIX & MATCH (PHỐI ĐỒ 5 BƯỚC) */}
      {activeTab === 'mixer' && (
        <div className="mixer-view">
          <main className="container main-content" style={{ position: 'relative', zIndex: 10 }}>
            {/* Sticky Stepper (Priority 4) */}
            <StickyStepper currentStep={currentMixerStep} stepTitle={mixerStepTitle} />

          {/* Step 1: Scene Selection */}
          <SceneSelector
            onSceneSelect={handleSceneSelect}
            onRegionSelect={handleRegionSelect}
            selectedScene={selectedScene}
            selectedRegion={selectedRegion}
            selectedWeather={selectedWeather}
            onWeatherSelect={setSelectedWeather}
            selectedStyle={selectedStyle}
            onStyleSelect={setSelectedStyle}
            onRealtimeWeatherChange={handleRealtimeWeatherChange}
            activeWeatherScene={activeWeatherScene}
            onWeatherSceneChange={setActiveWeatherScene}
          />

          {/* Step 2: Outfit Suggestions */}
          <div ref={outfitRef}>
            <OutfitSuggestions
              outfits={filteredOutfits}
              onSelect={handleOutfitSelect}
              selectedId={selectedOutfit?.id}
              selectedScene={selectedScene}
              selectedRegion={selectedRegion}
              onRegionSelect={handleRegionSelect}
              realtimeWeather={realtimeWeather}
              onRealtimeWeatherChange={handleRealtimeWeatherChange}
            />
          </div>

          {/* Cultural Warnings Banner */}
          <MismatchWarning
            warnings={mismatchWarnings}
            onDismiss={() => setMismatchWarnings([])}
            onSwitchOutfit={handleSwitchOutfit}
            onContinue={handleContinueWithWarning}
          />

          {/* Step 3 & 4: Customizer (Colors + Accessories + Fit + Avatar) */}
          {selectedOutfit && (
            <div ref={uploadRef}>
              <OutfitCustomizer
                selectedOutfit={selectedOutfit}
                selectedScene={selectedScene}
                onCustomizeAndGenerate={handleCustomizeAndGenerate}
                isGenerating={isGenerating}
              />
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="error-banner animate-fade-in" id="error-banner">
              <span className="error-banner__icon">❌</span>
              <div className="error-banner__content">
                <strong>Đã xảy ra lỗi kết nối hoặc tạo ảnh</strong>
                <p>{error}</p>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  {customizationData && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setError(null);
                        handleCustomizeAndGenerate(customizationData);
                      }}
                    >
                      🔄 Thử lại thao tác
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setError(null)}
                  >
                    Bỏ qua
                  </button>
                </div>
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setError(null)}
                aria-label="Đóng thông báo lỗi"
              >
                ✕
              </button>
            </div>
          )}

          {/* Step 5: Results Section — Viewer + Culture Card + Multi-actions */}
          <div ref={resultRef}>
            {(isGenerating || turntableImages) && (
              <div className="result-container animate-fade-in">
                <div className="result-split-layout">
                  <div className="result-viewer">
                    <TurntableViewer
                      images={turntableImages}
                      isLoading={isGenerating}
                      progress={generateProgress}
                      angleMode={angleMode}
                      isGeneratingRemaining={isGeneratingRemaining}
                      remainingProgress={remainingProgress}
                      onGenerateRemaining={handleGenerateRemainingAngles}
                      selectedOutfit={selectedOutfit}
                      customizationData={customizationData}
                    />

                    {/* Thanh công cụ hành động nhanh chuyển sang dưới ảnh (cột trái) */}
                    {turntableImages && selectedOutfit && (
                      <div className="result-actions-panel glass-panel" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                          className="btn btn-primary btn-block"
                          onClick={handleSaveToLookbook}
                        >
                          💖 Lưu vào Lookbook cá nhân
                        </button>
                        <button
                          className="btn btn-secondary btn-block"
                          onClick={handleAddToCompare}
                        >
                          ⚖️ Thêm vào danh sách So sánh ({comparedOutfits.length}/3)
                        </button>
                        <button
                          className="btn btn-primary btn-block"
                          style={{
                            background: 'linear-gradient(135deg, #b8860b 0%, #8b0000 100%)',
                            borderColor: '#ffd700',
                            boxShadow: '0 4px 15px rgba(218, 165, 32, 0.35)'
                          }}
                          onClick={() => setIsRentalModalOpen(true)}
                        >
                          👘 Tìm tiệm thuê & Dự toán kỷ yếu
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="result-sidebar">
                    {turntableImages && selectedOutfit && (
                      <CultureCard
                        outfit={selectedOutfit}
                        useDemoData={DEMO_MODE}
                        customizations={customizationData?.customizations}
                      />
                    )}
                  </div>
                </div>

                {/* Chuyển khu vực Lookbook Export xuống Full-width bên dưới layout cột */}
                {turntableImages && selectedOutfit && (
                  <div style={{ marginTop: '2rem' }}>
                    <LookbookExport
                      outfit={selectedOutfit}
                      imageBase64={turntableImages[0]}
                      cultureInfo={cultureInfo}
                      colors={customizationData?.colors}
                      accessories={customizationData?.accessories}
                      scene={SCENE_MAP[selectedScene]}
                      onToast={showToast}
                    />
                  </div>
                )}

                {/* Reset and Edit buttons */}
                <div className="reset-section text-center" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg"
                    onClick={() => {
                      uploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    ✏️ Điều chỉnh màu & phụ kiện
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleReset}
                    id="reset-btn"
                  >
                    🔄 Phối bộ khác
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        </div>
      )}

      {/* VIEW: WEBAR ACCESSORY TRY-ON */}
      {activeTab === 'webar' && (
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <WebARPage
            onExit={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToast={showToast}
          />
        </div>
      )}

      {/* VIEW 3: EXPLORE COSTUMES */}
      {activeTab === 'explore' && (
        <div className="container">
          <ExploreCostumes onSelectForMixer={handleSelectFromOtherViews} />
        </div>
      )}

      {/* VIEW 4: COMPARE OUTFITS */}
      {activeTab === 'compare' && (
        <div className="container">
          <OutfitComparison
            comparedOutfits={comparedOutfits}
            onRemoveOutfit={(id) => setComparedOutfits(prev => prev.filter((_, idx) => idx !== id && _.id !== id))}
            onSelectOutfit={handleSelectFromOtherViews}
            onLoadSampleOutfits={handleLoadSampleOutfits}
          />
        </div>
      )}

      {/* VIEW 5: LOOKBOOK GALLERY */}
      {activeTab === 'lookbook' && (
        <div className="container">
          <LookbookGallery
            savedOutfits={savedLookbooks}
            onRemoveFromLookbook={(id) => setSavedLookbooks(prev => prev.filter(item => item.id !== id))}
            onSelectOutfit={handleSelectFromOtherViews}
          />
        </div>
      )}

      {/* VIEW 6: CULTURE HUB */}
      {activeTab === 'culture' && (
        <div className="container">
          <CultureHub />
        </div>
      )}

      {/* Global Footer */}
      <footer className="footer">
        <div className="container footer__content">
          <div className="footer__brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <LottieIcon animationData={lanternAnimation} size={28} />
            <span className="footer__name">Việt Phục Remix</span>
          </div>
          <p className="footer__tagline">
            Tôn vinh vẻ đẹp trang phục truyền thống Việt Nam qua lăng kính thời trang sáng tạo Gen Z
          </p>
          <div className="footer__meta">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>AI Arena Vietnam 2026</span>
            <span>•</span>
            <span onClick={() => setActiveTab('culture')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              Nguồn tư liệu di sản
            </span>
            <span>•</span>
            <span onClick={() => setIsOnboardingOpen(true)} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--color-gold)' }}>
              Hướng dẫn sử dụng
            </span>
          </div>
        </div>
      </footer>

      {/* Thanh điều hướng dưới đáy trên mobile (<= 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        compareCount={comparedOutfits.length}
        lookbookCount={savedLookbooks.length}
      />

      {/* Hiệu ứng cánh sen rơi phủ khắp giao diện */}
      <LotusPetals enabled={petalsEnabled && activeTab !== 'mixer'} />

      {/* Cố vấn Việt Phục AI Chatbot */}
      <ChatBot />

      {/* Onboarding Modal 3 bước ngắn */}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={handleCloseOnboarding} />

      {/* Mạng lưới tiệm cổ phục & Dự toán kỷ yếu */}
      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        outfit={selectedOutfit || getAllOutfits()[0]}
        onToast={showToast}
      />
    </div>
  );
}
