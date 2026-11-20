/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Maximize2,
  X,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { trByLang } from '../utils/i18n';
import { Ml7Text } from './Ml7Text';

interface ExploreSlide {
  id: string;
  image: string;
  tabLabel: { ar: string; ku: string; en: string };
  kicker: { ar: string; ku: string; en: string };
  title: { ar: string; ku: string; en: string };
  description: { ar: string; ku: string; en: string };
  highlights: { ar: string[]; ku: string[]; en: string[] };
}

const EXPLORE_SLIDES: ExploreSlide[] = [
  {
    id: 'overview',
    image: '/assets/aistudio/Screenshot_2026-11-19-12-30-54-905_com.android.chrome_f70b66cb.jpg',
    tabLabel: { ar: 'لوحة المتابعة', ku: 'داشبۆردی سەرەکی', en: 'Overview' },
    kicker: { ar: 'نظرة عامة فورية', ku: 'بینینی خێرا', en: 'Live Overview' },
    title: {
      ar: 'لوحة رئيسية تجمع المبيعات والزيارات وجاهزية المنيو',
      ku: 'پەڕەی سەرەکی بۆ بینینی فرۆش و سەردانەکان',
      en: 'Real-Time Store Pulse & Menu Readiness',
    },
    description: {
      ar: 'تابع زيارات القائمة، صافي الطلبات والمبيعات لحظة بلحظة من شاشة واحدة واضحة، مع قائمة ذكية تقيس نسبة اكتمال جاهزية متجرك وتنبهك لأي خطوة ناقصة.',
      ku: 'چاودێری سەردانەکانی مینیۆ و فرۆش و داواکارییەکان بکە لە یەک شاشەدا لەگەڵ ڕێنمایی ئامادەکاری.',
      en: 'Track menu visits, completed orders, and total sales at a glance alongside a guided readiness checklist so nothing is missed before launch.',
    },
    highlights: {
      ar: [
        'عداد مباشر لزيارات المنيو وصافي الطلبات والمبيعات',
        'مؤشر نسبة اكتمال الجاهزية مع خطوات عملية للتطوير',
        'متابعة حالة ربط بوت تيليجرام وقنوات استقبال الطلبات',
      ],
      ku: [
        'ژماردنی ڕاستەوخۆی سەردان و داواکاری و فرۆشەکان',
        'نیشاندەری ڕێژەی ئامادەبوونی مینیۆ و هەنگاوەکان',
        'پشکنینی پەیوەندی بۆتی تەلەگرام و کەناڵەکان',
      ],
      en: [
        'Instant counters for menu views, net orders, and sales',
        'Readiness score checklist with actionable store tips',
        'Direct visibility into Telegram & WhatsApp order status',
      ],
    },
  },
  {
    id: 'navigation',
    image: '/assets/aistudio/Screenshot_2026-11-19-12-31-00-516_com.android.chrome_98867230.jpg',
    tabLabel: { ar: 'التنقل السريع', ku: 'گەڕانی خێرا', en: 'Quick Menu' },
    kicker: { ar: 'إدارة سلسة ومنظمة', ku: 'بەڕێوەبردنی ئاسان', en: 'Unified Control' },
    title: {
      ar: 'قائمة تحكم تجمع كل أدوات مشروعك في متناول يدك',
      ku: 'لیستی کۆنترۆڵی خێرا بۆ هەموو بەشەکان',
      en: 'All Store Tools Organized in One Drawer',
    },
    description: {
      ar: 'تجوّل بسلاسة بين الأقسام، الأصناف، الطلبات الحية، تخصيص المظهر، إدارة الأفرع المتعددة، كود الـ QR، الإحصائيات الاحترافية وإعدادات تيليجرام من قائمة واحدة واضحة.',
      ku: 'بە ئاسانی هاتوچۆ بکە لە نێوان بەشەکان، خواردنەکان، داواکارییەکان، ڕووکار و کۆدی QR.',
      en: 'Jump effortlessly between categories, dishes, live orders, theme studio, multi-branch settings, QR codes, analytics, and Telegram automation.',
    },
    highlights: {
      ar: [
        'تنبيه فوري بعدد الطلبات الجديدة قيد المتابعة',
        'دعم إدارة عدة أفرع وتخصيص كل فرع بسهولة',
        'وصول سريع لكود QR والإحصائيات والدعم الفني',
      ],
      ku: [
        'ئاگادارکردنەوەی خێرای ژمارەی داواکارییە نوێیەکان',
        'پشتگیری بەڕێوەبردنی چەند لقێکی جیاواز',
        'دەستگەیشتنی خێرا بە کۆدی QR و ئامارە وردەکان',
      ],
      en: [
        'Live unread badge for incoming customer orders',
        'Dedicated workspace for multi-branch operations',
        'One-tap access to printable QR codes and analytics',
      ],
    },
  },
  {
    id: 'categories',
    image: '/assets/aistudio/Screenshot_2026-11-19-12-31-12-701_com.android.chrome_c6865f5c.jpg',
    tabLabel: { ar: 'الأقسام', ku: 'بەشەکان', en: 'Categories' },
    kicker: { ar: 'هيكلة مرنة للقائمة', ku: 'ڕێکخستنی بەشەکان', en: 'Menu Architecture' },
    title: {
      ar: 'رتّب أقسام المنيو بالسحب والإفلات وجدولها حسب الوقت',
      ku: 'ڕێکخستنی بەشەکان و کاتی دەرکەوتنیان',
      en: 'Drag-and-Drop Categories & Smart Scheduling',
    },
    description: {
      ar: 'تحكم الكامل بترتيب الأقسام وصورها دون أي تعقيد، مع زر إخفاء وإظهار فوري وجدولة زمنية تتيح ظهور أقسام الفطور أو العروض في ساعات محددة تلقائياً.',
      ku: 'دەستکاری و ڕێکخستنی بەشەکان بە ڕاکێشان و دانان لەگەڵ دیاریکردنی کاتی کارکردن.',
      en: 'Reorder menu sections by dragging, toggle visibility instantly without deleting data, and schedule time windows for breakfast or special menus.',
    },
    highlights: {
      ar: [
        'إعادة ترتيب الأقسام بلمسة واحدة وبالسحب والإفلات',
        'تشغيل أو إخفاء أي قسم فوراً حسب التوفر',
        'جدولة أوقات ظهور كل قسم تلقائياً خلال اليوم',
      ],
      ku: [
        'ڕێکخستنەوەی بەشەکان بە ڕاکێشان لەسەر مۆبایل و کۆمپیوتەر',
        'شاردنەوە و نیشاندانی هەر بەشێک بە یەک کرتە',
        'دیاریکردنی کاتی دەرکەوتنی خۆکاری بەشەکان',
      ],
      en: [
        'Instant drag-to-reorder across mobile and desktop',
        'Non-destructive show/hide switch per category',
        'Automated time-of-day visibility scheduling',
      ],
    },
  },
  {
    id: 'items',
    image: '/assets/aistudio/Screenshot_2026-11-19-12-31-23-072_com.android.chrome_f8f07cdf.jpg',
    tabLabel: { ar: 'الأصناف والأطباق', ku: 'خواردن و کاڵاکان', en: 'Items & Pricing' },
    kicker: { ar: 'تحكم كامل بكل طبق', ku: 'کۆنترۆڵی تەواوی کاڵاکان', en: 'Catalog Management' },
    title: {
      ar: 'أضف أطباقك وحدّث الأسعار والأحجام خلال ثوانٍ',
      ku: 'زیادکردن و نوێکردنەوەی نرخ و وێنەی خواردنەکان',
      en: 'Manage Dishes, Variants, Photos & Quick Pricing',
    },
    description: {
      ar: 'تصفح جميع منتجاتك مع شريط تصفية ذكي حسب القسم، وعدّل السعر مباشرة أو أضف الأحجام والإضافات الاختيارية واختر صورك من مكتبتك الخاصة بضغطة زر.',
      ku: 'بە خێرایی بگەڕێ بەناو خواردنەکاندا، نرخەکان دەستکاری بکە و قەبارە و زیادکراوەکان دابنێ.',
      en: 'Filter dishes by category, edit prices inline, configure sizes and optional add-ons, and toggle out-of-stock items immediately.',
    },
    highlights: {
      ar: [
        'تعديل مباشر للسعر وإدارة الأحجام والإضافات الاختيارية',
        'شريط تصفية سريع يعرض عدد العناصر في كل قسم',
        'إيقاف أو تفعيل توفر أي صنف فور نفاده',
      ],
      ku: [
        'دەستکاریکردنی خێرای نرخ و قەبارە و زیادکراوەکان',
        'فلتەری خێرا بۆ بینینی بەشەکان و ژمارەی کاڵاکان',
        'شاردنەوەی خێرای هەر خواردنێک کاتێک تەواو دەبێت',
      ],
      en: [
        'Inline quick price updates with size & extras support',
        'Category filter chips with live item counts',
        'One-tap availability toggle when items sell out',
      ],
    },
  },
  {
    id: 'appearance',
    image: '/assets/aistudio/Screenshot_2026-11-19-12-31-29-890_com.android.chrome_90f2edee.jpg',
    tabLabel: { ar: 'المظهر والألوان', ku: 'ڕووکار و ڕەنگەکان', en: 'Appearance' },
    kicker: { ar: 'هوية بصرية متكاملة', ku: 'ناسنامەی بینراوی تایبەت', en: 'Theme & Layout Studio' },
    title: {
      ar: 'تحكم بمظهر المنيو، شبكة العرض، ولوحة الألوان الفورية',
      ku: 'هەڵبژاردنی شێوازی پیشاندان و ڕەنگەکانی مینیۆ',
      en: 'Light/Dark Mode, Grid Layouts & Curated Palettes',
    },
    description: {
      ar: 'اختر كيف يرى زبائنك القائمة: بالوضع الفاتح أو الغامق أو التلقائي حسب جهازهم، مع 4 طرق احترافية لعرض المنتجات وثيمات ألوان متوافقة تلقائياً.',
      ku: 'دیاری بکە کڕیارانت مینیۆکە چۆن ببینن: ڕووناک، تاریک یان خۆکار، لەگەڵ ٤ شێوازی تۆڕی پیشاندان.',
      en: 'Switch between Light, Dark, or Device-auto themes, pick from 4 product grid densities, and apply harmonious color palettes in real time.',
    },
    highlights: {
      ar: [
        'دعم الوضع الفاتح والغامق والتبديل التلقائي حسب الجهاز',
        '4 خيارات لعرض المنتجات (قائمة أفقية، شبكتين، 3 أو 4 أعمدة)',
        'ثيمات ألوان متناسقة مع إمكانية التخصيص الكامل لهويتك',
      ],
      ku: [
        'پشتگیری دۆخی ڕووناک و تاریک و خۆکار بەپێی مۆبایل',
        '٤ شێوازی پیشاندانی بەرهەمەکان بە تۆڕی جیاواز',
        'تیمی ڕەنگی ئامادە و گونجاو لەگەڵ هەموو شاشەیەک',
      ],
      en: [
        'Light, dark, and automatic device appearance modes',
        '4 structured product layouts (horizontal list, 2x2, 3-col, 4-col)',
        'Curated color themes tailored for high legibility',
      ],
    },
  },
  {
    id: 'shapes',
    image: '/assets/aistudio/Screenshot_2026-11-19-12-31-39-751_com.android.chrome_ae28333a.jpg',
    tabLabel: { ar: 'الأشكال والبطاقات', ku: 'شێوەی کارتەکان', en: 'Card Styles' },
    kicker: { ar: 'تفاصيل تصميم مبتكرة', ku: 'وردەکاری دیزاینی مۆدێرن', en: 'Visual Presets' },
    title: {
      ar: 'أكثر من 10 أنماط للبطاقات والأشكال الموسمية بلمسة واحدة',
      ku: 'زیاتر لە ١٠ شێوازی کارت و دیزاینی وەرزی',
      en: '10+ Card Shapes & Seasonal Visual Themes',
    },
    description: {
      ar: 'بدّل شكل متجرك بالكامل بين الزجاجي الشفاف، العصري الناعم، الأحلام، الرسوم الكرتونية، الهندسي الحاد والدائري المرن مع معاينة واضحة وتطبيق فوري.',
      ku: 'شێوازی هەموو پەڕەکە و کارتەکان بگۆڕە لە نێوان شووشەیی، مۆدێرن، خەیاڵی و چەندانی تر.',
      en: 'Transform the entire storefront silhouette—frosted glass, soft modern, dream glow, comic, sharp architectural, or pill curves—with one click.',
    },
    highlights: {
      ar: [
        'تصاميم متنوعة تنطبق تلقائياً على البنر والصور والبطاقات',
        'معاينة مصغرة توضح شكل الحواف والأزرار قبل الاختيار',
        'أشكال موسمية مميزة تناسب الأعياد والمناسبات',
      ],
      ku: [
        'گۆڕینی خۆکاری شێوەی بەنەر و وێنە و کارتەکان',
        'پێشبینینی شێوەی گۆشە و دوگمەکان پێش هەڵبژاردن',
        'شێوازی تایبەت و گونجاو بۆ بۆنە و وەرزەکان',
      ],
      en: [
        'Coordinated styling applied to banners, photos, and cards',
        'Clear visual thumbnails showing corner & button geometry',
        'Seasonal presets tailored for holidays and special campaigns',
      ],
    },
  },
  {
    id: 'addons',
    image: '/assets/aistudio/Screenshot_2026-11-19-12-31-47-755_com.android.chrome_58d41830.jpg',
    tabLabel: { ar: 'متجر الإضافات', ku: 'زیادکراوە زیرەکەکان', en: 'Smart Add-ons' },
    kicker: { ar: 'أدوات تسويق وزيادة المبيعات', ku: 'ئامرازەکانی زیادکردنی فرۆش', en: 'Growth & Marketing' },
    title: {
      ar: 'مكتبة تضم 50 إضافة ذكية لتحفيز الطلب ورفع قيمة السلة',
      ku: '٥٠ زیادکراوی زیرەک بۆ بەرزکردنەوەی فرۆش و سەبەتە',
      en: '50+ Marketing & Conversion Tools Ready to Toggle',
    },
    description: {
      ar: 'فعّل البوب اب الترحيبي للعروض، أكواد وكوبونات الخصم، شريط التوصيل المجاني، شريط الإعلانات، المؤقت التنازلي، ساعة السعادة وبطاقة طبق اليوم بدون أي برمجة.',
      ku: 'پۆپئەپی پێشوازی، کۆدی داشکاندن، شریتی گەیاندنی بێبەرامبەر و کاتژمێری داشکاندن چالاک بکە.',
      en: 'Activate welcome offer popups, promo coupons, free-delivery progress bars, announcement strips, countdown timers, and Happy Hour deals instantly.',
    },
    highlights: {
      ar: [
        'تشغيل وإيقاف فوري مع إعدادات مخصصة لكل إضافة',
        'بوب اب لعروض الأطباق أو الإعلانات يظهر بأناقة للزبائن',
        'كوبونات خصم ومؤقت عروض لزيادة التحويل والمبيعات',
      ],
      ku: [
        'چالاککردن و ڕاگرتنی خێرا بۆ هەموو زیادکراوەکان',
        'پۆپئەپی جوان بۆ نیشاندانی خواردن و ئۆفەرە تایبەتەکان',
        'کۆپۆنی داشکاندن و کاتی دیاریکراو بۆ هاندانی کڕین',
      ],
      en: [
        'Instant enable/disable toggles with tailored configuration',
        'Offer popups supporting both announcements and featured dishes',
        'Coupons, free delivery goals, and countdown urgency tools',
      ],
    },
  },
];

interface ExploreShowcaseProps {
  lang: SupportedLanguage;
  homeTheme: 'light' | 'dark';
}

export const ExploreShowcase: React.FC<ExploreShowcaseProps> = ({ lang, homeTheme }) => {
  const isRtl = lang === 'ar' || lang === 'ku';
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [zoomedSlide, setZoomedSlide] = useState<ExploreSlide | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const tr = useCallback(
    (ar: string, ku: string, en: string) => trByLang(lang, ar, ku, en),
    [lang]
  );

  const total = EXPLORE_SLIDES.length;
  const activeSlide = EXPLORE_SLIDES[activeIndex];
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  const goTo = useCallback(
    (targetIdx: number) => {
      const normalized = ((targetIdx % total) + total) % total;
      if (normalized === activeIndex) return;
      const forwardDist = (normalized - activeIndex + total) % total;
      const backwardDist = (activeIndex - normalized + total) % total;
      setDirection(forwardDist <= backwardDist ? 1 : -1);
      setActiveIndex(normalized);
    },
    [activeIndex, total]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((cur) => (cur + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((cur) => (cur - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!zoomedSlide) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedSlide(null);
      } else if (e.key === 'ArrowRight') {
        if (isRtl) goPrev();
        else goNext();
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) goNext();
        else goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomedSlide, isRtl, goNext, goPrev]);

  useEffect(() => {
    if (zoomedSlide) {
      setZoomedSlide(EXPLORE_SLIDES[activeIndex]);
    }
  }, [activeIndex, zoomedSlide]);

  const renderSeamlessScreen = (slide: ExploreSlide, isZoomed = false) => {
    const failed = Boolean(failedImages[slide.id]);
    if (failed) {
      return (
        <div
          style={{
            width: '100%',
            aspectRatio: '1240 / 2480',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '24px',
            textAlign: 'center',
            color: '#94A3B8',
            background: 'radial-gradient(circle at 50% 40%, #16222c, #0f1419)',
          }}
        >
          <Compass size={28} style={{ color: '#34D399' }} />
          <strong style={{ color: '#F8FAFC', fontSize: '15px' }}>{slide.title[lang]}</strong>
          <span style={{ fontSize: '12.5px', lineHeight: 1.5 }}>{slide.kicker[lang]}</span>
        </div>
      );
    }

    return (
      <div className={`mp-explore-crop${isZoomed ? ' is-zoomed' : ''}`}>
        <img
          src={slide.image}
          alt={slide.title[lang]}
          referrerPolicy="no-referrer"
          loading={slide.id === activeSlide.id ? 'eager' : 'lazy'}
          draggable={false}
          onError={() => setFailedImages((prev) => ({ ...prev, [slide.id]: true }))}
          className="mp-explore-crop-img"
        />
      </div>
    );
  };

  return (
    <section
      className="s mp-explore-section"
      id="explore"
      aria-labelledby="explore-section-heading"
      style={{
        paddingTop: 'clamp(64px, 7.5vw, 104px)',
        paddingBottom: 'clamp(72px, 8vw, 112px)',
      }}
    >
      <div className="w">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 30px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '13px',
              fontWeight: 800,
              color: 'var(--brand-ink)',
              marginBottom: '8px',
            }}
          >
            <Compass size={15} />
            <span>{tr('استكشف', 'گەڕان و پشکنین', 'Explore')}</span>
          </div>

          <h2
            id="explore-section-heading"
            style={{
              fontFamily: 'var(--font-heading, var(--font))',
              fontSize: 'calc(clamp(22px, 3.8vw, 34px) * var(--font-scale, 1))',
              fontWeight: 'var(--font-heading-weight, 800)' as any,
              lineHeight: 'var(--font-heading-lh, 1.3)',
              marginBottom: '10px',
              color: 'var(--ink)',
              textWrap: 'balance',
            }}
          >
            <Ml7Text
              text={tr(
                'استكشف لوحة التحكم ومزايا المنيو من الداخل',
                'ناوەوەی پەڕەی کۆنترۆڵ و تایبەتمەندییەکان ببینە',
                'Explore the Dashboard & Features from the Inside'
              )}
              mode="inView"
              delay={0.08}
              stagger={0.1}
              isRtl={isRtl}
            />
          </h2>

          <p
            className="muted"
            style={{
              fontFamily: 'var(--font-body, var(--font))',
              fontSize: 'var(--font-desc-size, 14px)',
              lineHeight: 'var(--font-body-lh, 1.65)',
              margin: '0 auto',
              maxWidth: '520px',
              color: 'var(--muted)',
            }}
          >
            {tr(
              'تجوّل بسلاسة بين الشاشات الحقيقية وتعرّف على كل أداة تمنحك تحكماً كاملاً في متجرك.',
              'بە نەرمی هاتوچۆ بکە لە نێوان شاشە ڕاستەقینەکان و تایبەتمەندییەکانی هەر بەشێک بناسە.',
              'Glide smoothly across real screens and discover every tool built to manage your digital storefront.'
            )}
          </p>
        </div>

        {/* Interactive Feature Navigator Tabs */}
        <div
          role="tablist"
          aria-label={tr('شاشات استكشاف المميزات', 'شاشەکانی گەڕان', 'Feature exploration screens')}
          className="mp-explore-tabs"
        >
          {EXPLORE_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => goTo(idx)}
                className={`mp-explore-tab${isActive ? ' is-active' : ''}`}
              >
                <span className="tabular-nums mp-explore-tab-num">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span>{slide.tabLabel[lang]}</span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Interactive Showcase */}
        <div className="mp-explore-grid">
          {/* Interactive Smooth Carousel Stage */}
          <div
            className={`mp-explore-stage ${homeTheme === 'light' ? 'is-light-page' : 'is-dark-page'}`}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (isRtl) goPrev();
                else goNext();
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (isRtl) goNext();
                else goPrev();
              }
            }}
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label={tr('عرض شاشات المنصة', 'پیشاندانی شاشەکانی پلاتفۆرم', 'Platform screenshots carousel')}
          >
            <div className="mp-explore-ambient-glow" aria-hidden="true" />

            {/* Side Peek: Previous Slide */}
            <button
              type="button"
              onClick={goPrev}
              aria-label={tr(`الشاشة السابقة: ${EXPLORE_SLIDES[prevIndex].tabLabel.ar}`, `پێشوو: ${EXPLORE_SLIDES[prevIndex].tabLabel.ku}`, `Previous: ${EXPLORE_SLIDES[prevIndex].tabLabel.en}`)}
              className="mp-explore-peek mp-explore-peek-prev"
            >
              {renderSeamlessScreen(EXPLORE_SLIDES[prevIndex])}
            </button>

            {/* Side Peek: Next Slide */}
            <button
              type="button"
              onClick={goNext}
              aria-label={tr(`الشاشة التالية: ${EXPLORE_SLIDES[nextIndex].tabLabel.ar}`, `دواتر: ${EXPLORE_SLIDES[nextIndex].tabLabel.ku}`, `Next: ${EXPLORE_SLIDES[nextIndex].tabLabel.en}`)}
              className="mp-explore-peek mp-explore-peek-next"
            >
              {renderSeamlessScreen(EXPLORE_SLIDES[nextIndex])}
            </button>

            {/* Active Draggable Slide */}
            <div className="mp-explore-active-slot">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={activeSlide.id}
                  custom={direction}
                  drag={prefersReducedMotion ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.22}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 48) {
                      if (isRtl) goNext();
                      else goPrev();
                    } else if (info.offset.x < -48) {
                      if (isRtl) goPrev();
                      else goNext();
                    }
                  }}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: (isRtl ? -1 : 1) * direction * 46,
                          scale: 0.94,
                        }
                  }
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: (isRtl ? 1 : -1) * direction * 46,
                          scale: 0.94,
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mp-explore-card-motion"
                  onClick={() => setZoomedSlide(activeSlide)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setZoomedSlide(activeSlide);
                    }
                  }}
                  aria-label={tr(
                    `تكبير شاشة ${activeSlide.tabLabel.ar}`,
                    `گەورەکردنی شاشەی ${activeSlide.tabLabel.ku}`,
                    `Expand ${activeSlide.tabLabel.en}`
                  )}
                >
                  {renderSeamlessScreen(activeSlide)}
                  <span className="mp-explore-zoom-hint" aria-hidden="true">
                    <Maximize2 size={14} />
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Arrow Navigation */}
            <button
              type="button"
              onClick={goPrev}
              className="mp-explore-arrow mp-explore-arrow-prev"
              aria-label={tr('السابق', 'پێشوو', 'Previous')}
            >
              {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <button
              type="button"
              onClick={goNext}
              className="mp-explore-arrow mp-explore-arrow-next"
              aria-label={tr('التالي', 'دواتر', 'Next')}
            >
              {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Slide Feature Description & Step Controls */}
          <div className="mp-explore-details">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: prefersReducedMotion ? 0.12 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Unboxed Editorial Metadata */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--brand-ink)',
                    marginBottom: '10px',
                  }}
                >
                  <span className="tabular-nums">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" style={{ opacity: 0.45 }}>
                    ·
                  </span>
                  <span>{activeSlide.kicker[lang]}</span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading, var(--font))',
                    fontSize: 'clamp(20px, 2.8vw, 27px)',
                    fontWeight: 900,
                    lineHeight: 1.38,
                    color: 'var(--ink)',
                    margin: '0 0 12px',
                    textWrap: 'balance',
                  }}
                >
                  {activeSlide.title[lang]}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body, var(--font))',
                    fontSize: '15px',
                    lineHeight: 1.75,
                    color: homeTheme === 'light' ? '#334155' : '#CBD5E1',
                    margin: '0 0 20px',
                  }}
                >
                  {activeSlide.description[lang]}
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '11px',
                  }}
                >
                  {activeSlide.highlights[lang].map((point, pIdx) => (
                    <li
                      key={pIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 1.55,
                        color: 'var(--ink)',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: 'var(--soft)',
                          color: 'var(--brand-ink)',
                          display: 'inline-grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          marginTop: '1px',
                        }}
                      >
                        <Check size={13} strokeWidth={2.75} />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Step Navigation & Dots */}
            <div className="mp-explore-footer-nav">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={goPrev}
                  className="btn s mp-explore-step-btn"
                  aria-label={tr('الشاشة السابقة', 'شاشەی پێشوو', 'Previous screen')}
                >
                  {isRtl ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                  <span>{tr('السابق', 'پێشوو', 'Prev')}</span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="btn p s mp-explore-step-btn"
                  aria-label={tr('الشاشة التالية', 'شاشەی دواتر', 'Next screen')}
                >
                  <span>{tr('التالي', 'دواتر', 'Next')}</span>
                  {isRtl ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
                </button>
              </div>

              <div className="mp-explore-dots" role="tablist" aria-label={tr('مؤشر الصور', 'ئاماژەدەری وێنەکان', 'Slide indicators')}>
                {EXPLORE_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`${idx + 1} - ${slide.tabLabel[lang]}`}
                    aria-selected={idx === activeIndex}
                    onClick={() => goTo(idx)}
                    className={`mp-explore-dot${idx === activeIndex ? ' is-active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seamless Expanded Lightbox Modal */}
      {zoomedSlide && (
        <div
          className="ajax-backdrop"
          style={{ zIndex: 10020, padding: '16px', background: 'rgba(6, 10, 14, 0.86)' }}
          onClick={() => setZoomedSlide(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              type="button"
              onClick={() => setZoomedSlide(null)}
              aria-label={tr('إغلاق المعاينة', 'داخستن', 'Close preview')}
              style={{
                position: 'absolute',
                top: '6px',
                insetInlineEnd: '6px',
                zIndex: 5,
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(15, 20, 25, 0.85)',
                color: '#F8FAFC',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            <div
              style={{
                width: '100%',
                maxWidth: '330px',
                background: '#0F1419',
                borderRadius: '28px',
                padding: '6px',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.65)',
              }}
            >
              {renderSeamlessScreen(zoomedSlide, true)}
            </div>

            <div style={{ textAlign: 'center', color: '#F8FAFC', maxWidth: '360px' }}>
              <div style={{ fontSize: '14.5px', fontWeight: 800, marginBottom: '4px' }}>
                {zoomedSlide.title[lang]}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={goPrev}
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255,255,255,0.18)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#F8FAFC',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                  <span>{tr('السابق', 'پێشوو', 'Prev')}</span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  style={{
                    height: '36px',
                    padding: '0 16px',
                    borderRadius: '999px',
                    border: 'none',
                    background: 'var(--brand)',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{tr('التالي', 'دواتر', 'Next')}</span>
                  {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
