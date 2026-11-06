// Connaissances des applications autres que `msec` (assistant multi-applications, P1).
// - portfolio : sous-ensemble vérifié de la base M-SEC (identité, parcours, projets, badges, interdits).
// - autres applications : fichiers rédigés à la main dans supabase/functions/assistant/apps/<app>.<lang>.md.
//   Sections « ## » ; la première est toujours envoyée ; mots-clés facultatifs : <!-- mots-cles: a, b -->.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const PORTFOLIO_SECTION_IDS = ['1', '6', '7', '8', '9'];

function keywordsFrom(heading, body) {
  const declared = body.match(/<!--\s*(?:mots-cles|keywords)\s*:\s*([^>]*?)\s*-->/i)?.[1];
  const parts = declared ? declared.split(/[,;]/) : heading.replace(/^\d+\.\s*/, '').split(/\s+/);
  const words = parts.map((word) => word.trim().toLowerCase()).filter((word) => word.length >= 3);
  return [...new Set(words)];
}

export function splitAppSections(markdown) {
  const text = markdown.replace(/\r\n/g, '\n');
  const matches = [...text.matchAll(/^## (.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? text.length) : text.length;
    const heading = match[1].trim();
    const body = text.slice(start, end).trim();
    return {
      id: String(index + 1),
      title: heading,
      text: body,
      ...(index === 0 ? { always: true } : {}),
      keywords: keywordsFrom(heading, body),
    };
  });
}

function portfolioSections(sections) {
  return sections
    .filter((section) => PORTFOLIO_SECTION_IDS.includes(section.id))
    .map(({ always, ...rest }, index) => ({ ...rest, ...(index === 0 ? { always: true } : {}) }));
}

export async function buildAppKnowledge({ sectionsFr, sectionsEn, appsDir }) {
  const result = { portfolio: { fr: portfolioSections(sectionsFr), en: portfolioSections(sectionsEn) } };
  let files = [];
  try {
    files = await readdir(appsDir);
  } catch {
    files = [];
  }
  for (const file of files.sort()) {
    const match = file.match(/^([a-z]+)\.(fr|en)\.md$/);
    if (!match) continue;
    const [, app, lang] = match;
    result[app] ??= { fr: [], en: [] };
    result[app][lang] = splitAppSections(await readFile(path.join(appsDir, file), 'utf8'));
  }
  return result;
}
