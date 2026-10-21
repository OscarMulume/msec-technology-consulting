/**
 * En-têtes d'authentification Supabase.
 *
 * Les nouvelles clés `sb_publishable_...` ne doivent aller que dans `apikey`.
 * L'ancienne clé anon JWT (préfixe `eyJ`) est encore acceptée dans
 * `Authorization: Bearer ...` jusqu'à fin 2026.
 *
 * @param {string} key
 * @returns {Record<string, string>}
 */
export function supabaseAuthHeaders(key) {
  const headers = { apikey: key };

  if (key.startsWith('eyJ')) {
    headers.Authorization = `Bearer ${key}`;
  }

  return headers;
}
