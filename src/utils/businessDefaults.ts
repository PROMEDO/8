/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import restLogoUrl from '../assets/images/default_rest_logo_1794645977825.jpg';
import restBannerUrl from '../assets/images/default_rest_banner_1794645979472.jpg';
import storeLogoUrl from '../assets/images/default_store_logo_1794645977523.jpg';
import storeBannerUrl from '../assets/images/default_store_banner_1794645978498.jpg';
import type { Restaurant, SiteSettings } from '../types';
import type { ResolvedPlanInfo } from './plans';
import { isStoreProject } from './terminology';

export const DEFAULT_MEDIA_ASSETS = {
  restaurant: {
    logo: restLogoUrl,
    banner: restBannerUrl,
  },
  store: {
    logo: storeLogoUrl,
    banner: storeBannerUrl,
  },
};

export function getDefaultBusinessMedia(projectType?: string): {
  logo: string;
  banner: string;
  tagline: string;
  aboutText: string;
} {
  const isStore = isStoreProject(projectType);
  const media = isStore ? DEFAULT_MEDIA_ASSETS.store : DEFAULT_MEDIA_ASSETS.restaurant;

  return isStore
    ? {
        logo: media.logo,
        banner: media.banner,
        tagline: 'متجر إلكتروني متكامل لأحدث المنتجات والخدمات بجودة عالية وتوصيل سريع',
        aboutText:
          'أهلاً بكم في متجرنا! نوفر لكم تشكيلة مختارة من المنتجات والخدمات والعروض المميزة لتتصفحوها وتطلبوها بكل سهولة وسرعة.',
      }
    : {
        logo: media.logo,
        banner: media.banner,
        tagline: 'أشهى الأطباق المحضرة يومياً طازجة بجودة عالية',
        aboutText:
          'أهلاً بكم في مطعمنا. نحضّر لكم أشهى الأطباق والمشروبات يومياً من أجود المكونات الطازجة لتصلكم بأسرع وقت.',
      };
}

export function ensureRestaurantDefaults<T extends Partial<Restaurant>>(r: T): T {
  if (!r) return r;
  const def = getDefaultBusinessMedia(r.projectType);
  const existingCovers = Array.isArray(r.coverImages)
    ? r.coverImages.filter((u) => typeof u === 'string' && u.trim().length > 0)
    : [];
  const resolvedMode: 'dark' | 'light' | 'auto' =
    r.themeMode === 'dark' ? 'dark' : r.themeMode === 'auto' ? 'auto' : 'light';
  const resolvedPreset = r.themePreset || (resolvedMode === 'dark' ? 'emerald-dark' : 'clean-light');

  return {
    ...r,
    themeMode: resolvedMode,
    themePreset: resolvedPreset,
    logo: r.logo && String(r.logo).trim() ? r.logo : def.logo,
    coverImages: existingCovers.length > 0 ? existingCovers : [def.banner],
    tagline: r.tagline && String(r.tagline).trim() ? r.tagline : def.tagline,
    aboutText: r.aboutText && String(r.aboutText).trim() ? r.aboutText : def.aboutText,
  };
}

const RESERVED_SLUGS = new Set([
  'home',
  'services',
  'steps',
  'demo',
  'pricing',
  'faq',
  'about',
  'login',
  'signup',
  'forgot',
  'onboard',
  'dashboard',
  'admin',
  'menu',
  'api',
  'assets',
  'public',
]);

const MENU_CODE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function sanitizeSlug(raw: string): string {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '');
}

export function isReservedSlug(slug: string): boolean {
  const clean = sanitizeSlug(slug);
  return !clean || RESERVED_SLUGS.has(clean) || clean.startsWith('menu-');
}

export function isValidSixCharCode(slug: string): boolean {
  return /^[a-z0-9]{6}$/.test(String(slug || '').trim().toLowerCase());
}

export function generateRandomMenuCode(takenSlugs?: Set<string>): string {
  for (let attempt = 0; attempt < 120; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += MENU_CODE_CHARS.charAt(Math.floor(Math.random() * MENU_CODE_CHARS.length));
    }
    if (!isReservedSlug(code) && (!takenSlugs || !takenSlugs.has(code))) {
      takenSlugs?.add(code);
      return code;
    }
  }
  return `m${Date.now().toString(36).slice(-5)}`.toLowerCase();
}

export function getSubdomainBaseDomain(site?: Partial<SiteSettings> | null): string {
  const raw = String(site?.subdomainRules?.baseDomain || 'menuplus.io')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
  return raw || 'menuplus.io';
}

export function getFullSubdomainUrl(
  rest: Partial<Restaurant> | undefined | null,
  site?: Partial<SiteSettings> | null,
  resolvedPlan?: ResolvedPlanInfo | null
): string | null {
  if (!rest?.id) return null;
  if (site?.subdomainRules?.enabled !== true) return null;
  const slug = sanitizeSlug(rest.slug || rest.subdomain || '');
  const canCustomSlug = resolvedPlan ? resolvedPlan.perms.customSlug : Boolean(slug);
  if (!slug || !canCustomSlug || isReservedSlug(slug)) return null;
  return `https://${slug}.${getSubdomainBaseDomain(site)}`;
}

export function detectClientSubdomain(site?: Partial<SiteSettings> | null): string | null {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname.toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return null;
  if (host.endsWith('.localhost')) {
    const sub = host.slice(0, -'.localhost'.length);
    return sub && !sub.includes('.') && !isReservedSlug(sub) ? sub : null;
  }
  const base = getSubdomainBaseDomain(site).replace(/^www\./, '');
  if (host === base || host === `www.${base}`) return null;
  const suffix = `.${base}`;
  if (host.endsWith(suffix)) {
    const sub = host.slice(0, -suffix.length);
    return sub && !sub.includes('.') && !isReservedSlug(sub) ? sub : null;
  }
  return null;
}

export function getPublicMenuUrlPath(
  rest: Partial<Restaurant> | undefined | null,
  _resolvedPlan?: ResolvedPlanInfo | null
): string {
  if (!rest?.id) return '/cap-burger';
  const slug = sanitizeSlug(rest.slug || rest.subdomain || '');
  if (slug && !isReservedSlug(slug)) {
    return `/${slug}`;
  }
  if (rest.id === 'demo') return '/cap-burger';
  const fallbackId = sanitizeSlug(rest.id);
  return fallbackId && !isReservedSlug(fallbackId) ? `/${fallbackId}` : '/cap-burger';
}

export function getSupportWhatsapp(site?: Partial<SiteSettings> | null): string {
  return String(site?.supportWhatsapp || site?.wa || '07724799679').trim();
}

export function isSignupEnabled(site?: Partial<SiteSettings> | null): boolean {
  return site?.signupEnabled === true;
}
