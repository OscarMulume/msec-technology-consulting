export type LeadKind = 'audit' | 'contact' | 'pilot';
export type Locale = 'fr' | 'en';

export interface LeadPayload {
  kind: LeadKind;
  full_name: string;
  company?: string;
  email?: string;
  phone?: string;
  topic?: string;
  message?: string;
  locale: Locale;
  page: string;
}

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'network' | 'http'; status?: number };

export function supabaseConfig(): { url: string; key: string } | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('YOUR_PROJECT') || key.includes('YOUR_ANON_KEY')) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const config = supabaseConfig();
  if (!config) return { ok: false, reason: 'not-configured' };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${config.url}/rest/v1/site_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify([payload]),
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false, reason: 'http', status: response.status };
    return { ok: true };
  } catch {
    return { ok: false, reason: 'network' };
  } finally {
    clearTimeout(timeout);
  }
}

export function whatsappHref(number: string | undefined, text: string): string | null {
  if (!number) return null;
  const digits = number.replace(/[^\d]/g, '');
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

