import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderFilters, renderCards } from '../lib/render-index.mjs';

const posts = [
  { slug: 'a', title: 'A', excerpt: 'ex', dateLabel: '1 de junho de 2026',
    coverImage: 'https://x/a.jpg', category: { name: 'Pele', color: '#057f7f' } },
  { slug: 'b', title: 'B', excerpt: 'ex', dateLabel: '2 de junho de 2026',
    coverImage: '', category: { name: 'Cabelo', color: '#a87a4e' } },
];

test('renderFilters gera "Todos" + uma chip por categoria distinta', () => {
  const html = renderFilters(posts);
  assert.ok(html.includes('data-filter="all"'));
  assert.ok(html.includes('data-filter="Pele"'));
  assert.ok(html.includes('data-filter="Cabelo"'));
});

test('renderCards inclui slug, categoria e atributo de filtro', () => {
  const html = renderCards(posts);
  assert.ok(html.includes('href="blog/a/"'));
  assert.ok(html.includes('data-category="Pele"'));
  assert.ok(html.includes('<img')); // capa presente
  assert.ok(html.includes('blog-card__cover--empty')); // placeholder quando sem capa
});
