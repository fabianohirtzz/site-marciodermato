/* build-sitemap.mjs — varre os HTMLs publicados e escreve sitemap.xml.
   Roda depois de build-treatments e build-blog, para que posts e tratamentos
   novos entrem no sitemap sem edição manual. */
import { readdirSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://marciodermato.com.br';

/* Páginas da raiz. index.html vira "/" — a URL canônica da home. */
const ROOT_PAGES = [
  ['index.html', '/', '1.0'],
  ['tratamentos.html', '/tratamentos.html', '0.9'],
  ['tricologia.html', '/tricologia.html', '0.9'],
  ['metodo-4d.html', '/metodo-4d.html', '0.8'],
  ['sobre.html', '/sobre.html', '0.7'],
  ['contato.html', '/contato.html', '0.7'],
  ['podcast.html', '/podcast.html', '0.6'],
  ['blog.html', '/blog.html', '0.6'],
];

/* Subpastas cujo index.html é uma página pública. */
const SECTIONS = [
  ['tratamentos', '0.8'],
  ['blog', '0.6'],
];

const iso = f => statSync(f).mtime.toISOString().slice(0, 10);

const urls = [];

for (const [file, path, priority] of ROOT_PAGES) {
  const abs = join(ROOT, file);
  if (existsSync(abs)) urls.push({ loc: SITE + path, lastmod: iso(abs), priority });
}

for (const [dir, priority] of SECTIONS) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) continue;
  for (const slug of readdirSync(abs)) {
    const page = join(abs, slug, 'index.html');
    if (!existsSync(page)) continue;
    urls.push({ loc: `${SITE}/${dir}/${slug}/`, lastmod: iso(page), priority });
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync(join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLs.`);
