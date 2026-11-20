/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  GitBranch,
  Home,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Sparkles,
  Star,
  Store,
  Tag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import type {
  Category,
  MenuItem,
  OrderType,
  Restaurant,
  RestaurantAddons,
  RestaurantReview,
} from '../../types';
import type { ActiveMenuDiscount } from '../../data/addonsCatalog';
import type { CategoryAvailabilityResult, ItemAvailabilityResult } from '../../utils/availability';
import { formatNumber, waLink } from '../../utils/storage';
import { AppLogo } from '../AppLogo';

export interface EstorePriceInfo {
  main: string;
  min: number;
  rawBefore: number;
  savings: number;
}

export interface EstoreStorefrontProps {
  rest: Restaurant;
  currency: string;
  allCategories: Category[];
  allItems: MenuItem[];
  categoryEvalMap: Map<string, CategoryAvailabilityResult>;
  itemEvalMap: Map<string, ItemAvailabilityResult>;
  getPriceInfo: (it: MenuItem) => EstorePriceInfo;
  formatMoney: (amount: number) => string;
  activeMenuDiscount: ActiveMenuDiscount;
  addons: RestaurantAddons;
  countdownDisplay: string | null;
  coverImages: string[];
  bannerIdx: number;
  setBannerIdx: React.Dispatch<React.SetStateAction<number>>;
  openNow: boolean;
  orderType: OrderType;
  enabledTypes: OrderType[];
  orderTypeMeta: Record<OrderType, { label: string; icon: React.ReactNode }>;
  hasMultipleBranches: boolean;
  branchShortLabel: string;
  onOpenBranchPicker: () => void;
  totalCount: number;
  subtotal: number;
  freeDeliveryEnabled: boolean;
  freeDeliveryMin: number;
  freeDeliveryRemaining: number;
  freeDeliveryPct: number;
  qualifiesFreeDelivery: boolean;
  getItemCartQty: (itemId: string) => number;
  openProductModal: (it: MenuItem) => void;
  quickAddOrOpenModal: (it: MenuItem, e?: React.MouseEvent) => void;
  decrementItemFromCart: (itemId: string, e?: React.MouseEvent) => void;
  openCart: () => void;
  openMenuDrawer: () => void;
  openCatsModal: () => void;
  openOrderTypeModal: () => void;
  openWorkModal: () => void;
  openAboutModal: () => void;
  openRateModal: () => void;
  openShareModal: () => void;
  openMoodModal: () => void;
  openSpinModal: () => void;
  spinWonLabel?: string | null;
  reviewsShowOnMenu: boolean;
  reviewsAllowSubmit: boolean;
  restaurantReviews: RestaurantReview[];
  onNavigate: (hash: string) => void;
  selectedCatId?: string;
  onSelectCatId?: (catId: string) => void;
}

export const EstoreStorefront: React.FC<EstoreStorefrontProps> = ({
  rest,
  currency,
  allCategories,
  allItems,
  categoryEvalMap,
  itemEvalMap,
  getPriceInfo,
  formatMoney,
  activeMenuDiscount,
  addons,
  countdownDisplay,
  coverImages,
  bannerIdx,
  setBannerIdx,
  openNow,
  orderType,
  enabledTypes,
  orderTypeMeta,
  hasMultipleBranches,
  branchShortLabel,
  onOpenBranchPicker,
  totalCount,
  subtotal,
  freeDeliveryEnabled,
  freeDeliveryMin,
  freeDeliveryRemaining,
  freeDeliveryPct,
  qualifiesFreeDelivery,
  getItemCartQty,
  openProductModal,
  quickAddOrOpenModal,
  decrementItemFromCart,
  openCart,
  openMenuDrawer,
  openCatsModal,
  openOrderTypeModal,
  openWorkModal,
  openAboutModal,
  openRateModal,
  openShareModal,
  openMoodModal,
  openSpinModal,
  spinWonLabel,
  reviewsShowOnMenu,
  reviewsAllowSubmit,
  restaurantReviews,
  onNavigate,
  selectedCatId: controlledCatId,
  onSelectCatId,
}) => {
  const [internalCatId, setInternalCatId] = useState<string>('all');
  const selectedCatId = controlledCatId !== undefined ? controlledCatId : internalCatId;
  const setSelectedCatId = (nextId: string) => {
    setInternalCatId(nextId);
    onSelectCatId?.(nextId);
  };
  const [inlineQuery, setInlineQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement | null>(null);
  const desktopSearchRef = useRef<HTMLInputElement | null>(null);
  const productsTopRef = useRef<HTMLDivElement | null>(null);

  const catMap = useMemo(() => new Map(allCategories.map((c) => [c.id, c])), [allCategories]);

  const trimmedQuery = inlineQuery.trim().toLowerCase();
  const inlineMatches = useMemo(() => {
    if (!trimmedQuery) return [];
    return allItems.filter(
      (it) =>
        it.n.toLowerCase().includes(trimmedQuery) ||
        (it.d || '').toLowerCase().includes(trimmedQuery) ||
        (catMap.get(it.cat)?.n || '').toLowerCase().includes(trimmedQuery)
    );
  }, [allItems, trimmedQuery, catMap]);

  const discountedItems = useMemo(() => {
    return allItems.filter((it) => {
      const p = getPriceInfo(it);
      return p.rawBefore > p.min && p.rawBefore > 0;
    });
  }, [allItems, getPriceInfo]);

  const visibleCategories = useMemo(() => {
    if (selectedCatId === 'all' || selectedCatId === 'discounts') return allCategories;
    return allCategories.filter((c) => c.id === selectedCatId);
  }, [allCategories, selectedCatId]);

  const handleSelectCategory = (catId: string, scrollToProducts = true) => {
    setSelectedCatId(catId);
    if (scrollToProducts && productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFocusSearch = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 991) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => {
        mobileSearchRef.current?.focus();
      }, 220);
    } else {
      desktopSearchRef.current?.focus();
    }
  };

  const renderProductCard = (it: MenuItem, catName?: string, keyPrefix = 'cat') => {
    const qty = getItemCartQty(it.id);
    const priceInfo = getPriceInfo(it);
    const itemEval = itemEvalMap.get(it.id);
    const unavailable = itemEval ? !itemEval.available : false;
    const discountPct =
      priceInfo.rawBefore > priceInfo.min && priceInfo.rawBefore > 0
        ? Math.max(1, Math.round(((priceInfo.rawBefore - priceInfo.min) / priceInfo.rawBefore) * 100))
        : 0;
    const hasRequiredChoices = Boolean(
      (it.sizes && it.sizes.length > 0) ||
        (it.choices && it.choices.length > 0) ||
        (it.extras && it.extras.length > 0)
    );

    return (
      <article
        key={`${keyPrefix}_${it.id}`}
        className={`mp-estore-product-card ${unavailable ? 'is-unavailable' : ''}`}
        onClick={() => openProductModal(it)}
      >
        <div className="mp-estore-card-media">
          {it.img ? (
            <img
              src={it.img}
              alt={it.n}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="mp-estore-media-placeholder">
              <Package size={32} strokeWidth={1.5} />
            </div>
          )}

          {qty > 0 && (
            <span className="mp-estore-cart-qty-pill tabular-nums">{qty} في السلة</span>
          )}

          {unavailable && (
            <span className="mp-estore-unavail-pill">
              {itemEval?.outOfSchedule ? 'خارج وقت التوفر' : 'غير متوفر'}
            </span>
          )}
        </div>

        <div className="mp-estore-card-body">
          {catName && <span className="mp-estore-card-cat">{catName}</span>}
          <h3 className="mp-estore-card-title">{it.n}</h3>
          {it.d && <p className="mp-estore-card-desc">{it.d}</p>}

          <div className="mp-estore-card-footer">
            <div className="mp-estore-price-block">
              {discountPct > 0 && priceInfo.rawBefore > 0 && (
                <div className="mp-estore-old-price-row">
                  <s className="mp-estore-old-price tabular-nums">
                    {formatMoney(priceInfo.rawBefore)}
                  </s>
                  <span className="mp-estore-disc-badge tabular-nums">-{discountPct}%</span>
                </div>
              )}
              <div className="mp-estore-current-price tabular-nums">{priceInfo.main}</div>
            </div>

            <div className="mp-estore-cta-group" onClick={(e) => e.stopPropagation()}>
              {!unavailable && qty > 0 && !hasRequiredChoices && (
                <button
                  type="button"
                  className="mp-estore-minus-btn"
                  aria-label={qty === 1 ? `حذف ${it.n} من السلة` : `إنقاص كمية ${it.n}`}
                  onClick={(e) => decrementItemFromCart(it.id, e)}
                >
                  {qty === 1 ? <Trash2 size={14} /> : <Minus size={14} strokeWidth={2.5} />}
                </button>
              )}
              <button
                type="button"
                className="mp-estore-add-btn"
                disabled={unavailable}
                aria-label={`أضف للسلة: ${it.n}`}
                onClick={(e) => quickAddOrOpenModal(it, e)}
              >
                {unavailable ? (
                  <Clock size={16} />
                ) : qty > 0 && !hasRequiredChoices ? (
                  <Plus size={18} strokeWidth={2.6} />
                ) : (
                  <ShoppingCart size={18} strokeWidth={2.2} />
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  const renderSearchDropdown = () => {
    if (!searchFocused || !trimmedQuery) return null;
    return (
      <div className="mp-estore-search-dropdown" role="listbox">
        {inlineMatches.length === 0 ? (
          <div className="mp-estore-search-empty">
            لا توجد منتجات مطابقة لـ "{inlineQuery}"
          </div>
        ) : (
          <>
            {inlineMatches.slice(0, 7).map((it) => {
              const p = getPriceInfo(it);
              return (
                <button
                  key={it.id}
                  type="button"
                  className="mp-estore-search-row"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchFocused(false);
                    openProductModal(it);
                  }}
                >
                  <div className="mp-estore-search-thumb">
                    {it.img ? (
                      <img src={it.img} alt={it.n} referrerPolicy="no-referrer" />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>
                  <div className="mp-estore-search-info">
                    <b>{it.n}</b>
                    <span>{catMap.get(it.cat)?.n || rest.n}</span>
                  </div>
                  <div className="mp-estore-search-price tabular-nums">{p.main}</div>
                </button>
              );
            })}
            {inlineMatches.length > 7 && (
              <div className="mp-estore-search-more">
                عرض كل النتائج ({inlineMatches.length})
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const waTarget = rest.social?.whatsapp || rest.ph || '';

  return (
    <div className="mp-estore-root" dir="rtl">
      {/* 1. Top Utility Strip */}
      <div className="mp-estore-utilbar">
        <div className="mp-estore-container mp-estore-utilbar-inner">
          <div className="mp-estore-util-group">
            <button
              type="button"
              className={`mp-estore-status-btn ${openNow ? 'is-open' : 'is-closed'}`}
              onClick={openWorkModal}
            >
              <span className="mp-estore-status-dot" />
              <span>{openNow ? 'المتجر مفتوح الآن' : 'مغلق حالياً'}</span>
              <Clock size={12} />
            </button>

            {rest.address && (
              <span className="mp-estore-util-meta mp-estore-hide-sm">
                <MapPin size={13} />
                <span>{rest.address}</span>
              </span>
            )}

            <button
              type="button"
              className="mp-estore-util-btn"
              onClick={openOrderTypeModal}
            >
              {orderTypeMeta[orderType].icon}
              <span>{orderTypeMeta[orderType].label}</span>
              <ChevronDown size={12} />
            </button>

            {hasMultipleBranches && (
              <button
                type="button"
                className="mp-estore-util-btn"
                onClick={onOpenBranchPicker}
              >
                <GitBranch size={12} />
                <span>{branchShortLabel}</span>
                <ChevronDown size={12} />
              </button>
            )}
          </div>

          <div className="mp-estore-util-group mp-estore-hide-sm">
            {waTarget && (
              <a
                href={waLink(waTarget, `مرحباً ${rest.n}، لدي استفسار عن المنتجات`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mp-estore-util-link"
              >
                <MessageCircle size={13} />
                <span>تواصل واتساب</span>
              </a>
            )}
            {rest.ph && (
              <a href={`tel:${rest.ph}`} className="mp-estore-util-link tabular-nums" dir="ltr">
                <Phone size={12} />
                <span>{rest.ph}</span>
              </a>
            )}
            <button type="button" className="mp-estore-util-link" onClick={openShareModal}>
              <Share2 size={13} />
              <span>مشاركة المتجر</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sticky Main Navbar + Horizontal Category Bar */}
      <header className="mp-estore-navbar">
        <div className="mp-estore-container mp-estore-nav-desktop">
          {/* Brand Logo + Store Name */}
          <button
            type="button"
            className="mp-estore-brand"
            onClick={() => {
              setSelectedCatId('all');
              setInlineQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="mp-estore-logo-box">
              {rest.logo ? (
                <img src={rest.logo} alt={rest.n} referrerPolicy="no-referrer" />
              ) : (
                <span>{(rest.n || 'S').slice(0, 2)}</span>
              )}
            </div>
            <div className="mp-estore-brand-text">
              <strong>{rest.n}</strong>
              {rest.tagline && <span>{rest.tagline}</span>}
            </div>
          </button>

          {/* Center Live Search Box */}
          <div className="mp-estore-search-wrap">
            <div className="mp-estore-search-box">
              <Search size={17} className="mp-estore-search-ico" />
              <input
                ref={desktopSearchRef}
                type="search"
                value={inlineQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => {
                  setInlineQuery(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder={`ابحث في منتجات ${rest.n}...`}
              />
              {inlineQuery && (
                <button
                  type="button"
                  className="mp-estore-search-clear"
                  onClick={() => setInlineQuery('')}
                  aria-label="مسح البحث"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {renderSearchDropdown()}
          </div>

          {/* End Actions: Categories, Menu, Cart */}
          <div className="mp-estore-nav-actions">
            <button
              type="button"
              className="mp-estore-nav-icon-btn"
              onClick={openCatsModal}
              title="تصفح الأقسام"
              aria-label="تصفح الأقسام"
            >
              <LayoutGrid size={19} />
            </button>
            <button
              type="button"
              className="mp-estore-nav-icon-btn"
              onClick={openMenuDrawer}
              title="معلومات المتجر"
              aria-label="معلومات المتجر"
            >
              <Menu size={20} />
            </button>
            <button
              type="button"
              className="mp-estore-nav-cart-btn"
              onClick={openCart}
            >
              <div className="mp-estore-nav-cart-ico">
                <ShoppingCart size={18} />
                <span className="mp-estore-cart-badge tabular-nums">{totalCount}</span>
              </div>
              <div className="mp-estore-nav-cart-meta">
                <small>سلة التسوق</small>
                <b className="tabular-nums">
                  {totalCount > 0 ? formatMoney(subtotal) : 'فارغة'}
                </b>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sticky Header Row */}
        <div className="mp-estore-container mp-estore-nav-mobile">
          <div className="mp-estore-nav-mobile-top">
            <button
              type="button"
              className="mp-estore-nav-icon-btn"
              onClick={openMenuDrawer}
              aria-label="قائمة المتجر"
            >
              <Menu size={20} />
            </button>

            <button
              type="button"
              className="mp-estore-brand-mobile"
              onClick={() => {
                setSelectedCatId('all');
                setInlineQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="mp-estore-logo-box is-sm">
                {rest.logo ? (
                  <img src={rest.logo} alt={rest.n} referrerPolicy="no-referrer" />
                ) : (
                  <span>{(rest.n || 'S').slice(0, 2)}</span>
                )}
              </div>
              <strong>{rest.n}</strong>
            </button>

            <div className="mp-estore-nav-mobile-right">
              <button
                type="button"
                className="mp-estore-nav-icon-btn"
                onClick={openShareModal}
                aria-label="مشاركة المتجر"
              >
                <Share2 size={17} />
              </button>
              <button
                type="button"
                className="mp-estore-nav-icon-btn is-cart"
                onClick={openCart}
                aria-label="سلة التسوق"
              >
                <ShoppingCart size={18} />
                {totalCount > 0 && (
                  <span className="mp-estore-cart-badge tabular-nums">{totalCount}</span>
                )}
              </button>
            </div>
          </div>

          <div className="mp-estore-search-wrap is-mobile">
            <div className="mp-estore-search-box is-mobile">
              <Search size={16} className="mp-estore-search-ico" />
              <input
                ref={mobileSearchRef}
                type="search"
                value={inlineQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => {
                  setInlineQuery(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder={`ابحث عن منتج في ${rest.n}...`}
              />
              {inlineQuery && (
                <button
                  type="button"
                  className="mp-estore-search-clear"
                  onClick={() => setInlineQuery('')}
                  aria-label="مسح البحث"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {renderSearchDropdown()}
          </div>
        </div>

        {/* Horizontal Category Navigation Strip */}
        {allCategories.length > 0 && (
          <nav className="mp-estore-catbar" aria-label="أقسام المتجر">
            <div className="mp-estore-container mp-estore-catbar-scroll">
              <button
                type="button"
                className={`mp-estore-cat-tab ${selectedCatId === 'all' ? 'is-active' : ''}`}
                onClick={() => handleSelectCategory('all', false)}
              >
                <LayoutGrid size={14} />
                <span>جميع المنتجات</span>
              </button>

              {discountedItems.length > 0 && (
                <button
                  type="button"
                  className={`mp-estore-cat-tab is-offer ${selectedCatId === 'discounts' ? 'is-active' : ''}`}
                  onClick={() => handleSelectCategory('discounts')}
                >
                  <Tag size={14} />
                  <span>العروض ({discountedItems.length})</span>
                </button>
              )}

              {allCategories.map((cat) => {
                const isActive = selectedCatId === cat.id;
                const catEval = categoryEvalMap.get(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`mp-estore-cat-tab ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    <span>{cat.n}</span>
                    {catEval?.outOfSchedule && <Clock size={12} className="mp-estore-sched-ico" />}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Container */}
      <main className="mp-estore-main mp-estore-container">
        {/* Merchant Active Promos & Addons Strips */}
        {(addons.happyHour?.enabled &&
          activeMenuDiscount.sourceLabel === (addons.happyHour.title || 'ساعة السعادة')) ||
        (addons.countdownTimer?.enabled && countdownDisplay) ||
        (addons.pickupInstantDiscount?.enabled && orderType === 'pickup') ||
        addons.moodMealFinder?.enabled ||
        addons.spinWheelPromo?.enabled ||
        (totalCount > 0 && freeDeliveryEnabled && freeDeliveryMin > 0 && orderType === 'delivery') ? (
          <div className="mp-estore-promos-stack">
            {addons.happyHour?.enabled &&
              activeMenuDiscount.sourceLabel === (addons.happyHour.title || 'ساعة السعادة') && (
                <div className="mp-estore-promo-banner is-orange">
                  <span>✨ {addons.happyHour.title || 'ساعة السعادة'} مفعّلة الآن</span>
                  <strong>خصم {addons.happyHour.discountPercent || 15}% على كل المنتجات</strong>
                </div>
              )}

            {addons.countdownTimer?.enabled && countdownDisplay && (
              <div className="mp-estore-promo-banner is-navy">
                <div>
                  <strong>⏳ {addons.countdownTimer.title || 'عرض لفترة محدودة'}</strong>
                  {(addons.countdownTimer.discountValue ?? 0) > 0 && (
                    <span className="mp-estore-promo-tag">
                      خصم{' '}
                      {addons.countdownTimer.discountType === 'fixed'
                        ? formatMoney(addons.countdownTimer.discountValue || 0)
                        : `${addons.countdownTimer.discountValue}%`}
                    </span>
                  )}
                  {addons.countdownTimer.discountText && (
                    <span className="mp-estore-promo-sub"> — {addons.countdownTimer.discountText}</span>
                  )}
                </div>
                <span className="mp-estore-countdown tabular-nums" dir="ltr">
                  {countdownDisplay}
                </span>
              </div>
            )}

            {totalCount > 0 &&
              freeDeliveryEnabled &&
              freeDeliveryMin > 0 &&
              orderType === 'delivery' && (
                <div className={`mp-estore-fd-bar ${qualifiesFreeDelivery ? 'is-ready' : ''}`}>
                  <div className="mp-estore-fd-head">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={15} />
                      {qualifiesFreeDelivery ? (
                        <b>طلبك مؤهل للتوصيل المجاني!</b>
                      ) : (
                        <span>
                          أضف <b className="tabular-nums">{formatMoney(freeDeliveryRemaining)}</b> للحصول على توصيل مجاني
                        </span>
                      )}
                    </span>
                    <b className="tabular-nums">{freeDeliveryPct}%</b>
                  </div>
                  <div className="mp-estore-fd-track">
                    <div className="mp-estore-fd-fill" style={{ width: `${freeDeliveryPct}%` }} />
                  </div>
                </div>
              )}

            {((addons.pickupInstantDiscount?.enabled && orderType === 'pickup') ||
              addons.moodMealFinder?.enabled ||
              addons.spinWheelPromo?.enabled) && (
              <div className="mp-estore-quick-pills">
                {addons.pickupInstantDiscount?.enabled && orderType === 'pickup' && (
                  <span className="mp-estore-info-pill">
                    🏪 {addons.pickupInstantDiscount.title || 'خصم الاستلام الفوري'}:{' '}
                    {addons.pickupInstantDiscount.discountPercent || 10}% تلقائي
                  </span>
                )}
                {addons.moodMealFinder?.enabled && (
                  <button
                    type="button"
                    className="mp-estore-action-pill"
                    onClick={openMoodModal}
                  >
                    <Smile size={14} />
                    <span>{addons.moodMealFinder.buttonText || 'اقتراحات ذكية لك'}</span>
                  </button>
                )}
                {addons.spinWheelPromo?.enabled && (
                  <button
                    type="button"
                    className="mp-estore-action-pill is-accent"
                    onClick={openSpinModal}
                  >
                    <Sparkles size={14} />
                    <span>{spinWonLabel || 'جرّب حظك واربح خصماً'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* 3. Hero Banner Carousel (from merchant's coverImages) */}
        {coverImages.length > 0 && !trimmedQuery && (
          <section className="mp-estore-hero" aria-label="بنرات المتجر">
            <img
              src={coverImages[bannerIdx % coverImages.length]}
              alt={rest.n}
              referrerPolicy="no-referrer"
            />
            <div className="mp-estore-hero-overlay" />

            {coverImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="mp-estore-hero-arrow is-next"
                  onClick={() =>
                    setBannerIdx((i) => (i - 1 + coverImages.length) % coverImages.length)
                  }
                  aria-label="البنر السابق"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  type="button"
                  className="mp-estore-hero-arrow is-prev"
                  onClick={() => setBannerIdx((i) => (i + 1) % coverImages.length)}
                  aria-label="البنر التالي"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="mp-estore-hero-dots">
                  {coverImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`mp-estore-hero-dot ${idx === bannerIdx % coverImages.length ? 'is-active' : ''}`}
                      onClick={() => setBannerIdx(idx)}
                      aria-label={`عرض البنر ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Inline Search Results View (when user types in navbar search) */}
        {trimmedQuery ? (
          <section className="mp-estore-section">
            <div className="mp-estore-section-head">
              <div>
                <h2>نتائج البحث عن "{inlineQuery}"</h2>
                <p className="tabular-nums">تم العثور على {inlineMatches.length} منتج</p>
              </div>
              <button
                type="button"
                className="mp-estore-link-btn"
                onClick={() => setInlineQuery('')}
              >
                <X size={14} />
                <span>إلغاء البحث</span>
              </button>
            </div>

            {inlineMatches.length === 0 ? (
              <div className="mp-estore-empty">
                <Search size={34} />
                <b>لا توجد منتجات مطابقة</b>
                <span>جرّب البحث بكلمة أخرى أو تصفح أقسام المتجر.</span>
              </div>
            ) : (
              <div className="mp-estore-products-grid">
                {inlineMatches.map((it) =>
                  renderProductCard(it, catMap.get(it.cat)?.n, 'search')
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* 4. Shop by Category Grid (4 cols desktop / 2 cols mobile) */}
            {allCategories.length > 0 && selectedCatId === 'all' && (
              <section className="mp-estore-section">
                <div className="mp-estore-section-head">
                  <div>
                    <h2>تسوق حسب الفئة</h2>
                    <p>تصفح جميع أقسام {rest.n} بسهولة</p>
                  </div>
                  <button
                    type="button"
                    className="mp-estore-link-btn"
                    onClick={openCatsModal}
                  >
                    <span>عرض كل الأقسام</span>
                    <ChevronLeft size={15} />
                  </button>
                </div>

                <div className="mp-estore-cat-grid">
                  {allCategories.map((cat) => {
                    const count = allItems.filter((it) => it.cat === cat.id).length;
                    const catEval = categoryEvalMap.get(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className="mp-estore-cat-card"
                        onClick={() => handleSelectCategory(cat.id)}
                      >
                        <div className="mp-estore-cat-thumb">
                          {cat.img ? (
                            <img
                              src={cat.img}
                              alt={cat.n}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <ShoppingBag size={26} />
                          )}
                        </div>
                        <div className="mp-estore-cat-info">
                          <b>{cat.n}</b>
                          <span className="tabular-nums">{count} منتج</span>
                          {catEval?.hasSchedule && (
                            <small className={catEval.available ? 'is-on' : 'is-off'}>
                              <Clock size={10} /> {catEval.badgeText}
                            </small>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <div ref={productsTopRef} style={{ scrollMarginTop: '132px' }} />

            {/* 5. Store Discounts Section */}
            {discountedItems.length > 0 &&
              (selectedCatId === 'all' || selectedCatId === 'discounts') && (
                <section className="mp-estore-section">
                  <div className="mp-estore-section-head">
                    <div>
                      <h2>عروض وتخفيضات المتجر</h2>
                      <p>أفضل الأسعار المخفضة المتاحة الآن في {rest.n}</p>
                    </div>
                    {selectedCatId === 'discounts' && (
                      <button
                        type="button"
                        className="mp-estore-link-btn"
                        onClick={() => setSelectedCatId('all')}
                      >
                        <span>عرض كل المنتجات</span>
                      </button>
                    )}
                  </div>
                  <div className="mp-estore-products-grid">
                    {discountedItems.map((it) =>
                      renderProductCard(it, catMap.get(it.cat)?.n, 'disc')
                    )}
                  </div>
                </section>
              )}

            {/* 6. Products by Category Sections */}
            {selectedCatId !== 'discounts' &&
              (allCategories.length === 0 || allItems.length === 0 ? (
                <div className="mp-estore-empty">
                  <ShoppingBag size={36} />
                  <b>المتجر قيد التجهيز</b>
                  <span>سيتم عرض الأقسام والمنتجات هنا فور إضافتها من لوحة التحكم.</span>
                </div>
              ) : (
                visibleCategories.map((cat) => {
                  const catItems = allItems.filter((it) => it.cat === cat.id);
                  if (catItems.length === 0) return null;
                  const catEval = categoryEvalMap.get(cat.id);

                  return (
                    <section key={cat.id} id={`mc-${cat.id}`} className="mp-estore-section">
                      <div className="mp-estore-section-head">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <h2>{cat.n}</h2>
                          <span className="mp-estore-count-pill tabular-nums">
                            {catItems.length} منتج
                          </span>
                          {catEval?.hasSchedule && (
                            <span
                              className={`mp-estore-sched-pill ${catEval.available ? 'is-on' : 'is-off'}`}
                            >
                              <Clock size={11} />
                              <span>
                                {catEval.available
                                  ? `متاح ${catEval.badgeText}`
                                  : `متوفر ${catEval.badgeText}`}
                              </span>
                            </span>
                          )}
                        </div>

                        {selectedCatId !== 'all' ? (
                          <button
                            type="button"
                            className="mp-estore-link-btn"
                            onClick={() => setSelectedCatId('all')}
                          >
                            <span>عرض جميع الأقسام</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="mp-estore-link-btn"
                            onClick={() => handleSelectCategory(cat.id, false)}
                          >
                            <span>تصفية القسم</span>
                            <ChevronLeft size={14} />
                          </button>
                        )}
                      </div>

                      <div className="mp-estore-products-grid">
                        {catItems.map((it) => renderProductCard(it, cat.n, cat.id))}
                      </div>
                    </section>
                  );
                })
              ))}
          </>
        )}

        {/* 7. Customer Reviews Section (if enabled by store owner) */}
        {reviewsShowOnMenu && (
          <section className="mp-estore-section mp-estore-reviews">
            <div className="mp-estore-section-head">
              <div>
                <h2>تقييمات الزبائن ({restaurantReviews.length})</h2>
                <p>آراء المتسوقين وتجاربهم مع {rest.n}</p>
              </div>
              {reviewsAllowSubmit && (
                <button
                  type="button"
                  className="mp-estore-primary-btn"
                  onClick={openRateModal}
                >
                  <Star size={14} />
                  <span>أضف تقييمك</span>
                </button>
              )}
            </div>

            {restaurantReviews.length === 0 ? (
              <p className="mp-estore-reviews-empty">
                كن أول من يشارك تجربته ورأيه في منتجات {rest.n}!
              </p>
            ) : (
              <div className="mp-estore-reviews-grid">
                {restaurantReviews.slice(0, 6).map((rev) => (
                  <div key={rev.id} className="mp-estore-review-card">
                    <div className="mp-estore-review-head">
                      <b>{rev.name}</b>
                      <span className="mp-estore-stars">
                        {'★'.repeat(rev.rate || rev.stars || 5)}
                      </span>
                    </div>
                    <p>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* 8. Clean 4-Column White Store Footer (100% Dynamic Merchant Data) */}
      <footer className="mp-estore-footer">
        {/* Trust & Capabilities Strip matching estore footer band */}
        <div className="mp-estore-services-band">
          <div className="mp-estore-container mp-estore-services-grid">
            <div className="mp-estore-service-item">
              <Truck size={22} />
              <div>
                <b>{enabledTypes.includes('delivery') ? 'خدمة التوصيل' : 'تجهيز الطلبات'}</b>
                <span>
                  {rest.deliveryZones && rest.deliveryZones.length > 0
                    ? `توصيل متاح إلى ${formatNumber(rest.deliveryZones.length)} مناطق`
                    : 'طلب سريع ومباشر من المتجر'}
                </span>
              </div>
            </div>

            <div className="mp-estore-service-item">
              <Store size={22} />
              <div>
                <b>{enabledTypes.includes('pickup') ? 'استلام مباشر من المتجر' : rest.n}</b>
                <span>{openNow ? 'مفتوح الآن لاستقبال الطلبات' : 'راجع أوقات الدوام الرسمي'}</span>
              </div>
            </div>

            <div className="mp-estore-service-item">
              <MessageCircle size={22} />
              <div>
                <b>طلب وتواصل فوري</b>
                <span>تأكيد الطلب مباشرة مع إدارة {rest.n}</span>
              </div>
            </div>

            <div className="mp-estore-service-item">
              <ShieldCheck size={22} />
              <div>
                <b>جودة مضمونة</b>
                <span>جميع الأسعار والتخفيضات محدثة لحظياً</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mp-estore-container mp-estore-footer-cols">
          {/* Col 1: Store Identity & Social */}
          <div className="mp-estore-footer-col">
            <div className="mp-estore-footer-brand">
              <div className="mp-estore-logo-box is-sm">
                {rest.logo ? (
                  <img src={rest.logo} alt={rest.n} referrerPolicy="no-referrer" />
                ) : (
                  <span>{(rest.n || 'S').slice(0, 2)}</span>
                )}
              </div>
              <div>
                <h3>{rest.n}</h3>
                {rest.tagline && <span>{rest.tagline}</span>}
              </div>
            </div>

            {rest.aboutText && <p className="mp-estore-footer-about">{rest.aboutText}</p>}

            {rest.social && Object.values(rest.social).some(Boolean) && (
              <div className="mp-estore-footer-socials">
                {rest.social.instagram && (
                  <a href={rest.social.instagram} target="_blank" rel="noopener noreferrer">
                    انستغرام
                  </a>
                )}
                {rest.social.facebook && (
                  <a href={rest.social.facebook} target="_blank" rel="noopener noreferrer">
                    فيسبوك
                  </a>
                )}
                {rest.social.tiktok && (
                  <a href={rest.social.tiktok} target="_blank" rel="noopener noreferrer">
                    تيك توك
                  </a>
                )}
                {rest.social.x && (
                  <a href={rest.social.x} target="_blank" rel="noopener noreferrer">
                    منصة X
                  </a>
                )}
                {rest.social.whatsapp && (
                  <a
                    href={waLink(rest.social.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="is-wa"
                  >
                    واتساب
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 2: Store Categories */}
          <div className="mp-estore-footer-col">
            <h4>أقسام المتجر</h4>
            {allCategories.length === 0 ? (
              <p className="mp-estore-footer-muted">لا توجد أقسام مضافة بعد</p>
            ) : (
              <ul className="mp-estore-footer-links">
                <li>
                  <button type="button" onClick={() => handleSelectCategory('all')}>
                    جميع المنتجات ({allItems.length})
                  </button>
                </li>
                {allCategories.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => handleSelectCategory(c.id)}>
                      {c.n}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Col 3: Customer Tools */}
          <div className="mp-estore-footer-col">
            <h4>معلومات وخدمات</h4>
            <ul className="mp-estore-footer-links">
              <li>
                <button type="button" onClick={openWorkModal}>
                  أوقات العمل والدوام
                </button>
              </li>
              {rest.aboutText && (
                <li>
                  <button type="button" onClick={openAboutModal}>
                    نبذة عن {rest.n}
                  </button>
                </li>
              )}
              {reviewsAllowSubmit && (
                <li>
                  <button type="button" onClick={openRateModal}>
                    تقييم المتجر والخدمة
                  </button>
                </li>
              )}
              <li>
                <button type="button" onClick={openShareModal}>
                  مشاركة رابط المتجر
                </button>
              </li>
              {rest.googleReviewUrl && (
                <li>
                  <a href={rest.googleReviewUrl} target="_blank" rel="noopener noreferrer">
                    تقييمنا على Google Maps
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Contact & Delivery Zones */}
          <div className="mp-estore-footer-col">
            <h4>التواصل ومناطق التوصيل</h4>
            <div className="mp-estore-footer-contact">
              {rest.ph && (
                <a href={`tel:${rest.ph}`} dir="ltr" className="tabular-nums">
                  <Phone size={14} />
                  <span>{rest.ph}</span>
                </a>
              )}
              {rest.address && (
                <div>
                  <MapPin size={14} />
                  <span>{rest.address}</span>
                </div>
              )}
              {rest.mapUrl && (
                <a href={rest.mapUrl} target="_blank" rel="noopener noreferrer" className="is-map">
                  <MapPin size={14} />
                  <span>عرض الموقع على الخريطة</span>
                </a>
              )}
              {rest.deliveryZones && rest.deliveryZones.length > 0 && (
                <div className="mp-estore-footer-zones">
                  <b>مناطق التوصيل:</b>
                  <span>
                    {rest.deliveryZones
                      .slice(0, 4)
                      .map((z) => z.area)
                      .join(' · ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Platform Bar */}
        <div className="mp-estore-footer-bottom">
          <div className="mp-estore-container mp-estore-footer-bottom-inner">
            <span>© {new Date().getFullYear()} {rest.n}. جميع الحقوق محفوظة.</span>
            <div className="mp-estore-powered">
              <span>مدعوم بواسطة</span>
              <button
                type="button"
                className="mp-estore-powered-logo"
                onClick={() => onNavigate('/')}
              >
                <AppLogo size={20} />
              </button>
              <button
                type="button"
                className="mp-estore-own-btn"
                onClick={() => onNavigate('/signup')}
              >
                أنشئ متجرك الإلكتروني
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. Mobile Floating Frosted Glass Bottom Bar */}
      <nav className="mp-estore-bottom-nav" aria-label="التنقل السريع">
        <button
          type="button"
          className={`mp-estore-bnav-btn ${selectedCatId === 'all' && !trimmedQuery ? 'is-active' : ''}`}
          onClick={() => {
            setSelectedCatId('all');
            setInlineQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Home size={19} />
          <span>الرئيسية</span>
        </button>

        <button
          type="button"
          className="mp-estore-bnav-btn"
          onClick={openCatsModal}
        >
          <LayoutGrid size={19} />
          <span>الأقسام</span>
        </button>

        <button
          type="button"
          className={`mp-estore-bnav-btn ${trimmedQuery ? 'is-active' : ''}`}
          onClick={handleFocusSearch}
        >
          <Search size={19} />
          <span>البحث</span>
        </button>

        <button
          type="button"
          className="mp-estore-bnav-btn is-cart"
          onClick={openCart}
        >
          <div className="mp-estore-bnav-cart-wrap">
            <ShoppingCart size={19} />
            {totalCount > 0 && (
              <span className="mp-estore-bnav-badge tabular-nums">{totalCount}</span>
            )}
          </div>
          <span>السلة</span>
        </button>
      </nav>
    </div>
  );
};
