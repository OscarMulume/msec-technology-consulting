import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const KNOWLEDGE_DIR = path.resolve('supabase/functions/assistant');

async function readKnowledge(locale) {
  return readFile(path.join(KNOWLEDGE_DIR, `knowledge.${locale}.md`), 'utf8');
}

test('les connaissances FR et EN contiennent les faits obligatoires', async () => {
  const fr = await readKnowledge('fr');
  const en = await readKnowledge('en');

  for (const [locale, text] of [['fr', fr], ['en', en]]) {
    assert.ok(text.length > 10_000, `knowledge.${locale}.md est trop court`);
    assert.match(text, /Oscar Mulume/, `${locale} : nom manquant`);
    assert.match(text, /M-SEC Technology Consulting/, `${locale} : entreprise manquante`);
    assert.match(text, /oscarmulume1612@gmail\.com/, `${locale} : e-mail manquant`);
    assert.doesNotMatch(text, /975 585 150|\+243/, `${locale} : le téléphone ne doit pas figurer dans les connaissances`);
    assert.doesNotMatch(text, /cyberattaque majeure|major cyberattack/, `${locale} : formulation remplacée par « incident de sécurité »`);
    assert.match(text, /Mosala/, `${locale} : Mosala manquant`);
    assert.match(text, /nonchalant-cv/, `${locale} : lien du dépôt Mosala manquant`);
    assert.match(text, /dev\.to\/oscarmulume\/mosala/, `${locale} : lien de l'article Mosala manquant`);
    assert.match(text, /POS Pro/, `${locale} : POS Pro manquant`);
    assert.match(text, /Malaika Ranch/, `${locale} : Malaika Ranch manquant`);
    assert.match(text, /Cisco Networking Academy/, `${locale} : badge Cisco manquant`);
    assert.match(text, /Ethical Hacker/, `${locale} : badge Ethical Hacker manquant`);
    assert.match(text, /Junior Cybersecurity Analyst Career Path/, `${locale} : badge Junior manquant`);
    assert.match(text, /credly\.com/, `${locale} : lien Credly manquant`);
    assert.match(text, /ISO 27001/, `${locale} : référentiel ISO manquant`);
    assert.doesNotMatch(text, /\uFFFD/, `${locale} : caractère de remplacement Unicode`);
    assert.doesNotMatch(text, /M-Sec\b/, `${locale} : graphie M-Sec interdite`);
    assert.doesNotMatch(text, /\bTODO\b/i, `${locale} : TODO non résolu`);
  }

  assert.match(fr, /badges de formation, pas des certifications professionnelles/);
  assert.match(en, /training badges, not professional certifications/);
  assert.match(fr, /Ne pas dire que POS Pro est disponible/);
  assert.match(en, /Do not say POS Pro is available/);
  assert.match(fr, /99,9 %/);
  assert.match(en, /99\.9%/);
});

test('les études de cas sont présentées comme des exemples de missions', async () => {
  const fr = await readKnowledge('fr');
  const en = await readKnowledge('en');
  assert.match(fr, /Exemple de mission : Refonte du câblage/);
  assert.match(fr, /ne pas affirmer qu'il s'agit de chantiers/i);
  assert.match(en, /Example mission : Rewiring/);
  assert.match(en, /Do not claim they are completed projects/);
  assert.match(fr, /après un incident de sécurité/);
  assert.match(en, /after a security incident/);
});

test('les connaissances citent les cinq badges et leurs liens', async () => {
  const fr = await readKnowledge('fr');

  for (const name of [
    'Ethical Hacker',
    'Junior Cybersecurity Analyst Career Path',
    'Networking Devices and Initial Configuration',
    'Networking Basics',
    'Introduction to Cybersecurity',
  ]) {
    assert.match(fr, new RegExp(name), `badge manquant : ${name}`);
  }

  assert.match(fr, /https:\/\/www\.credly\.com\/badges\/bc73a9b9-0b18-423f-b230-485a61ddfcc6\/public_url/);
  assert.match(fr, /https:\/\/www\.credly\.com\/badges\/28ac05ee-4d11-4114-9c58-15cbf86c4589\/public_url/);
  assert.match(fr, /https:\/\/www\.credly\.com\/users\/oscar-mulume/);
});
