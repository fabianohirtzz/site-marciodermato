import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPayload } from '../lib/post-payload.js';

const NOW = new Date('2026-07-29T15:00:00.000Z');

test('buildPayload achata o form e limpa o content', () => {
  const row = buildPayload({
    title: 'Novo Post', slug: 'novo-post',
    categoryName: 'Cuidados com a Pele', categoryColor: '#057f7f',
    content: '<p class="ql-align-center">Corpo</p><p><br></p>',
    excerpt: 'Resumo.', coverImage: 'https://img/capa.png',
    metaDescription: 'Meta.', seoTitle: 'SEO', ogImage: 'https://img/og.png',
    focusKeyword: 'pele', tags: ['pele'], intent: 'draft',
  }, NOW);
  assert.equal(row.category_name, 'Cuidados com a Pele');
  assert.equal(row.category_color, '#057f7f');
  assert.equal(row.content, '<p>Corpo</p>');
  assert.equal(row.status, 'draft');
  assert.equal('categoryName' in row, false);
  assert.equal('intent' in row, false);
  assert.equal('id' in row, false);
});

test('buildPayload usa defaults seguros', () => {
  const row = buildPayload({ title: 'X', slug: 'x' }, NOW);
  assert.equal(row.cover_image, '');
  assert.deepEqual(row.tags, []);
  assert.equal(row.status, 'draft');
});

test('buildPayload manda a data escolhida quando ela existe', () => {
  const row = buildPayload({ title: 'X', slug: 'x', intent: 'publish', date: '2026-01-10T09:00:00.000Z' }, NOW);
  assert.equal(row.date, '2026-01-10T09:00:00.000Z');
  assert.equal(row.status, 'published');
});

test('buildPayload omite a chave date quando não há data', () => {
  // Omitir preserva o default now() do Postgres no insert e a data já gravada
  // no update — mandar '' apagaria a data de um post antigo.
  const row = buildPayload({ title: 'X', slug: 'x', intent: 'publish' }, NOW);
  assert.equal('date' in row, false);
  assert.equal(row.status, 'published');
});

test('buildPayload agenda quando a data está no futuro', () => {
  const row = buildPayload({ title: 'X', slug: 'x', intent: 'publish', date: '2026-08-15T12:00:00.000Z' }, NOW);
  assert.equal(row.status, 'scheduled');
  assert.equal(row.date, '2026-08-15T12:00:00.000Z');
});
