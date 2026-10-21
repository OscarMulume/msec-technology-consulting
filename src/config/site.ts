export const SITE = {
  origin: 'https://oscarmulume.github.io',
  base: '/msec-technology-consulting',
  name: 'M-SEC Technology Consulting',
  shortName: 'M-SEC',
  founder: 'Mulume Izuba Oscar',
  location: 'Kinshasa, RDC',
  country: 'CD',
  email: 'oscarmulume1612@gmail.com',
  phone: '+243 975 585 150',
  phoneHref: 'tel:+243975585150',
  linkedin: 'https://www.linkedin.com/in/oscar-mulume-95666b225/',
  github: 'https://github.com/OscarMulume',
} as const;

export type Locale = 'fr' | 'en';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

export function sitePath(locale: Locale, path = ''): string {
  const raw = path.replace(/^\/+/, '');
  const hashIndex = raw.indexOf('#');
  const route = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
  const hash = hashIndex >= 0 ? raw.slice(hashIndex) : '';
  const prefix = locale === 'en' ? 'en/' : '';
  let full = `/${prefix}${route}`;
  const lastSegment = full.split('/').pop() || '';
  const isFile = /\.[a-z0-9]+$/i.test(lastSegment);
  if (!hash && route && !isFile && !full.endsWith('/')) full += '/';
  if (full === '//') full = '/';
  return `${full}${hash}`;
}

export function localePath(locale: Locale, path = ''): string {
  return withBase(sitePath(locale, path));
}

export function absoluteUrl(path = '/'): string {
  return `${SITE.origin}${withBase(path)}`;
}

export function absoluteMedia(file: string): string {
  const clean = file.replace(/^\/+/, '');
  return `${SITE.origin}${base}/${clean}`;
}

export const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

export function whatsappLink(text: string): string | null {
  const digits = (whatsappNumber || '').replace(/[^\d]/g, '');
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function legalPath(locale: Locale, page: 'legal' | 'privacy' | 'cookies'): string {
  const paths = {
    fr: { legal: 'mentions-legales', privacy: 'confidentialite', cookies: 'cookies' },
    en: { legal: 'legal-notice', privacy: 'privacy', cookies: 'cookies' },
  } as const;
  return localePath(locale, `${paths[locale][page]}/`);
}
