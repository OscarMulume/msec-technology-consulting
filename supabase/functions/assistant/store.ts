// Accès à la base Supabase par l'API REST (clé de service, jamais exposée au navigateur).
// Aucune dépendance : un simple fetch, donc testable sans Deno.

export interface HitResult {
  allowed: boolean;
  reason?: 'hour' | 'day';
}

export interface LogEntry {
  lang: 'fr' | 'en';
  question: string;
  found: boolean;
}

export interface LeadRow {
  kind: 'contact';
  source: 'assistant';
  full_name: string;
  email: string | null;
  phone: string | null;
  topic: string;
  message: string;
  locale: 'fr' | 'en';
  page: string | null;
}

export interface Store {
  hit(key: string, hourLimit: number, dayLimit: number | null): Promise<HitResult>;
  log(entry: LogEntry): Promise<void>;
  insertLead(row: LeadRow): Promise<boolean>;
}

export function createRestStore(supabaseUrl: string, serviceKey: string, fetchImpl: typeof fetch = fetch): Store {
  const base = supabaseUrl.replace(/\/$/, '');
  const headers = {
    'Content-Type': 'application/json',
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  return {
    async hit(key, hourLimit, dayLimit) {
      const response = await fetchImpl(`${base}/rest/v1/rpc/assistant_hit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ p_key: key, p_hour_limit: hourLimit, p_day_limit: dayLimit }),
      });
      if (!response.ok) throw new Error(`assistant_hit ${response.status}`);
      const data = await response.json();
      const row = Array.isArray(data) ? data[0] : data;
      if (!row || typeof row.allowed !== 'boolean') throw new Error('assistant_hit: réponse inattendue');
      return { allowed: row.allowed, reason: row.reason ?? undefined };
    },
    async log(entry) {
      const response = await fetchImpl(`${base}/rest/v1/assistant_logs`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify(entry),
      });
      if (!response.ok) throw new Error(`assistant_logs ${response.status}`);
    },
    async insertLead(row) {
      const response = await fetchImpl(`${base}/rest/v1/site_leads`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'return=minimal' },
        body: JSON.stringify(row),
      });
      return response.ok;
    },
  };
}
