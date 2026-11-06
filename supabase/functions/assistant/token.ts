// Jeton court de connexion pour les applications qui exigent un utilisateur connecté (profil `pos`).
// Format : "<expiration en secondes>.<HMAC-SHA256 hexadécimal de 'assistant:<app>:<expiration>'>".
// Le jeton ne contient AUCUNE donnée personnelle : il prouve seulement qu'un serveur d'application
// qui connaît le secret partagé (ASSISTANT_POS_SECRET) a authentifié l'utilisateur il y a peu.
// Syntaxe TypeScript « effaçable » uniquement (testable avec Node).

export const TOKEN_MAX_AGE_SECONDS = 15 * 60;

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function sameText(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signAppToken(secret: string, app: string, nowSeconds: number, maxAge = TOKEN_MAX_AGE_SECONDS): Promise<string> {
  const expires = nowSeconds + maxAge;
  return `${expires}.${await hmacHex(secret, `assistant:${app}:${expires}`)}`;
}

export async function verifyAppToken(secret: string | undefined, app: string, token: string | null, nowSeconds: number): Promise<boolean> {
  if (!secret || !token) return false;
  const match = /^(\d{9,12})\.([0-9a-f]{64})$/.exec(token);
  if (!match) return false;
  const expires = Number(match[1]);
  if (expires < nowSeconds || expires > nowSeconds + TOKEN_MAX_AGE_SECONDS + 60) return false;
  return sameText(await hmacHex(secret, `assistant:${app}:${expires}`), match[2]);
}
