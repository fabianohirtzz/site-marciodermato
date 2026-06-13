import { test } from 'node:test';
import assert from 'node:assert/strict';
import { metaState, serp } from '../lib/seo.js';

test('metaState classifica o comprimento da meta description', () => {
  assert.deepEqual(metaState(''), { count: 0, level: 'empty' });
  assert.equal(metaState('x'.repeat(140)).level, 'ok');
  assert.equal(metaState('x'.repeat(175)).level, 'over');
});

test('serp usa o domínio e o sufixo da marca', () => {
  const full = serp({ title: 'Proteção Solar', slug: 'protecao-solar',
    seoTitle: 'Proteção Solar · Dr. Márcio', metaDescription: 'Resumo SEO.' });
  assert.equal(full.title, 'Proteção Solar · Dr. Márcio');
  assert.equal(full.url, 'drmarcioteixeira.com.br › blog › protecao-solar');

  const fallback = serp({ title: 'Acne', slug: 'acne', excerpt: 'Texto.' });
  assert.equal(fallback.title, 'Acne · Dr. Márcio Teixeira');
  assert.equal(fallback.desc, 'Texto.');
});
