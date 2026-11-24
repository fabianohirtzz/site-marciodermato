/* Seção "Artigos do blog" da home: os 3 posts mais recentes, injetados pelo
   tools/build-blog.mjs entre <!-- HOME-BLOG:START --> e <!-- HOME-BLOG:END -->. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { injectBetween } from '../lib/inject.mjs';
import { renderHomeCards } from '../blog/lib/render-index.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const START = '<!-- HOME-BLOG:START -->';
const END = '<!-- HOME-BLOG:END -->';

const post = (slug, date) => ({
  slug,
  title: `Título ${slug}`,
  excerpt: `Resumo ${slug}`,
  date,
  dateLabel: date,
  coverImage: `https://x/${slug}.jpg`,
  category: { name: 'Tricologia', color: '#345050' },
});
const posts = [
  post('d', '2026-11-23'),
  post('c', '2026-11-20'),
  post('b', '2026-11-19'),
  post('a', '2026-11-01'),
];

test('renderHomeCards traz só os 3 primeiros, com capa, categoria, título e data', () => {
  const html = renderHomeCards(posts);
  assert.equal((html.match(/<article class="blog-card/g) || []).length, 3);
  for (const s of ['d', 'c', 'b']) assert.ok(html.includes(`href="blog/${s}/"`), `falta ${s}`);
  assert.ok(!html.includes('href="blog/a/"'), 'o 4º post não entra na home');
  assert.ok(html.includes('<img src="https://x/d.jpg"'));
  assert.ok(html.includes('blog-card__tag'));
  assert.ok(html.includes('2026-11-23'));
  assert.ok(!html.includes('blog-card__excerpt'), 'na home o card vai sem resumo');
});

test('injectBetween troca só o miolo e é idempotente', () => {
  const pagina = `<div>\n  ${START}\n  velho\n  ${END}\n</div>`;
  const uma = injectBetween(pagina, START, END, 'NOVO');
  assert.ok(uma.includes('NOVO'));
  assert.ok(!uma.includes('velho'));
  assert.ok(uma.startsWith('<div>') && uma.endsWith('</div>'));
  assert.equal(injectBetween(uma, START, END, 'NOVO'), uma);
});

test('injectBetween falha alto quando o marcador sumiu ou está duplicado', () => {
  assert.throws(() => injectBetween('<p>sem marcador</p>', START, END, 'x'), /não encontrados/);
  const dobrado = `${START}${END}${START}${END}`;
  assert.throws(() => injectBetween(dobrado, START, END, 'x'), /mais de uma vez/);
});

test('index.html tem os marcadores da seção do blog e o link para blog.html', () => {
  const home = readFileSync(join(ROOT, 'index.html'), 'utf8');
  assert.equal(home.split(START).length - 1, 1);
  assert.equal(home.split(END).length - 1, 1);
  assert.ok(home.indexOf(START) < home.indexOf(END));
  assert.match(home, /<a class="btn[^"]*" href="blog\.html">Ver todos os artigos<\/a>/);
});

test('a home nunca publica os posts placeholder do seed', () => {
  const home = readFileSync(join(ROOT, 'index.html'), 'utf8');
  const seed = JSON.parse(readFileSync(join(ROOT, 'tools', 'blog', 'seed.json'), 'utf8'));
  const miolo = home.slice(home.indexOf(START), home.indexOf(END));
  for (const row of seed) {
    assert.ok(!miolo.includes(`blog/${row.slug}/`), `post do seed na home: ${row.slug}`);
  }
});
