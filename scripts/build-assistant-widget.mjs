// Compile le widget (src/assistant/msec-assistant.src.js) en ES2017 pour les WebView Android 7 / Tauri,
// vérifie l'absence de syntaxe et d'API trop récentes, puis écrit :
//   public/assistant/msec-assistant.js      (adresse stable, dernière version)
//   public/assistant/v2/msec-assistant.js   (version figée : à utiliser par les applications hors ligne)
//   node scripts/build-assistant-widget.mjs [--check]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'src', 'assistant', 'msec-assistant.src.js');
const MSBOT = path.join(ROOT, 'src', 'assistant', 'msbot.src.js');
const TARGETS = [
  path.join(ROOT, 'public', 'assistant', 'msec-assistant.js'),
  path.join(ROOT, 'public', 'assistant', 'v2', 'msec-assistant.js'),
];

// Syntaxe ou API postérieure à ES2017 (ou non disponible dans un vieux WebView) : interdites dans le résultat.
export const FORBIDDEN = [
  [/\?\./, 'chaînage optionnel (ES2020)'],
  [/\?\?/, 'coalescence nulle (ES2020)'],
  [/\bcatch\s*\{/, 'catch sans paramètre (ES2019)'],
  [/\.at\(/, 'Array.prototype.at (ES2022)'],
  [/\.replaceAll\(/, 'replaceAll (ES2021)'],
  [/Object\.fromEntries/, 'Object.fromEntries (ES2019)'],
  [/\.flat(Map)?\(/, 'flat/flatMap (ES2019)'],
  [/\.trimStart\(|\.trimEnd\(/, 'trimStart/trimEnd (ES2019)'],
  [/\bstructuredClone\b/, 'structuredClone'],
  [/\b\d[\d]*_\d/, 'séparateur numérique (ES2021)'],
  [/\.\.\.\s*\w+\s*\}\s*=/, 'reste d’objet (ES2018)'],
  [/\bBigInt\b|\b\d+n\b/, 'BigInt (ES2020)'],
  [/\bstatic\s*\{/, 'bloc statique de classe (ES2022)'],
  [/\bclass\b[^{]*\{[^}]*\b#\w+/, 'champ privé de classe (ES2022)'],
];

export function compile(source) {
  const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2017, allowJs: true, removeComments: true },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (errors.length > 0) throw new Error(errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
  return result.outputText.replace(/\r\n/g, '\n');
}

export function findForbidden(code) {
  // On ignore les chaînes et commentaires : on teste le code tel quel mais on retire d'abord les commentaires de ligne.
  const stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  return FORBIDDEN.filter(([pattern]) => pattern.test(stripped)).map(([, label]) => label);
}

const source = await readFile(SOURCE, 'utf8');
const msbot = await readFile(MSBOT, 'utf8');
// La mascotte est concaténée au widget : le portfolio la charge en cross-origin,
// un fichier séparé ne serait pas résolu depuis oscarmulume.github.io.
const output = compile(msbot) + '\n' + compile(source);
const problems = findForbidden(output);
if (problems.length > 0) {
  console.error(`Widget : syntaxe ou API trop récente pour ES2017 : ${problems.join(', ')}`);
  process.exit(1);
}

const check = process.argv.includes('--check');
for (const target of TARGETS) {
  if (check) {
    let current = '';
    try { current = (await readFile(target, 'utf8')).replace(/\r\n/g, '\n'); } catch { /* absent */ }
    if (current !== output) {
      console.error(`${path.relative(ROOT, target)} n'est pas à jour. Lancer npm run build:widget.`);
      process.exit(1);
    }
  } else {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, output, 'utf8');
    console.log(`écrit ${path.relative(ROOT, target)} (${Buffer.byteLength(output, 'utf8')} octets)`);
  }
}
if (check) console.log('widget à jour (ES2017)');
