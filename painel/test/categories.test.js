import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dedupeCategories } from '../lib/categories.js';

test('dedupeCategories devolve nome→cor distintos (primeira ocorrência)', () => {
  const rows = [
    { category_name: 'Pele', category_color: '#057f7f' },
    { category_name: 'Pele', category_color: '#000000' },
    { category_name: 'Cabelo', category_color: '#a87a4e' },
    { category_name: '', category_color: '#fff' },
  ];
  assert.deepEqual(dedupeCategories(rows), [
    { name: 'Pele', color: '#057f7f' },
    { name: 'Cabelo', color: '#a87a4e' },
  ]);
});

test('dedupeCategories tolera vazio', () => {
  assert.deepEqual(dedupeCategories(null), []);
});
