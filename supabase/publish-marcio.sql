-- Blog Dr. Márcio — Fase 3: estado de publicação (projeto Supabase compartilhado, prefixo mt_).
-- Aplicar uma vez no SQL Editor.

create table if not exists public.mt_site_meta (
  id                 integer primary key default 1,
  dirty              boolean not null default true,
  publishing         boolean not null default false,
  -- Mantém viva a pendência de reconstrução quando um build falha depois de o
  -- cron já ter promovido agendados vencidos (ver supabase/scheduled-marcio.sql).
  pending_build      boolean not null default false,
  last_published_at  timestamptz,
  constraint mt_site_meta_single_row check (id = 1)
);

insert into public.mt_site_meta (id) values (1) on conflict (id) do nothing;

-- Qualquer escrita em mt_posts marca o site como "sujo".
create or replace function public.mt_mark_site_dirty()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.mt_site_meta set dirty = true where id = 1;
  return null;
end; $$;

drop trigger if exists mt_posts_mark_site_dirty on public.mt_posts;
create trigger mt_posts_mark_site_dirty
  after insert or update or delete on public.mt_posts
  for each statement execute function public.mt_mark_site_dirty();

-- RLS: o painel (admin autenticado) lê o estado. Escrita só via service key (função/workflow).
alter table public.mt_site_meta enable row level security;

drop policy if exists mt_site_meta_read on public.mt_site_meta;
create policy mt_site_meta_read on public.mt_site_meta
  for select to authenticated using (true);
