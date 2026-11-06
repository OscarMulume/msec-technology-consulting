import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeReply, stripHtml, trimToCompleteSentence } from '../supabase/functions/assistant/core.ts';
import { systemPrompt } from '../supabase/functions/assistant/messages.ts';

test('P0 : le HTML du modèle devient du texte (lien conservé en clair)', () => {
  const out = stripHtml('Écrivez à <a href="mailto:a@b.cd">a@b.cd</a> ou voir <a href="https://x.test/p">la page</a><br>Fin <b>ok</b>');
  assert.equal(out, 'Écrivez à a@b.cd ou voir la page : https://x.test/p\nFin ok');
  assert.ok(!/[<>]/.test(out));
});

test('P0 : réponse coupée par la limite de jetons -> arrêt à la dernière phrase complète', () => {
  const cut = 'Première phrase complète. Deuxième phrase complète. Troisième phrase coup';
  assert.equal(trimToCompleteSentence(cut), 'Première phrase complète. Deuxième phrase complète.');
  assert.equal(sanitizeReply(cut, 'fr', true), 'Première phrase complète. Deuxième phrase complète.');
  assert.equal(sanitizeReply(cut, 'fr', false), cut);
});

test('P0 : sans point exploitable, la coupure est signalée par une ellipse', () => {
  assert.equal(trimToCompleteSentence('mot mot mot mot'), 'mot mot mot mot…');
});

test('P0 : le prompt impose la troisième personne, aucune invention et aucun HTML', () => {
  for (const lang of ['fr', 'en']) {
    const prompt = systemPrompt(lang, 'x');
    assert.match(prompt, lang === 'fr' ? /troisième personne/ : /third person/);
    assert.match(prompt, lang === 'fr' ? /aucune fonctionnalité/ : /add no feature/);
    assert.match(prompt, lang === 'fr' ? /aucun HTML/ : /no HTML/);
  }
});
