import assert from 'node:assert/strict';
import test from 'node:test';

import { handle } from '../supabase/functions/assistant/core.ts';
import { signAppToken, verifyAppToken } from '../supabase/functions/assistant/token.ts';
import { APP_KNOWLEDGE, KNOWLEDGE, KNOWLEDGE_SECTIONS } from '../supabase/functions/assistant/knowledge.generated.ts';

const POS = 'https://pos-pro-msec.onrender.com';
const SECRET = 'secret-de-test-pos';
const now = () => Math.floor(Date.now() / 1000);

function makeDeps() {
  const calls = { models: [], logs: [] };
  return {
    calls,
    env: { LLM_BASE_URL: 'https://llm.example.test/v1', LLM_MODEL: 'm', LLM_API_KEY: 'k', ASSISTANT_SALT: 'sel', ASSISTANT_POS_SECRET: SECRET },
    fetch: async (url, init) => {
      calls.models.push(JSON.parse(init.body));
      return new Response(JSON.stringify({ choices: [{ message: { content: 'Réponse de test.' } }] }), { status: 200 });
    },
    store: { async hit() { return { allowed: true }; }, async log(e) { calls.logs.push(e); }, async insertLead() { return true; } },
    knowledge: KNOWLEDGE,
    sections: KNOWLEDGE_SECTIONS,
    appSections: APP_KNOWLEDGE,
    sleep: async () => {},
  };
}
const req = (token) =>
  new Request('https://x.test/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin: POS, 'x-forwarded-for': '203.0.113.9', ...(token ? { 'x-assistant-token': token } : {}) },
    body: JSON.stringify({ app: 'pos', lang: 'fr', messages: [{ role: 'user', content: 'Comment clôturer la caisse ?' }] }),
  });

test('pos : sans jeton, 401 et aucun appel au modèle', async () => {
  const deps = makeDeps();
  const response = await handle(req(null), deps);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).error, 'login_required');
  assert.equal(deps.calls.models.length, 0);
});

test('pos : jeton valide accepté ; la base contient le guide (rapport Z), aucune donnée de vente', async () => {
  const deps = makeDeps();
  const response = await handle(req(await signAppToken(SECRET, 'pos', now())), deps);
  assert.equal(response.status, 200);
  const prompt = deps.calls.models[0].messages[0].content;
  assert.match(prompt, /Comptage \+ Clôture \(Z\)/);
  assert.match(prompt, /aucune donnée de vente|AUCUNE donnée de vente/);
});

test('pos : jeton falsifié, expiré, d\'une autre app ou secret absent refusés', async () => {
  const good = await signAppToken(SECRET, 'pos', now());
  const [exp, sig] = good.split('.');
  assert.equal(await verifyAppToken(SECRET, 'pos', good, now()), true);
  assert.equal(await verifyAppToken(SECRET, 'pos', `${exp}.${'0'.repeat(64)}`, now()), false);
  assert.equal(await verifyAppToken(SECRET, 'pos', good, now() + 3600), false);
  assert.equal(await verifyAppToken(SECRET, 'malaika', good, now()), false);
  assert.equal(await verifyAppToken(undefined, 'pos', good, now()), false);
  assert.equal(await verifyAppToken('autre-secret', 'pos', good, now()), false);
  assert.equal(await verifyAppToken(SECRET, 'pos', `${exp}x.${sig}`, now()), false);
  const deps = makeDeps();
  deps.env.ASSISTANT_POS_SECRET = undefined;
  assert.equal((await handle(req(good), deps)).status, 401);
});

test('connaissances pos : aucun prix d\'abonnement ni numéro en dur', () => {
  for (const lang of ['fr', 'en']) {
    const text = APP_KNOWLEDGE.pos[lang].map((s) => s.text).join('\n');
    assert.doesNotMatch(text, /\$\s?\d|\d\s?(USD|CDF|FC)\b/);
    assert.doesNotMatch(text, /\+?\d{2,3}[\s.]?\d{2}[\s.]?\d{3}[\s.]?\d{3,4}/);
  }
});
