-- Blog Dr. Márcio — políticas de Storage do bucket `marcio-blog-images`.
-- Projeto Supabase COMPARTILHADO com o HD360, por isso as policies são
-- escopadas por bucket_id e prefixadas com mt_ para não colidir.
--
-- POR QUE ISTO EXISTE: o bucket foi criado pelo Dashboard, mas com RLS
-- ligado e SEM nenhuma policy de INSERT em storage.objects, todo upload
-- do painel falhava com HTTP 400:
--   {"statusCode":"403","error":"Unauthorized",
--    "message":"new row violates row-level security policy"}
--
-- Aplicar uma vez no SQL Editor do projeto Supabase.

-- Leitura pública das imagens do blog (capa + imagens inline do post).
-- Redundante se o bucket estiver marcado como "Public", mas cobre o caso
-- de bucket privado lido via path autenticado.
drop policy if exists mt_blog_images_public_read on storage.objects;
create policy mt_blog_images_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'marcio-blog-images');

-- Escrita só para usuários autenticados (o admin logado no painel).
drop policy if exists mt_blog_images_admin_insert on storage.objects;
create policy mt_blog_images_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'marcio-blog-images');

drop policy if exists mt_blog_images_admin_update on storage.objects;
create policy mt_blog_images_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'marcio-blog-images')
  with check (bucket_id = 'marcio-blog-images');

drop policy if exists mt_blog_images_admin_delete on storage.objects;
create policy mt_blog_images_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'marcio-blog-images');
