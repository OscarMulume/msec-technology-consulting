import { absoluteUrl, type Locale } from '../config/site';
import { getDict } from '../i18n/utils';
import { getPublishedPosts, postPath, postSlug } from './blog';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function rssResponse(locale: Locale): Promise<Response> {
  const dict = getDict(locale);
  const posts = await getPublishedPosts(locale);
  const feedPath = locale === 'en' ? '/en/blog/rss.xml' : '/blog/rss.xml';
  const homePath = locale === 'en' ? '/en/blog/' : '/blog/';
  const feedUrl = absoluteUrl(feedPath);
  const homeUrl = absoluteUrl(homePath);

  const items = posts.map((entry) => {
    const link = absoluteUrl(postPath(locale, postSlug(entry)));
    return [
      '<item>',
      `<title>${escapeXml(entry.data.title)}</title>`,
      `<link>${escapeXml(link)}</link>`,
      `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `<pubDate>${entry.data.date.toUTCString()}</pubDate>`,
      `<description>${escapeXml(entry.data.description)}</description>`,
      '</item>',
    ].join('');
  }).join('');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(dict.blog.title)}</title>`,
    `<link>${escapeXml(homeUrl)}</link>`,
    `<description>${escapeXml(dict.blog.description)}</description>`,
    `<language>${locale}</language>`,
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>`,
    items,
    '</channel>',
    '</rss>',
  ].join('');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
