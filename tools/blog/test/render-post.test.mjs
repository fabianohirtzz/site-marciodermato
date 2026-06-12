import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPostPage } from '../lib/render-post.mjs';

const post = {
  slug: 'minha-pele', title: 'Cuidando da pele', dateLabel: '12 de junho de 2026',
  date: '2026-06-12T12:00:00', modified: '2026-06-12T12:00:00',
  category: { name: 'Cuidados com a Pele', color: '#057f7f' },
  coverImage: 'https://x/cover.jpg', excerpt: 'resumo',
  content: '<h2>Oi</h2><p>corpo do post com algumas palavras aqui</p>',
  metaDescription: 'meta', seoTitle: 'SEO title', ogImage: 'https://x/og.jpg',
  tags: ['pele'], likes: 3,
};

test('gera página com chrome de profundidade 2 e dados do post', () => {
  const html = renderPostPage(post, []);
  assert.ok(html.includes('<title>SEO title</title>'));
  assert.ok(html.includes('href="../../assets/css/main.css"'));   // assets em ../../
  assert.ok(html.includes('href="../../blog.html" aria-current="page"')); // nav Blog ativo
  assert.ok(html.includes('data-like="minha-pele"'));             // bloco de curtidas
  assert.ok(html.includes('"@type":"Article"'));                  // JSON-LD
  assert.ok(html.includes('min de leitura'));                     // tempo de leitura
});

test('mostra posts relacionados quando houver', () => {
  const rel = [{ slug: 'outro', title: 'Outro', dateLabel: 'x', coverImage: '',
    category: { name: 'Cuidados com a Pele', color: '#057f7f' } }];
  const html = renderPostPage(post, rel);
  assert.ok(html.includes('href="../outro/"'));
});
