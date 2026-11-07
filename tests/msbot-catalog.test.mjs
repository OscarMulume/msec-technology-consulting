import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

// PROMPT-6 (M1) : le catalogue doit rester complet et sans doublon.
// Les comportements `field.*` sont générés à partir de la table FIELDS ;
// les autres sont déclarés en tableaux littéraux dans msbot.src.js.
const source = await readFile(new URL('../src/assistant/msbot.src.js', import.meta.url), 'utf8');

const literal = [...source.matchAll(/^\s*\["([a-z0-9_]+\.[a-z0-9_.]+)",/gm)].map((m) => m[1]);
const fields = [...source.matchAll(/^\s*\["([a-z]+)","[^"]*","/gm)].map((m) => m[1]);
const generated = fields.flatMap((name) => ['focus', 'empty', 'format', 'fixed', 'valid'].map((suffix) => `field.${name}.${suffix}`));
const ids = [...literal, ...generated];

test('catalogue MSBot : au moins 180 comportements', () => {
  assert.ok(ids.length >= 180, `${ids.length} comportements`);
});

test('catalogue MSBot : identifiants uniques', () => {
  const seen = new Set();
  const duplicates = ids.filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
  assert.deepEqual(duplicates, []);
});

test('catalogue MSBot : les comportements câblés par le widget existent', () => {
  const required = [
    'moment.form.errors3',
    'moment.form.success',
    'env.theme.dark',
    'env.theme.light',
    'env.reducedmotion',
    'env.mobile',
    'contact.call',
    'contact.mail',
    'contact.linkedin',
    'contact.whatsapp',
    'intent.quote',
    'intent.services',
    'nav.blog',
    'chat.open',
    'chat.close',
    'chat.reopen',
    'pointer.hover',
    'pointer.click',
    'field.email.format',
    'field.tel.format',
    'field.textarea.format',
  ];
  const missing = required.filter((id) => ids.indexOf(id) === -1);
  assert.deepEqual(missing, []);
});

test('catalogue MSBot : couleurs du prototype renommées en --msbot-', () => {
  assert.equal(source.indexOf('--mico-'), -1);
  assert.match(source, /--msbot-/);
});

test('module MSBot : rendu adaptatif 3D et repli SVG', () => {
  for (const name of ['function Bot3D', 'function load3d', 'function start3d', 'function fallback3d', 'function can3d']) {
    assert.ok(source.indexOf(name) !== -1, name);
  }
  assert.match(source, /cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128/);
});

test('module MSBot : effets du prototype présents', () => {
  for (const name of ['function confetti', 'function sparkle', 'function ring', 'function plane', 'function morse', 'function shatter', 'function tele']) {
    assert.ok(source.indexOf(name) !== -1, name);
  }
});

test('module MSBot : attributs de palette et aucune réponse factice de démonstration', () => {
  assert.match(source, /function setPalette/);
  assert.equal(source.indexOf('DEMO'), -1);
  assert.equal(source.indexOf('answers['), -1);
});