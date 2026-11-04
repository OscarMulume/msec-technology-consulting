-- Migration : assistant IA du site M-SEC et du portfolio.
-- Idempotente (peut être rejouée). À appliquer par Oscar, projet Supabase pos-pro-msec.
-- Les trois objets ci-dessous ne sont accessibles que par la clé de service (Edge Function) :
-- aucune politique, aucun droit pour anon ni authenticated.

-- 1. Origine des demandes dans site_leads (formulaire du site ou assistant).
alter table public.site_leads add column if not exists source text not null default 'site-form';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'site_leads_source_check' and conrelid = 'public.site_leads'::regclass
  ) then
    alter table public.site_leads
      add constraint site_leads_source_check check (source in ('site-form', 'assistant'));
  end if;
end $$;

-- Un visiteur de l'assistant peut laisser un numéro WhatsApp au lieu d'un e-mail.
-- Les formulaires du site gardent leur règle : e-mail obligatoire (sauf pilote).
alter table public.site_leads drop constraint if exists site_leads_email_required;
alter table public.site_leads drop constraint if exists site_leads_contact_required;
alter table public.site_leads
  add constraint site_leads_contact_required check (
    kind = 'pilot'
    or email is not null
    or (source = 'assistant' and phone is not null)
  );

-- 2. Compteurs de limites (clé = hash salé, jamais l'adresse IP).
create table if not exists public.assistant_rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 0,
  primary key (key, window_start)
);

create index if not exists assistant_rate_limits_window_idx on public.assistant_rate_limits (window_start);

-- 3. Journal : question tronquée et expurgée, langue, date, réponse trouvée oui/non.
create table if not exists public.assistant_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lang text not null check (lang in ('fr', 'en')),
  question text not null check (char_length(question) <= 200),
  found boolean not null
);

create index if not exists assistant_logs_created_at_idx on public.assistant_logs (created_at desc);

alter table public.assistant_rate_limits enable row level security;
alter table public.assistant_rate_limits force row level security;
alter table public.assistant_logs enable row level security;
alter table public.assistant_logs force row level security;

revoke all on table public.assistant_rate_limits from anon, authenticated;
revoke all on table public.assistant_logs from anon, authenticated;

-- 4. Compteur atomique : limite par heure et par visiteur, plafond global par jour (UTC).
create or replace function public.assistant_hit(p_key text, p_hour_limit integer, p_day_limit integer)
returns table (allowed boolean, reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hour timestamptz := date_trunc('hour', now());
  v_day timestamptz := date_trunc('day', now() at time zone 'utc') at time zone 'utc';
  v_hits integer;
begin
  -- Nettoyage occasionnel des anciennes fenêtres.
  if random() < 0.02 then
    delete from public.assistant_rate_limits where window_start < now() - interval '3 days';
  end if;

  insert into public.assistant_rate_limits as r (key, window_start, hits)
  values (p_key, v_hour, 1)
  on conflict (key, window_start) do update set hits = r.hits + 1
  returning r.hits into v_hits;

  if v_hits > p_hour_limit then
    return query select false, 'hour'::text;
    return;
  end if;

  if p_day_limit is not null then
    insert into public.assistant_rate_limits as r (key, window_start, hits)
    values ('__day__', v_day, 1)
    on conflict (key, window_start) do update set hits = r.hits + 1
    returning r.hits into v_hits;

    if v_hits > p_day_limit then
      return query select false, 'day'::text;
      return;
    end if;
  end if;

  return query select true, null::text;
end;
$$;

revoke all on function public.assistant_hit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.assistant_hit(text, integer, integer) to service_role;
