import fr from './fr.json';
import en from './en.json';
import type { Locale } from '../config/site';

export type Dictionary = typeof fr;

const dictionaries: Record<Locale, Dictionary> = {
  fr,
  en: en as Dictionary,
};

export function getDict(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'fr' || value === 'en';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr';
}
