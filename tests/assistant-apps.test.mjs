import assert from 'node:assert/strict';
import test from 'node:test';

import { handle, isAllowedOrigin } from '../supabase/functions/assistant/core.ts';
import { APP_IDS, PROFILES, toAppId } from '../supabase/functions/assistant/profiles.ts';
import { systemPrompt } from '../supabase/functions/assistant/messages.ts';
import { APP_KNOWLEDGE, KNOWLEDGE, KNOWLEDGE_SECTIONS } from '../supabase/functions/assistant/knowledge.generated.ts';

const SITE = 'https://oscarmulume.github.io';
const MALAIKA = 'https://malaika-ranch-web.vercel.app';

function makeDeps(extra = {}) {
  const calls = { models: [], hits: [], logs: [], leads: [] };
  return {
    calls,
    env: { LLM_BASE_URL: 'https://llm.example.test/v1', LLM_MODEL: 'm', LLM_API_KEY: 'cle-test', ASSISTANT_SALT: 'sel' },
    fetch: async (url, init) => {
      calls.models.push(JSON.parse(init.body));
      return new Response(JSON.stringify({ choices: [{ message: { content: 'Réponse de test.' } }] }), { status: 200 });
    },
    store: {
      async hit(key, h, d) { calls.hits.push({ key, h, d }); return { allowed: true }; },
      async log(entry) { calls.logs.push(entry); },
      async insertLead(row) { calls.leads.push(row); return true; },
    },
    knowledge: KNOWLEDGE,
    sections: KNOWLEDGE_SECTIONS,
    appSections: {
      ...APP_KNOWLEDGE,
      malaika: { fr: [{ id: '1', title: '1. Boutique', text: '## 1. Boutique\nBoutique en ligne.', always: true, keywords: [] }], en: [] },
    },
    sleep: async () => {},
    ...extra,
  };
}

const post = (body, origin = SITE) =>
  new Request('https://x.test/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin, 'x-forwarded-for': '203.0.113.9' },
    body: JSON.stringify(body),
  });
const ask = (extra = {}) => ({ lang: 'fr', messages: [{ role: 'user', content: 'Bonjour' }], ...extra });

test('liste blanche : app inconnue refusée, app absente = msec (ancien widget)', async () => {
  assert.equal(toAppId(undefined), 'msec');
  assert.equal(toAppId('malaika'), 'malaika');
  assert.equal(toAppId('../etc'), null);
  assert.equal(toAppId(42), null);
  const unknown = await handle(post(ask({ app: 'pirate' })), makeDeps());
  assert.equal(unknown.status, 400);
  assert.equal((await unknown.json()).error, 'unknown_app');
  const legacy = await handle(post(ask()), makeDeps());
  assert.equal(legacy.status, 200);
});

test('Herbo et MonImmo sont préparés mais désactivés', async () => {
  for (const app of ['herbo', 'monimmo']) {
    assert.equal(PROFILES[app].enabled, false);
    const deps = makeDeps();
    const response = await handle(post(ask({ app })), deps);
    assert.equal(response.status, 403, app);
    assert.equal((await response.json()).error, 'app_disabled');
    assert.equal(deps.calls.models.length, 0, 'aucun appel au modèle');
  }
  assert.deepEqual([...APP_IDS].sort(), ['herbo', 'malaika', 'monimmo', 'msec', 'portfolio', 'pos']);
});

test("CORS par application : l'origine de Malaika ne peut pas utiliser le profil msec, et inversement", async () => {
  assert.equal(isAllowedOrigin(MALAIKA, {}), true);
  const crossed = await handle(post(ask({ app: 'msec' }), MALAIKA), makeDeps());
  assert.equal(crossed.status, 403);
  const crossed2 = await handle(post(ask({ app: 'malaika' }), SITE), makeDeps());
  assert.equal(crossed2.status, 403);
  const ok = await handle(post(ask({ app: 'malaika' }), MALAIKA), makeDeps());
  assert.equal(ok.status, 200);
  assert.equal(ok.headers.get('access-control-allow-origin'), MALAIKA);
});

test('chaque application a son prompt, son journal, ses limites et sa clé de limitation', async () => {
  const deps = makeDeps();
  await handle(post(ask({ app: 'malaika' }), MALAIKA), deps);
  const prompt = deps.calls.models[0].messages[0].content;
  assert.match(prompt, /Malaika Ranch/);
  assert.doesNotMatch(prompt, /Demander un devis/);
  assert.match(prompt, /N'invente jamais un prix|Never invent a price/);
  assert.equal(deps.calls.logs[0].app, 'malaika');
  assert.match(deps.calls.hits[0].key, /^chat:malaika:/);
  assert.equal(deps.calls.hits[0].h, PROFILES.malaika.limits.hourly);
});

test('portfolio : connaissances propres (sous-ensemble de la base M-SEC), sans la section services', async () => {
  const sections = APP_KNOWLEDGE.portfolio.fr;
  assert.ok(sections.length >= 3);
  assert.equal(sections[0].always, true);
  assert.ok(sections.every((section) => !/Services M-SEC/.test(section.title)));
  const deps = makeDeps();
  const response = await handle(post(ask({ app: 'portfolio' })), deps);
  assert.equal(response.status, 200);
  assert.match(deps.calls.models[0].messages[0].content, /portfolio d'Oscar Mulume/);
});

test('application sans connaissances : 503 honnête, aucun appel au modèle', async () => {
  const deps = makeDeps({ appSections: {} });
  const response = await handle(post(ask({ app: 'pos' }, 'https://pos-pro-msec.onrender.com'), 'https://pos-pro-msec.onrender.com'), deps);
  assert.equal(response.status, 503);
  assert.equal(deps.calls.models.length, 0);
});

test('demande de contact : la source est l\'application', async () => {
  const deps = makeDeps();
  const response = await handle(
    post({ action: 'lead', app: 'malaika', lang: 'fr', lead: { name: 'Marie K', contact: '+243 81 234 5678', need: 'Commande de miel' } }, MALAIKA),
    deps,
  );
  assert.equal(response.status, 200);
  assert.equal(deps.calls.leads[0].source, 'malaika');
});

test('prompt : troisième personne, rien à ajouter hors base, pas de HTML — pour chaque application activée', () => {
  for (const app of APP_IDS.filter((id) => PROFILES[id].enabled)) {
    for (const lang of ['fr', 'en']) {
      const prompt = systemPrompt(lang, 'x', PROFILES[app]);
      assert.match(prompt, lang === 'fr' ? /troisième personne/ : /third person/, app);
      assert.match(prompt, lang === 'fr' ? /aucun HTML/ : /no HTML/, app);
    }
  }
});
