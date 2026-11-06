// Catalogue Malaika Ranch lu EN DIRECT (lecture seule) pour l'assistant « conseiller boutique ».
// Source : les deux routes publiques de la boutique, qui n'exposent déjà que ce que voit un client :
//   GET /api/products        -> produits PUBLIÉS uniquement (is_draft = false, filtre aussi appliqué ici)
//   GET /api/delivery-zones  -> zones de livraison actives
// Jamais de commandes, de brouillons, de clients ni de quantités exactes. Aucune clé n'est nécessaire.
// Syntaxe TypeScript « effaçable » uniquement (testable avec Node).

import type { Lang } from './messages.ts';

export const MALAIKA_DEFAULT_BASE = 'https://malaika-ranch-web.vercel.app';

export const CATALOG_LIMITS = {
  timeoutMs: 5000,
  cacheMs: 120_000,
  maxChars: 4200, // ≈ 1 000 jetons
  maxDescription: 110,
} as const;

export interface CatalogDeps {
  fetch: typeof fetch;
  base?: string;
  now?: () => number;
}

interface RawUnit {
  label?: unknown;
  price?: unknown;
}

interface RawProduct {
  title?: unknown;
  category?: unknown;
  description?: unknown;
  price?: unknown;
  unit?: unknown;
  units?: unknown;
  currency?: unknown;
  status?: unknown;
  stock_qty?: unknown;
  low_stock_threshold?: unknown;
  is_draft?: unknown;
}

interface RawZone {
  label?: unknown;
  fee?: unknown;
}

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const num = (value: unknown): number | null => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

function money(amount: number, currency: unknown): string {
  const formatted = amount.toLocaleString('fr-FR', { maximumFractionDigits: 2 }).replace(/[  ]/g, ' ');
  return String(currency).toLowerCase() === 'usd' ? `${formatted} USD` : `${formatted} FC`;
}

function availability(product: RawProduct, lang: Lang): string {
  const status = text(product.status).toLowerCase();
  const qty = num(product.stock_qty);
  const low = num(product.low_stock_threshold) ?? 0;
  const out = status === 'hors stock' || status === 'rupture' || (qty !== null && qty <= 0);
  if (out) return lang === 'fr' ? 'hors stock' : 'out of stock';
  if (qty !== null && qty <= low) return lang === 'fr' ? 'stock limité (à confirmer sur WhatsApp)' : 'limited stock (confirm on WhatsApp)';
  return lang === 'fr' ? 'en stock (à confirmer sur WhatsApp)' : 'in stock (confirm on WhatsApp)';
}

function unitsOf(product: RawProduct): { label: string; price: number }[] {
  const list = Array.isArray(product.units) ? (product.units as RawUnit[]) : [];
  const units = list
    .map((unit) => ({ label: text(unit?.label), price: num(unit?.price) }))
    .filter((unit): unit is { label: string; price: number } => unit.label !== '' && unit.price !== null);
  if (units.length > 0) return units;
  const price = num(product.price);
  return price === null ? [] : [{ label: text(product.unit) || 'pièce', price }];
}

function fold(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function formatProduct(product: RawProduct, lang: Lang): string | null {
  const title = text(product.title);
  if (title === '' || product.is_draft === true) return null; // brouillons : jamais
  const units = unitsOf(product);
  const price = units.length > 0
    ? units.map((unit) => `${unit.label} : ${money(unit.price, product.currency)}`).join(' ; ')
    : lang === 'fr' ? 'prix non renseigné' : 'price not set';
  const description = text(product.description).replace(/\s+/g, ' ').slice(0, CATALOG_LIMITS.maxDescription);
  const category = text(product.category);
  const parts = [`- **${title}**${category ? ` (${category})` : ''} — ${price} — ${availability(product, lang)}`];
  if (description) parts.push(description);
  return parts.join(lang === 'fr' ? ' — ' : ' — ');
}

// Produits les plus pertinents pour la question d'abord ; budget de caractères respecté.
export function formatCatalog(products: RawProduct[], zones: RawZone[], lang: Lang, question: string): string {
  const q = ` ${fold(question).replace(/[^a-z0-9]+/g, ' ')} `;
  const scored = products
    .filter((product) => product.is_draft !== true)
    .map((product, index) => {
      const words = fold(`${text(product.title)} ${text(product.category)}`).split(/[^a-z0-9]+/).filter((w) => w.length >= 3);
      const score = words.reduce((total, word) => total + (q.includes(` ${word} `) || q.includes(` ${word.replace(/s$/, '')} `) ? 1 : 0), 0);
      return { product, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const header = lang === 'fr'
    ? '## Catalogue en direct (produits publiés, lu sur la boutique à l\'instant)\nPrix et disponibilité : ceux ci-dessous uniquement. Ne promets jamais un stock : renvoie vers WhatsApp pour confirmer.'
    : '## Live catalogue (published products, read from the shop just now)\nPrices and availability: only those below. Never promise stock: point to WhatsApp to confirm.';
  const lines: string[] = [];
  let used = header.length;
  let omitted = 0;
  for (const { product } of scored) {
    const line = formatProduct(product, lang);
    if (line === null) continue;
    if (used + line.length + 1 > CATALOG_LIMITS.maxChars) { omitted += 1; continue; }
    lines.push(line);
    used += line.length + 1;
  }
  const out = [header, ...(lines.length > 0 ? lines : [lang === 'fr' ? 'Aucun produit publié pour le moment.' : 'No published product at the moment.'])];
  if (omitted > 0) out.push(lang === 'fr' ? `(${omitted} autre(s) produit(s) non listé(s) : la boutique les affiche.)` : `(${omitted} more product(s) not listed: the shop shows them.)`);

  const zoneLines = zones
    .map((zone) => ({ label: text(zone.label), fee: num(zone.fee) }))
    .filter((zone) => zone.label !== '')
    .map((zone) => (zone.fee === null ? `- ${zone.label}` : `- ${zone.label} : ${money(zone.fee, 'cdf')}`));
  if (zoneLines.length > 0) {
    out.push(lang === 'fr' ? '\n### Zones de livraison et frais' : '\n### Delivery zones and fees', ...zoneLines);
  }
  return out.join('\n');
}

export function unavailableNote(lang: Lang): string {
  return lang === 'fr'
    ? "## Catalogue en direct\nLe catalogue est momentanément illisible : n'annonce AUCUN prix ni disponibilité ; invite à consulter la boutique ou à écrire sur WhatsApp."
    : '## Live catalogue\nThe catalogue is temporarily unreadable: announce NO price or availability; invite the visitor to check the shop or write on WhatsApp.';
}

interface CacheEntry { at: number; products: RawProduct[]; zones: RawZone[] }
let cache: CacheEntry | null = null;

export function resetCatalogCache(): void {
  cache = null;
}

async function getJson(deps: CatalogDeps, path: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CATALOG_LIMITS.timeoutMs);
  try {
    const response = await deps.fetch(`${(deps.base ?? MALAIKA_DEFAULT_BASE).replace(/\/$/, '')}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`${path} ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// Texte à ajouter aux connaissances de l'assistant Malaika pour cette question (jamais d'exception).
export async function loadMalaikaKnowledge(deps: CatalogDeps, lang: Lang, question: string): Promise<string> {
  const now = (deps.now ?? Date.now)();
  try {
    if (!cache || now - cache.at > CATALOG_LIMITS.cacheMs) {
      const [products, zones] = await Promise.all([getJson(deps, '/api/products'), getJson(deps, '/api/delivery-zones').catch(() => [])]);
      if (!Array.isArray(products)) throw new Error('catalogue : réponse inattendue');
      cache = { at: now, products: products as RawProduct[], zones: Array.isArray(zones) ? (zones as RawZone[]) : [] };
    }
    return formatCatalog(cache.products, cache.zones, lang, question);
  } catch {
    // Catalogue illisible : surtout aucune donnée périmée ancienne de plus de 10 minutes.
    if (cache && now - cache.at <= CATALOG_LIMITS.cacheMs * 5) return formatCatalog(cache.products, cache.zones, lang, question);
    return unavailableNote(lang);
  }
}
