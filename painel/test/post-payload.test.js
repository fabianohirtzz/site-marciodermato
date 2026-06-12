import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPayload } from '../lib/post-payload.js';

test('buildPayload achata o form e limpa o content', () => {
  const row = buildPayload({
    title: 'Novo Post', slug: 'novo-post',
    categoryName: 'Cuidados com a Pele', categoryColor: '#057f7f',
    content: '<p class="ql-align-center">Corpo</p><p><br></p>',
    excerpt: 'Resumo.', coverImage: 'https://img/capa.png',
    metaDescription: 'Meta.', seoTitle: 'SEO', ogImage: 'https://img/og.png',
    focusKeyword: 'pele', tags: ['pele'], status: 'draft',
  });
  assert.equal(row.category_name, 'Cuidados com a Pele');
  assert.equal(row.category_color, '#057f7f');
  assert.equal(row.content, '<p>Corpo</p>');
  assert.equal(row.status, 'draft');
  assert.equal('categoryName' in row, false);
  assert.equal('id' in row, false);
});

test('buildPayload usa defaults seguros', () => {
  const row = buildPayload({ title: 'X', slug: 'x' });
  assert.equal(row.cover_image, '');
  assert.deepEqual(row.tags, []);
  assert.equal(row.status, 'draft');
});
