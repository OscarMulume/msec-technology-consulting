import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { noter, taux, resumer } from '../scripts/assistant-qualite.mjs';

const APPS = ['msec', 'portfolio', 'pos', 'malaika'];

test('A1 : 20 questions par application, 4 pièges, français et anglais, regex valides', () => {
  for (const app of APPS) {
    const jeu = JSON.parse(readFileSync(new URL(`./questions/${app}.json`, import.meta.url), 'utf8'));
    assert.equal(jeu.questions.length, 20, app);
    assert.equal(jeu.questions.filter((q) => q.type === 'piege').length, 4, app);
    assert.ok(jeu.questions.some((q) => q.lang === 'fr') && jeu.questions.some((q) => q.lang === 'en'), app);
    assert.equal(new Set(jeu.questions.map((q) => q.id)).size, 20, app);
    for (const q of jeu.questions) {
      assert.ok(q.attendu, q.id);
      for (const p of [...(q.tous || []), ...(q.interdits || [])]) assert.doesNotThrow(() => new RegExp(p.startsWith('@') ? 'x' : p, 'i'), q.id);
    }
  }
});

test('A2 : notation correcte / renvoi correct / fausse / inventée', () => {
  const rep = { type: 'reponse', tous: ['gratuit'], interdits: ['@PRIX'] };
  assert.equal(noter(rep, 'Le mini-audit est gratuit.'), 'correcte');
  assert.equal(noter(rep, 'Le mini-audit est gratuit, le rapport coûte 500 $.'), 'inventee');
  assert.equal(noter(rep, 'Je ne sais pas.'), 'fausse');
  const piege = { type: 'piege', interdits: ['@TEL'] };
  assert.equal(noter(piege, "Je n'ai pas cette information. Écrivez à oscarmulume1612@gmail.com."), 'renvoi correct');
  assert.equal(noter(piege, 'Appelez le +243 975 585 150.'), 'inventee');
  assert.equal(noter(piege, 'Voici une réponse sans renvoi.'), 'fausse');
  const delai = { type: 'piege', interdits: ['@DELAI'] };
  assert.equal(noter(delai, 'Comptez 5 jours.'), 'inventee');
  assert.equal(noter(delai, 'Nous répondons sous 24 h ouvrées ; contactez le conseiller.'), 'renvoi correct');
});

test('A2 : le tiret insécable et l’apostrophe typographique ne faussent pas la notation', () => {
  assert.equal(noter({ type: 'reponse', tous: ['M-SEC'] }, 'M‑SEC propose'), 'correcte');
  assert.equal(noter({ type: 'piege', interdits: [] }, 'Je n’ai pas cette information'), 'renvoi correct');
});

test('A2 : le taux n’est jamais arrondi à la hausse', () => {
  assert.equal(taux(17, 20), 85);
  assert.equal(taux(2, 3), 66.6);
  assert.equal(taux(0, 0), 0);
  const r = resumer([{ note: 'correcte' }, { note: 'inventee' }, { note: 'erreur' }]);
  assert.equal(r.bonnes, 1);
  assert.equal(r.taux, 33.3);
});
