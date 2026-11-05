// Logique de l'assistant M-SEC : sans dépendance, sans API propre à Deno, donc testable avec Node.
// (Syntaxe TypeScript « effaçable » uniquement : pas d'enum ni de propriété de paramètre.)

import { CONTACT_EMAIL, REFUSAL_PREFIX, TEXTS, systemPrompt } from './messages.ts';
import type { Lang } from './messages.ts';
import type { LeadRow, Store } from './store.ts';

export const LIMITS = {
  maxChars: 1500,
  maxTurns: 4,
  hourly: 20,
  daily: 500,
  leadHourly: 5,
  maxTokens: 350,
  knowledgeMaxTokens: 1500,
  retryAfterMaxMs: 8000,
  retryAfterDefaultMs: 1000,
  modelTimeoutMs: 20_000,
  maxBodyBytes: 40_000,
  maxReplyChars: 1500,
  logChars: 200,
} as const;

export const ALLOWED_ORIGIN = 'https://oscarmulume.github.io';

export interface Env {
  LLM_BASE_URL?: string;
  LLM_MODEL?: string;
  LLM_API_KEY?: string;
  ASSISTANT_SALT?: string;
  ASSISTANT_ALLOW_LOCALHOST?: string;
}

export interface KnowledgeSection {
  id: string;
  title: string;
  text: string;
  always?: boolean;
  keywords: string[];
}

export interface Deps {
  env: Env;
  fetch: typeof fetch;
  store: Store;
  knowledge: { fr: string; en: string };
  sections?: { fr: KnowledgeSection[]; en: KnowledgeSection[] };
  timeoutMs?: number;
  sleep?: (ms: number) => Promise<void>;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- Origine et CORS -------------------------------------------------------

export function isAllowedOrigin(origin: string | null, env: Env): boolean {
  if (!origin) return false;
  if (origin === ALLOWED_ORIGIN) return true;
  if (env.ASSISTANT_ALLOW_LOCALHOST === 'true') {
    return /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(origin);
  }
  return false;
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
  if (origin) Object.assign(headers, corsHeaders(origin));
  return new Response(JSON.stringify(body), { status, headers });
}

// --- Utilitaires -----------------------------------------------------------

function toLang(value: unknown): Lang {
  return value === 'en' ? 'en' : 'fr';
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('cf-connecting-ip') ?? 'unknown';
}

// --- Sélection des connaissances ------------------------------------------

// Estimation volontairement simple : ~4 caractères par jeton, sans dépendance.
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function normalizeWords(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function keywordHits(question: string, keywords: string[]): number {
  const padded = ` ${normalizeWords(question)} `;
  let hits = 0;
  for (const keyword of keywords) {
    const normalized = normalizeWords(keyword);
    if (normalized && padded.includes(` ${normalized} `)) hits += 1;
  }
  return hits;
}

export interface KnowledgeSelection {
  text: string;
  ids: string[];
  tokens: number;
}

// Identité/contact toujours envoyée + les 2 sections les plus pertinentes,
// dans la limite d'environ 1 500 jetons de connaissances par requête.
export function selectKnowledge(
  sections: KnowledgeSection[],
  question: string,
  options: { maxSections?: number; maxTokens?: number } = {},
): KnowledgeSelection {
  const maxSections = options.maxSections ?? 2;
  const maxTokens = options.maxTokens ?? LIMITS.knowledgeMaxTokens;
  const always = sections.filter((section) => section.always);
  const ranked = sections
    .filter((section) => !section.always)
    .map((section, index) => ({ section, index, score: keywordHits(question, section.keywords ?? []) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const chosen: KnowledgeSection[] = [];
  let tokens = estimateTokens(always.map((section) => section.text).join('\n\n'));
  for (const { section } of ranked) {
    if (chosen.length >= maxSections) break;
    const sectionTokens = estimateTokens(section.text);
    if (tokens + sectionTokens > maxTokens) continue;
    chosen.push(section);
    tokens += sectionTokens;
  }
  if (chosen.length === 0 && ranked.length > 0) chosen.push(ranked[0].section);

  const text = [...always, ...chosen].map((section) => section.text).join('\n\n');
  return {
    text,
    ids: [...always, ...chosen].map((section) => section.id),
    tokens: estimateTokens(text),
  };
}

// Détournement évident : on répond sans appeler le modèle (coût nul, réponse prévisible).
const FILLER = String.raw`((all|any|your|the|tes|vos|ton|toutes?|tous|les|des|previous|prior|above|pr[ée]c[ée]dentes?|pr[ée]c[ée]dents?)\s+){0,4}`;
const INJECTION_PATTERNS: RegExp[] = [
  new RegExp(String.raw`\b(ignor(e|ez|er)|oublie|oubliez|forget|disregard|override|bypass|contourne)\s+${FILLER}(instructions?|consignes?|r[èe]gles?|rules|guidelines|restrictions?)`, 'i'),
  /(system|developer)\s+prompt/i,
  /prompt\s+syst[èe]me/i,
  /\b(reveal|show|print|repeat|leak|tell me|affiche|montre|r[ée]v[èe]le|r[ée]p[èe]te|donne)\b.{0,40}\b(instructions?|prompt|consignes?|r[èe]gles?)/i,
  /\b(give|show|send|reveal|leak|tell me|print|donne|montre|affiche|r[ée]v[èe]le|envoie|share|partage|dis-moi)\b.{0,40}\b(api[ -]?key|cl[ée]\s*(d['’]?\s*)?api|secret|token|jeton|mot de passe|password|service[ _-]?role)/i,
  /\b(jailbreak|dan mode|developer mode|mode d[ée]veloppeur)\b/i,
  /(you are now|tu es maintenant|from now on you|d[ée]sormais tu)\b/i,
  /(sudo\s|rm -rf|<script)/i,
];

export function looksLikeInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

const PHONE_PATTERN = /\+?\s*243[\s.-]*\(?0?\)?[\s.-]*9\s*7\s*5[\s.-]*5\s*8\s*5[\s.-]*1\s*5\s*0|\b0?975[\s.-]?585[\s.-]?150\b/g;
const SECRET_PATTERN = /(nvapi-[A-Za-z0-9_-]{10,}|sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{20,}|eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,})/;

export function sanitizeReply(reply: string, lang: Lang): string | null {
  if (SECRET_PATTERN.test(reply)) return null;
  const trimmed = reply.trim().slice(0, LIMITS.maxReplyChars);
  return trimmed.replace(PHONE_PATTERN, TEXTS[lang].phoneScrubbed);
}

function isRefusal(reply: string, lang: Lang): boolean {
  const normalized = reply.replace(/[’‘]/g, "'").trimStart().toLowerCase();
  return normalized.startsWith(REFUSAL_PREFIX[lang].toLowerCase());
}

// Journal : jamais d'e-mail, de numéro ni d'IP ; question tronquée.
export function redactForLog(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[e-mail]')
    .replace(/\+?\d[\d\s().-]{6,}\d/g, '[numéro]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, LIMITS.logChars);
}

function normalizeMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (typeof content !== 'string') return null;
    // Un client ne peut jamais injecter un message « system » : tout autre rôle est écarté.
    if (role !== 'user' && role !== 'assistant') continue;
    messages.push({ role, content: content.slice(0, LIMITS.maxChars) });
  }
  return messages.slice(-LIMITS.maxTurns * 2);
}

// --- Modèle ----------------------------------------------------------------

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// retry-after peut être un nombre de secondes ou une date HTTP ; plafond 8 s.
export function retryAfterMs(value: string | null): number {
  if (!value) return LIMITS.retryAfterDefaultMs;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.min(Math.max(seconds * 1000, 0), LIMITS.retryAfterMaxMs);
  const date = Date.parse(value);
  if (!Number.isNaN(date)) return Math.min(Math.max(date - Date.now(), 0), LIMITS.retryAfterMaxMs);
  return LIMITS.retryAfterDefaultMs;
}

async function requestModel(
  deps: Deps,
  lang: Lang,
  history: ChatMessage[],
  knowledge: string,
): Promise<Response | null> {
  const { env } = deps;
  if (!env.LLM_BASE_URL || !env.LLM_MODEL || !env.LLM_API_KEY) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), deps.timeoutMs ?? LIMITS.modelTimeoutMs);
  try {
    return await deps.fetch(`${env.LLM_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.LLM_API_KEY}` },
      body: JSON.stringify({
        model: env.LLM_MODEL,
        messages: [{ role: 'system', content: systemPrompt(lang, knowledge) }, ...history],
        max_tokens: LIMITS.maxTokens,
        temperature: 0.2,
        stream: false,
      }),
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function askModel(
  deps: Deps,
  lang: Lang,
  history: ChatMessage[],
  knowledge: string,
): Promise<string | null> {
  const { env } = deps;
  if (!env.LLM_BASE_URL || !env.LLM_MODEL || !env.LLM_API_KEY) return null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await requestModel(deps, lang, history, knowledge);
    if (response === null) return null;
    if (response.status === 429 && attempt === 0) {
      const wait = retryAfterMs(response.headers.get('retry-after'));
      await (deps.sleep ?? defaultSleep)(wait);
      continue;
    }
    if (!response.ok) return null;
    try {
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      return typeof content === 'string' && content.trim() !== '' ? content : null;
    } catch {
      return null;
    }
  }
  return null;
}

// --- Actions ---------------------------------------------------------------

async function safeLog(deps: Deps, lang: Lang, question: string, found: boolean): Promise<void> {
  try {
    await deps.store.log({ lang, question: redactForLog(question), found });
  } catch {
    // Le journal ne doit jamais empêcher de répondre.
  }
}

async function chat(deps: Deps, body: Record<string, unknown>, lang: Lang, hash: string, origin: string): Promise<Response> {
  const messages = normalizeMessages(body.messages);
  const last = messages?.[messages.length - 1];
  if (!messages || !last || last.role !== 'user') return json({ error: 'bad_request', message: TEXTS[lang].badRequest }, 400, origin);
  if (typeof (body.messages as unknown[]).at(-1) === 'object') {
    const rawLast = (body.messages as { content?: unknown }[]).at(-1)?.content;
    if (typeof rawLast === 'string' && rawLast.length > LIMITS.maxChars) {
      return json({ error: 'too_long', message: TEXTS[lang].tooLong }, 400, origin);
    }
  }
  if (last.content.trim() === '') return json({ error: 'empty', message: TEXTS[lang].empty }, 400, origin);

  let hit;
  try {
    hit = await deps.store.hit(`chat:${hash}`, LIMITS.hourly, LIMITS.daily);
  } catch {
    // Impossible de vérifier les limites : on refuse plutôt que de risquer un coût illimité.
    return json({ error: 'unavailable', message: TEXTS[lang].unavailable }, 503, origin);
  }
  if (!hit.allowed) {
    const message = hit.reason === 'day' ? TEXTS[lang].dayLimit : TEXTS[lang].hourLimit;
    return json({ error: 'rate_limited', reason: hit.reason ?? 'hour', message }, 429, origin);
  }

  if (looksLikeInjection(last.content)) {
    await safeLog(deps, lang, last.content, false);
    return json({ reply: TEXTS[lang].deflect, found: false }, 200, origin);
  }

  const sections = deps.sections?.[lang];
  const knowledge = sections && sections.length > 0
    ? selectKnowledge(sections, last.content).text
    : deps.knowledge[lang];
  const raw = await askModel(deps, lang, messages, knowledge);
  const reply = raw === null ? null : sanitizeReply(raw, lang);
  if (reply === null || reply === '') {
    await safeLog(deps, lang, last.content, false);
    return json({ reply: TEXTS[lang].fallback, found: false, fallback: true }, 200, origin);
  }

  const found = !isRefusal(reply, lang);
  await safeLog(deps, lang, last.content, found);
  return json({ reply, found }, 200, origin);
}

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

function parseContact(value: string): { email: string | null; phone: string | null } | null {
  const text = value.trim();
  if (text.length > 254) return null;
  if (EMAIL_PATTERN.test(text)) return { email: text, phone: null };
  if (/^\+?[\d\s().-]+$/.test(text)) {
    const digits = text.replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15 && text.length <= 40) return { email: null, phone: text };
  }
  return null;
}

async function lead(deps: Deps, body: Record<string, unknown>, lang: Lang, hash: string, origin: string): Promise<Response> {
  const input = (body.lead ?? {}) as Record<string, unknown>;
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const contactRaw = typeof input.contact === 'string' ? input.contact : '';
  const need = typeof input.need === 'string' ? input.need.trim() : '';
  const contact = parseContact(contactRaw);

  if (name.length < 2 || name.length > 120 || !contact || need.length < 3 || need.length > 1500) {
    return json({ error: 'invalid', message: TEXTS[lang].leadInvalid }, 400, origin);
  }

  try {
    const hit = await deps.store.hit(`lead:${hash}`, LIMITS.leadHourly, null);
    if (!hit.allowed) return json({ error: 'rate_limited', message: TEXTS[lang].leadLimit }, 429, origin);
  } catch {
    return json({ error: 'unavailable', message: TEXTS[lang].unavailable }, 503, origin);
  }

  const page = typeof input.page === 'string' && input.page.startsWith(ALLOWED_ORIGIN) ? input.page.slice(0, 300) : null;
  const row: LeadRow = {
    kind: 'contact',
    source: 'assistant',
    full_name: name,
    email: contact.email,
    phone: contact.phone,
    topic: 'assistant',
    message: need,
    locale: lang,
    page,
  };

  let saved = false;
  try {
    saved = await deps.store.insertLead(row);
  } catch {
    saved = false;
  }
  // Jamais « enregistré » si l'insertion a échoué.
  if (!saved) return json({ error: 'lead_failed', message: TEXTS[lang].leadFailed }, 502, origin);
  return json({ ok: true }, 200, origin);
}

// --- Point d'entrée --------------------------------------------------------

export async function handle(request: Request, deps: Deps): Promise<Response> {
  const origin = request.headers.get('origin');
  if (!isAllowedOrigin(origin, deps.env)) {
    return json({ error: 'forbidden_origin' }, 403, null);
  }
  const allowed = origin as string;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(allowed) });
  }
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, allowed);

  if (!deps.env.ASSISTANT_SALT) {
    // Pas de sel = on ne sait pas anonymiser les visiteurs : on ne fonctionne pas.
    return json({ error: 'misconfigured', message: TEXTS.fr.unavailable }, 500, allowed);
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > LIMITS.maxBodyBytes) {
    return json({ error: 'too_large', message: TEXTS.fr.tooLong }, 413, allowed);
  }

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('forme');
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'bad_request', message: TEXTS.fr.badRequest }, 400, allowed);
  }

  const lang = toLang(body.lang);
  const hash = (await sha256Hex(`${deps.env.ASSISTANT_SALT}:${clientIp(request)}`)).slice(0, 32);
  const action = body.action === 'lead' ? 'lead' : 'chat';

  return action === 'lead' ? lead(deps, body, lang, hash, allowed) : chat(deps, body, lang, hash, allowed);
}

export { CONTACT_EMAIL };
