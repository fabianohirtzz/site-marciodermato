-- Blog Dr. Márcio — agendamento de posts. Projeto Supabase COMPARTILHADO com o
-- HD360, por isso o prefixo mt_. Aplicar uma vez no SQL Editor, depois de
-- schema-marcio.sql. Idempotente: pode rodar de novo sem estragar nada.

-- O check original foi criado inline na coluna, então o Postgres o nomeou
-- mt_posts_status_check. Trocar por um que também aceite 'scheduled'.
alter table public.mt_posts drop constraint if exists mt_posts_status_check;
alter table public.mt_posts add constraint mt_posts_status_check
  check (status in ('draft','published','scheduled'));

-- O cron do GitHub Actions consulta só agendados vencidos, de 30 em 30 minutos.
-- O índice parcial mantém essa consulta barata mesmo com o blog crescendo.
create index if not exists mt_posts_scheduled_idx
  on public.mt_posts (date) where status = 'scheduled';
