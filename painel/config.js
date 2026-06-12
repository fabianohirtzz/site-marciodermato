// Configuração pública do painel do Dr. Márcio. A anon key é segura por design
// (RLS no banco). Projeto Supabase COMPARTILHADO com o HD360 — por isso os nomes
// prefixados com mt_ / marcio- para isolar.
export const SUPABASE_URL = 'https://euzmbswywwhmicjlszqw.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1em1ic3d5d3dobWljamxzenF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDEyODYsImV4cCI6MjA5NjAxNzI4Nn0.oSIv6fSKVxO9Umuii6xt98cT0yoSqepTIzVCdcocfuU';

export const POSTS_TABLE = 'mt_posts';
export const SITE_META_TABLE = 'mt_site_meta';
export const STORAGE_BUCKET = 'marcio-blog-images';
export const PUBLISH_FN = 'publish-marcio';

// Cor padrão sugerida ao criar uma categoria nova (teal da marca).
export const DEFAULT_CATEGORY_COLOR = '#057f7f';
