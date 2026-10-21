-- Migration : demandes du site M-SEC
-- À appliquer manuellement par Oscar ou Claude (ne pas exécuter automatiquement).
-- Projet Supabase cible : msec-apps (schéma public pour cette table).

create extension if not exists pgcrypto;

create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('audit', 'contact', 'pilot')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  company text check (company is null or char_length(company) <= 160),
  email text check (
    email is null
    or (
      char_length(email) <= 254
      and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    )
  ),
  phone text check (phone is null or char_length(phone) <= 40),
  topic text check (topic is null or char_length(topic) <= 120),
  message text check (message is null or char_length(message) <= 4000),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  page text check (page is null or char_length(page) <= 300),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now(),
  constraint site_leads_email_required check (kind = 'pilot' or email is not null)
);

comment on table public.site_leads is 'Demandes issues des formulaires du site M-SEC (audit, contact, pilote).';

create index if not exists site_leads_created_at_idx on public.site_leads (created_at desc);

alter table public.site_leads enable row level security;
alter table public.site_leads force row level security;

-- Aucune lecture, mise à jour ou suppression publique.
drop policy if exists site_leads_insert_public on public.site_leads;
create policy site_leads_insert_public
  on public.site_leads
  for insert
  to anon
  with check (status = 'new');

-- Droits limités aux colonnes réellement saisies par le formulaire.
revoke all on table public.site_leads from anon, authenticated;
grant insert (kind, full_name, company, email, phone, topic, message, locale, page)
  on table public.site_leads to anon;
