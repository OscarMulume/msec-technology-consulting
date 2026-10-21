import { absoluteUrl, sitePath, type Locale } from '../config/site';
import servicesFr from '../content/services.fr.json';
import servicesEn from '../content/services.en.json';
import { getPublishedPosts, postPath, postSlug } from './blog';

type SitemapEntry = {
  path: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority?: string;
};

function staticEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: '/', changefreq: 'monthly', priority: '1.0' },
    { path: '/en/', changefreq: 'monthly', priority: '1.0' },
    { path: '/blog/', changefreq: 'weekly', priority: '0.7' },
    { path: '/en/blog/', changefreq: 'weekly', priority: '0.7' },
    { path: '/mentions-legales/', changefreq: 'yearly', priority: '0.3' },
    { path: '/en/legal-notice/', changefreq: 'yearly', priority: '0.3' },
    { path: '/confidentialite/', changefreq: 'yearly', priority: '0.3' },
    { path: '/en/privacy/', changefreq: 'yearly', priority: '0.3' },
    { path: '/cookies/', changefreq: 'yearly', priority: '0.3' },
    { path: '/en/cookies/', changefreq: 'yearly', priority: '0.3' },
  ];

  for (const service of Object.values(servicesFr)) {
    entries.push({ path: `/services/${service.slug}/`, changefreq: 'monthly', priority: '0.8' });
  }

  for (const service of Object.values(servicesEn)) {
    entries.push({ path: `/en/services/${service.slug}/`, changefreq: 'monthly', priority: '0.8' });
  }

  return entries;
}

export async function sitemapEntries(): Promise<SitemapEntry[]> {
  const entries = staticEntries();
  const locales: Locale[] = ['fr', 'en'];

  for (const locale of locales) {
    const posts = await getPublishedPosts(locale);
    for (const post of posts) {
      entries.push({
        path: postPath(locale, postSlug(post)),
        lastmod: post.data.date.toISOString(),
        changefreq: 'monthly',
        priority: '0.6',
      });
    }
  }

  return entries;
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function entryLocation(entry: SitemapEntry): string {
  return absoluteUrl(sitePath('fr', entry.path));
}
