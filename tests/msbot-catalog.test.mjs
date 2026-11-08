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
import { readFileSync as lire } from 'node:fs';
import test2 from 'node:test';
import assert2 from 'node:assert/strict';

test2('I3 : le site M-SEC pose les attributs data-msbot sans preventDefault sur tel:/mailto:', () => {
  const sources = ['Header', 'Footer', 'HomePage', 'WhatsAppButton', 'ServicePage']
    .map((n) => lire(new URL('../src/components/' + n + '.astro', import.meta.url), 'utf8')).join('\n');
  for (const k of ['call', 'mail', 'linkedin', 'whatsapp', 'blog', 'quote', 'services']) {
    assert2.ok(sources.includes('data-msbot="' + k + '"') || sources.includes("'" + k + "'"), 'data-msbot ' + k);
  }
  assert2.ok(sources.includes('data-msbot-section'));
  const widget = lire(new URL('../src/assistant/msec-assistant.src.js', import.meta.url), 'utf8');
  const bloc = widget.slice(widget.indexOf("document.addEventListener('click'"), widget.indexOf("document.addEventListener('pointerenter'"));
  assert2.ok(!bloc.includes('preventDefault'));
});

test2('I4 : portfolio, palette du site (sombre + accent) et reactions deduites des liens', () => {
  const m = lire(new URL('../src/assistant/msbot.src.js', import.meta.url), 'utf8');
  assert2.match(m, /portfolio:\{name:"Portfolio", dark:"#0C0D14", acc:"#6366F1"/);
  const w = lire(new URL('../src/assistant/msec-assistant.src.js', import.meta.url), 'utf8');
  assert2.ok(w.includes('a[href^="mailto:"]') && w.includes('linkedin.com'));
});

test2('La bulle MSBot ne recouvre pas le lanceur et ne bloque pas ses clics', () => {
  const m = lire(new URL('../src/assistant/msbot.src.js', import.meta.url), 'utf8');
  assert2.ok(m.includes("bubble.style.pointerEvents = 'none'") && m.includes('getElementById(\'launcher\')'));
});

test2('Aucune bulle MSBot par-dessus la fenetre de discussion ouverte', () => {
  const m = lire(new URL('../src/assistant/msbot.src.js', import.meta.url), 'utf8');
  const w = lire(new URL('../src/assistant/msec-assistant.src.js', import.meta.url), 'utf8');
  assert2.ok(m.includes('fenetre ouverte : pas de bulle') && w.includes("querySelectorAll('.msbot-bubble')"));
});

test2('Rendu : le gras **x** devient <strong> par le DOM, sans innerHTML', () => {
  const w = lire(new URL('../src/assistant/msec-assistant.src.js', import.meta.url), 'utf8');
  assert2.ok(w.includes("createElement('strong')") && !/innerHTML\s*=/.test(w));
});

test2('Etape 7 : lanceur sans fond (robot seul, ombre au sol), 64/56 px, bulle d accueil unique et sobre', () => {
  const w = lire(new URL('../src/assistant/msec-assistant.src.js', import.meta.url), 'utf8');
  const css = w.slice(w.indexOf('    .launcher {'), w.indexOf('.launcher.away'));
  assert2.match(css, /background: transparent/);
  assert2.match(css, /box-shadow: none/);
  assert2.match(css, /width: 4rem; height: 4rem/);
  assert2.match(w, /\.launcher \{ width: 3\.5rem; height: 3\.5rem; \}/);
  assert2.match(css, /launcher:focus-visible/);
  assert2.ok(!w.includes("class: 'msbot-label'"));
  const m = lire(new URL('../src/assistant/msbot.src.js', import.meta.url), 'utf8');
  assert2.ok(m.includes("msbot-welcome") && m.includes('welcome ? 5000') && m.includes('isPhone()'));
});
