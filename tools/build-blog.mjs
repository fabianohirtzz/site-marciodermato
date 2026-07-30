/* build-blog.mjs — gera blog.html (filtros + grade) e blog/<slug>/index.html
   a partir dos posts publicados em mt_posts (Supabase) ou do seed local.
   Uso:
     node tools/build-blog.mjs            # usa seed (offline)
     SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node tools/build-blog.mjs
   Plain Node (ESM), sem dependências. */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { loadPosts } from './blog/lib/load-posts.mjs';
import { renderFilters, renderCards } from './blog/lib/render-index.mjs';
import { renderPostPage } from './blog/lib/render-post.mjs';
import { slugsToPrune } from './blog/lib/prune-slugs.mjs';

const ROOT = new URL('../', import.meta.url);

function relatedFor(post, all) {
  const same = all.filter(p => p.slug !== post.slug && p.category.name === post.category.name);
  if (same.length >= 3) return same.slice(0, 3);
  const fill = all.filter(p => p.slug !== post.slug && !same.includes(p));
  return [...same, ...fill].slice(0, 3);
}

// Lista única de categorias (1ª cor encontrada) para o widget da sidebar.
function categoriesOf(all) {
  const seen = new Map();
  for (const p of all) {
    const name = p.category?.name;
    if (name && !seen.has(name)) seen.set(name, { name, color: p.category.color || '#057f7f' });
  }
  return [...seen.values()];
}

async function injectBetween(path, startMarker, endMarker, inner) {
  let html = await readFile(path, 'utf8');
  const re = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`);
  html = html.replace(re, `${startMarker}\n          ${inner}\n          ${endMarker}`);
  await writeFile(path, html);
}

async function main() {
  const posts = await loadPosts({ jsonUrl: new URL('tools/blog/seed.json', ROOT) });
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 1. blog.html: injetar filtros + grade.
  const blogPath = new URL('blog.html', ROOT);
  await injectBetween(blogPath, '<!-- FILTERS:START -->', '<!-- FILTERS:END -->', renderFilters(posts));
  await injectBetween(blogPath, '<!-- POSTS:START -->', '<!-- POSTS:END -->', renderCards(posts));
  console.log('blog.html:', posts.length, 'posts,', new Set(posts.map(p => p.category.name)).size, 'categorias.');

  // 2. Páginas de artigo.
  const categories = categoriesOf(posts);
  const podcast = JSON.parse(await readFile(new URL('tools/podcast/podcast.json', ROOT), 'utf8'));
  for (const post of posts) {
    const html = renderPostPage(post, relatedFor(post, posts), { categories, recent: posts, podcast });
    await mkdir(new URL(`blog/${post.slug}/`, ROOT), { recursive: true });
    await writeFile(new URL(`blog/${post.slug}/index.html`, ROOT), html);
    console.log('  ok blog/' + post.slug + '/index.html');
  }

  // 3. Prune de slugs removidos.
  const manifestUrl = new URL('tools/blog/generated-slugs.json', ROOT);
  const newSlugs = posts.map(p => p.slug);
  let oldSlugs = [];
  try { oldSlugs = JSON.parse(await readFile(manifestUrl, 'utf8')); } catch { /* 1º build */ }
  for (const slug of slugsToPrune(oldSlugs, newSlugs)) {
    await rm(new URL(`blog/${slug}/`, ROOT), { recursive: true, force: true });
    console.log('  removido blog/' + slug + '/');
  }
  await writeFile(manifestUrl, JSON.stringify(newSlugs, null, 2) + '\n');

  console.log('Pronto.');
}

main().catch(e => { console.error(e); process.exit(1); });
