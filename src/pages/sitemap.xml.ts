import type { APIRoute } from 'astro';
import { entryLocation, escapeXml, sitemapEntries } from '../lib/sitemap';

export const GET: APIRoute = async () => {
  const entries = await sitemapEntries();
  const urls = entries.map((entry) => [
    '<url>',
    `<loc>${escapeXml(entryLocation(entry))}</loc>`,
    entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : '',
    entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : '',
    entry.priority ? `<priority>${entry.priority}</priority>` : '',
    '</url>',
  ].join('')).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
