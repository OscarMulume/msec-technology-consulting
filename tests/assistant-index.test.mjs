import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Régression (06/11/2026) : core.ts vérifie ASSISTANT_POS_SECRET, mais index.ts
// ne le lisait pas dans l'environnement ; le profil `pos` répondait donc 401
// à tout jeton valide. Ce test garde le câblage des secrets dans le point d'entrée.
const source = await readFile(new URL('../supabase/functions/assistant/index.ts', import.meta.url), 'utf8');

const secrets = ['LLM_BASE_URL', 'LLM_MODEL', 'LLM_API_KEY', 'ASSISTANT_SALT', 'ASSISTANT_POS_SECRET'];

for (const name of secrets) {
  test(`index.ts transmet ${name} à core.ts`, () => {
    const pattern = new RegExp(`${name}:\\s*Deno\\.env\\.get\\('${name}'\\)`);
    assert.match(source, pattern);
  });
}
