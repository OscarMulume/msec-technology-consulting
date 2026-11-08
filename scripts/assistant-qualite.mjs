// Mesure de la qualite de l'assistant : interroge la VRAIE fonction Supabase avec les jeux de tests/questions/*.json.
// Usage : node --experimental-strip-types scripts/assistant-qualite.mjs [--app msec,portfolio,pos,malaika] [--pause 8000] [--out docs/qualite/mesure.json]
//         [--ids m16,m17] [--merge docs/qualite/avant.json]  (remesure seulement ces questions et fusionne dans un resultat existant)
// Aucune cle dans le depot : la fonction est publique (pas de JWT) ; POS exige un jeton signe avec le secret
// lu dans la variable d'environnement ASSISTANT_POS_SECRET (jamais affichee). Sans elle, POS est « non mesure ».
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ENDPOINT = 'https://cinzlzdfddvcjhmvnbtp.supabase.co/functions/v1/assistant';

const PRESETS = {
  '@PRIX': '[0-9]+([.,][0-9]+)?[ ]?([$]|usd|fc|cdf|eur|dollars?|francs?|€)|([$]|usd|€)[ ]?[0-9]',
  '@TEL': '[+]?[0-9][0-9 .-]{7,}[0-9]',
  '@DELAI': '[0-9]+[ ]?(jours?|semaines?|days?|weeks?)',
  '@STOCK': '[0-9]+[^.]{0,25}(en stock|in stock)',
};
const REFUS = /n.ai pas cette information|je ne sais pas|pas (publi|communiqu|disponible)|i don.t have|i do not have|not (published|available)|no information|ne dispose pas/i;
const RENVOI = /whatsapp|conseiller|formulaire|e-?mail|oscarmulume1612|support|contact|advisor|\bform\b/i;

export function normaliser(texte) {
  return String(texte || '')
    .replace(/[‐‑‒–]/g, '-').replace(/[  ]/g, ' ').replace(/[’‘]/g, "'");
}
function re(src) { return new RegExp(PRESETS[src] || src, 'i'); }

/** Note une reponse : 'correcte' | 'renvoi correct' | 'fausse' | 'inventee'. */
export function noter(question, reponse) {
  const r = normaliser(reponse);
  if (!r.trim()) return 'fausse';
  const interdit = (question.interdits || []).some((p) => re(p).test(r));
  if (interdit) return 'inventee';
  const renvoi = question.renvoi ? new RegExp(question.renvoi, 'i') : null;
  const aRenvoi = REFUS.test(r) || RENVOI.test(r) || (renvoi && renvoi.test(r));
  if (question.type === 'reponse') {
    const ok = (question.tous || []).every((p) => re(p).test(r));
    return ok ? 'correcte' : 'fausse';
  }
  return aRenvoi ? 'renvoi correct' : 'fausse';
}

/** Taux en pourcentage, jamais arrondi a la hausse (1 decimale tronquee). */
export function taux(bonnes, total) {
  return total ? Math.floor((bonnes / total) * 1000) / 10 : 0;
}

export function resumer(lignes) {
  const c = { correcte: 0, 'renvoi correct': 0, fausse: 0, inventee: 0, erreur: 0 };
  for (const l of lignes) c[l.note] = (c[l.note] || 0) + 1;
  const bonnes = c.correcte + c['renvoi correct'];
  return { total: lignes.length, ...c, bonnes, taux: taux(bonnes, lignes.length) };
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function jetonPos(app) {
  const secret = process.env.ASSISTANT_POS_SECRET;
  if (!secret) return null;
  const { signAppToken } = await import(new URL('../supabase/functions/assistant/token.ts', import.meta.url).href);
  return signAppToken(secret, app, Math.floor(Date.now() / 1000));
}

async function demander(jeu, q) {
  const headers = { 'Content-Type': 'application/json', Origin: jeu.origin };
  if (jeu.needsToken) {
    const t = await jetonPos(jeu.app);
    if (t) headers['X-Assistant-Token'] = t;
  }
  const rep = await fetch(ENDPOINT, {
    method: 'POST', headers, signal: AbortSignal.timeout(45000),
    body: JSON.stringify({ app: jeu.app, lang: q.lang, messages: [{ role: 'user', content: q.q }] }),
  });
  let data = null;
  try { data = await rep.json(); } catch { data = null; }
  return { status: rep.status, reply: data && typeof data.reply === 'string' ? data.reply : '', error: data && data.error };
}

export async function mesurer(jeu, pause, journal = () => {}) {
  const lignes = [];
  for (const q of jeu.questions) {
    let res = { status: 0, reply: '', error: 'reseau' };
    for (let essai = 1; essai <= 3; essai++) {
      try { res = await demander(jeu, q); } catch (e) { res = { status: 0, reply: '', error: String(e.message).slice(0, 60) }; }
      const secours = /momentan[ée]ment indisponible|temporarily unavailable/i.test(normaliser(res.reply));
      if (res.status === 200 && res.reply && !secours) break;
      await dormir(20000);
    }
    const ok = res.status === 200 && res.reply && !/momentan[ée]ment indisponible|temporarily unavailable/i.test(normaliser(res.reply));
    const note = ok ? noter(q, res.reply) : 'erreur';
    lignes.push({ id: q.id, lang: q.lang, type: q.type, q: q.q, attendu: q.attendu, note, status: res.status, erreur: res.error || undefined, reponse: String(res.reply).slice(0, 600) });
    journal(`${jeu.app} ${q.id} ${note}`);
    await dormir(pause);
  }
  return lignes;
}

async function main() {
  const args = process.argv.slice(2);
  const val = (nom, defaut) => { const i = args.indexOf('--' + nom); return i >= 0 ? args[i + 1] : defaut; };
  const apps = val('app', 'msec,portfolio,pos,malaika').split(',');
  const pause = Number(val('pause', '8000'));
  const sortie = val('out', 'docs/qualite/mesure.json');
  const ids = val('ids', '') ? val('ids', '').split(',') : null;
  const fusion = val('merge', '');
  const racine = dirname(fileURLToPath(import.meta.url));
  const resultat = fusion ? JSON.parse(readFileSync(fusion, 'utf8')) : { apps: {} };
  resultat.date = new Date().toISOString();
  for (const app of apps) {
    const jeu = JSON.parse(readFileSync(`${racine}/../tests/questions/${app}.json`, 'utf8'));
    if (jeu.needsToken && !process.env.ASSISTANT_POS_SECRET) {
      resultat.apps[app] = { non_mesure: 'ASSISTANT_POS_SECRET absent : jeton impossible a signer' };
      console.log(`${app}: NON MESURE (secret absent)`);
      continue;
    }
    const jeuMesure = ids ? { ...jeu, questions: jeu.questions.filter((q) => ids.includes(q.id)) } : jeu;
    if (!jeuMesure.questions.length) continue;
    let lignes = await mesurer(jeuMesure, pause, (m) => console.log(m));
    const ancien = resultat.apps[app] && resultat.apps[app].lignes;
    if (ids && ancien) {
      const nouveaux = new Map(lignes.map((l) => [l.id, l]));
      lignes = ancien.map((l) => nouveaux.get(l.id) || l);
    }
    resultat.apps[app] = { resume: resumer(lignes), lignes };
    console.log(app, JSON.stringify(resultat.apps[app].resume));
  }
  mkdirSync(dirname(sortie), { recursive: true });
  writeFileSync(sortie, JSON.stringify(resultat, null, 1));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
