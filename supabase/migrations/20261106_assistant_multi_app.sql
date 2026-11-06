-- Migration : assistant multi-applications (P1). Idempotente (peut être rejouée).
-- À appliquer sur le projet Supabase pos-pro-msec AVANT de déployer la fonction `assistant` multi-applications.

-- 1. Origine des demandes : formulaire du site, assistant (ancien) ou une des applications.
alter table public.site_leads drop constraint if exists site_leads_source_check;
alter table public.site_leads
  add constraint site_leads_source_check check (
    source in ('site-form', 'assistant', 'msec', 'portfolio', 'malaika', 'pos', 'herbo', 'monimmo')
  );

-- Un visiteur de l'assistant peut laisser un numéro WhatsApp au lieu d'un e-mail (toute source autre que le formulaire).
alter table public.site_leads drop constraint if exists site_leads_contact_required;
alter table public.site_leads
  add constraint site_leads_contact_required check (
    kind = 'pilot'
    or email is not null
    or (source <> 'site-form' and phone is not null)
  );

-- 2. Journal : application concernée.
alter table public.assistant_logs add column if not exists app text not null default 'msec';
