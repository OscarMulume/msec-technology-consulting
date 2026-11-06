import assert from 'node:assert/strict';
import test from 'node:test';

import { handle } from '../supabase/functions/assistant/core.ts';
import {
  CATALOG_LIMITS,
  formatCatalog,
  formatProduct,
  loadMalaikaKnowledge,
  resetCatalogCache,
} from '../supabase/functions/assistant/catalog.ts';
import { APP_KNOWLEDGE, KNOWLEDGE, KNOWLEDGE_SECTIONS } from '../supabase/functions/assistant/knowledge.generated.ts';

const MALAIKA = 'https://malaika-ranch-web.vercel.app';

const PRODUCTS = [
  { id: 1, title: 'Miel de ranch', category: 'Épicerie', description: 'Miel naturel', price: 8000, unit: 'Pot', units: [{ label: 'Pot 500 g', price: 8000 }, { label: 'Pot 1 kg', price: 15000 }], currency: 'cdf', status: 'En stock', stock_qty: 40, low_stock_threshold: 5, is_draft: false },
  { id: 2, title: 'Tomates', category: 'Maraîchage', description: '', price: 2, unit: 'Kg', units: [], currency: 'usd', status: 'En stock', stock_qty: 3, low_stock_threshold: 5, is_draft: false },
  { id: 3, title: 'Œufs', category: 'Élevage', description: '', price: 500, unit: 'Pièce', units: [], currency: 'cdf', status: 'Hors stock', stock_qty: 0, low_stock_threshold: 5, is_draft: false },
  { id: 4, title: 'SECRET brouillon', category: 'Test', description: '', price: 1, unit: 'Pièce', units: [], currency: 'cdf', status: 'En stock', stock_qty: 9, low_stock_threshold: 5, is_draft: true },
];
const ZONES = [{ label: 'Gombe', fee: 10000 }, { label: 'Limete', fee: 8000 }];

function shop({ products = PRODUCTS, zones = ZONES, fail = false } = {}) {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    if (fail) throw new Error('réseau coupé');
    const body = String(url).endsWith('/api/products') ? products : zones;
    return new Response(JSON.stringify(body), { status: 200 });
  };
  return { calls, fetch: fetchImpl };
}

test('catalogue : produits publiés uniquement, prix par unité avec devise, aucune quantité exacte', () => {
  const text = formatCatalog(PRODUCTS, ZONES, 'fr', 'Quels produits ?');
  assert.match(text, /Miel de ranch/);
  assert.match(text, /Pot 500 g : 8 000 FC ; Pot 1 kg : 15 000 FC/);
  assert.match(text, /Tomates.*2 USD/);
  assert.doesNotMatch(text, /SECRET brouillon/);
  assert.equal(formatProduct(PRODUCTS[3], 'fr'), null);
  assert.doesNotMatch(text, /\b40\b|stock_qty/);
});

test('catalogue : disponibilité honnête (en stock à confirmer / stock limité / hors stock)', () => {
  const text = formatCatalog(PRODUCTS, ZONES, 'fr', '');
  assert.match(text, /Miel de ranch[^\n]*en stock \(à confirmer sur WhatsApp\)/);
  assert.match(text, /Tomates[^\n]*stock limité/);
  assert.match(text, /Œufs[^\n]*hors stock/);
  assert.match(formatCatalog(PRODUCTS, ZONES, 'en', ''), /out of stock/);
});

test('catalogue : zones de livraison et frais en FC', () => {
  const text = formatCatalog(PRODUCTS, ZONES, 'fr', '');
  assert.match(text, /Gombe : 10 000 FC/);
  assert.match(text, /Limete : 8 000 FC/);
});

test('catalogue : budget de taille respecté, produits de la question en premier', () => {
  const many = Array.from({ length: 200 }, (_, i) => ({ title: `Produit numéro ${i}`, category: 'Divers', price: 100 + i, unit: 'Pièce', units: [], currency: 'cdf', status: 'En stock', stock_qty: 50, low_stock_threshold: 5, is_draft: false }));
  many.push({ title: 'Miel rare', category: 'Épicerie', price: 9000, unit: 'Pot', units: [], currency: 'cdf', status: 'En stock', stock_qty: 50, low_stock_threshold: 5, is_draft: false });
  const text = formatCatalog(many, [], 'fr', 'Avez-vous du miel ?');
  assert.ok(text.length <= CATALOG_LIMITS.maxChars + 200, `taille ${text.length}`);
  assert.match(text, /Miel rare/, 'le produit demandé passe avant les autres');
  assert.match(text, /non listé/);
});

test('lecture en direct : mise en cache 2 minutes, puis relecture', async () => {
  resetCatalogCache();
  const s = shop();
  let now = 1_000_000;
  const deps = { fetch: s.fetch, now: () => now };
  await loadMalaikaKnowledge(deps, 'fr', 'miel');
  await loadMalaikaKnowledge(deps, 'fr', 'tomates');
  assert.equal(s.calls.length, 2, 'un seul aller-retour (produits + zones) dans la fenêtre de cache');
  now += CATALOG_LIMITS.cacheMs + 1;
  await loadMalaikaKnowledge(deps, 'fr', 'miel');
  assert.equal(s.calls.length, 4);
  assert.ok(s.calls.every((url) => url.startsWith(MALAIKA) && /\/api\/(products|delivery-zones)$/.test(url)), 'uniquement les routes publiques en lecture');
});

test('boutique illisible : aucune donnée inventée, consigne de ne donner aucun prix', async () => {
  resetCatalogCache();
  const text = await loadMalaikaKnowledge({ fetch: shop({ fail: true }).fetch, now: () => 5 }, 'fr', 'miel');
  assert.match(text, /AUCUN prix/);
  assert.doesNotMatch(text, /FC/);
});

test('assistant Malaika de bout en bout : le catalogue en direct est transmis au modèle, le brouillon jamais', async () => {
  resetCatalogCache();
  const s = shop();
  const modelBodies = [];
  const deps = {
    env: { LLM_BASE_URL: 'https://llm.example.test/v1', LLM_MODEL: 'm', LLM_API_KEY: 'cle-test', ASSISTANT_SALT: 'sel' },
    fetch: async (url, init) => {
      modelBodies.push(JSON.parse(init.body));
      return new Response(JSON.stringify({ choices: [{ message: { content: 'Le miel coûte 8 000 FC (à confirmer sur WhatsApp).' } }] }), { status: 200 });
    },
    store: { async hit() { return { allowed: true }; }, async log() {}, async insertLead() { return true; } },
    knowledge: KNOWLEDGE,
    sections: KNOWLEDGE_SECTIONS,
    appSections: APP_KNOWLEDGE,
    dynamicKnowledge: (app, lang, question) => (app === 'malaika' ? loadMalaikaKnowledge({ fetch: s.fetch }, lang, question) : Promise.resolve(null)),
    sleep: async () => {},
  };
  const request = new Request('https://x.test/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin: MALAIKA, 'x-forwarded-for': '203.0.113.5' },
    body: JSON.stringify({ app: 'malaika', lang: 'fr', messages: [{ role: 'user', content: 'Combien coûte le miel ?' }] }),
  });
  const response = await handle(request, deps);
  assert.equal(response.status, 200);
  const prompt = modelBodies[0].messages[0].content;
  assert.match(prompt, /Catalogue en direct/);
  assert.match(prompt, /Pot 1 kg : 15 000 FC/);
  assert.doesNotMatch(prompt, /SECRET brouillon/);
  assert.match(prompt, /Comment commander|La boutique Malaika Ranch/);
});

test('connaissances statiques Malaika : aucune invention de prix, de délai ni de numéro', () => {
  for (const lang of ['fr', 'en']) {
    const all = APP_KNOWLEDGE.malaika[lang].map((section) => section.text).join('\n');
    assert.doesNotMatch(all, /\d[\d\s]*(FC|USD|\$)/, `${lang} : aucun prix en dur`);
    assert.doesNotMatch(all, /\+?\d{3}[\s.-]?\d{2,3}[\s.-]?\d{3}/, `${lang} : aucun numéro`);
    assert.ok(APP_KNOWLEDGE.malaika[lang][0].always, `${lang} : première section toujours envoyée`);
  }
});
