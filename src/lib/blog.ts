import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../config/site';

export type BlogEntry = CollectionEntry<'blog'>;

export async function getPublishedPosts(locale: Locale): Promise<BlogEntry[]> {
  const entries = await getCollection(
    'blog',
    ({ data }) => data.locale === locale && data.draft === false,
  );
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postSlug(entry: BlogEntry): string {
  return entry.id.replace(/^(fr|en)\//, '').replace(/\.md$/, '');
}

export function postPath(locale: Locale, slug: string): string {
  return locale === 'en' ? `/en/blog/${slug}/` : `/blog/${slug}/`;
}

export function formatPostDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CD' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function readingMinutes(entry: BlogEntry): number {
  const text = entry.body || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
