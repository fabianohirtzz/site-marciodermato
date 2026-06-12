import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapSupabaseRow } from '../lib/supabase-map.mjs';

test('mapeia linha mt_posts para o modelo interno', () => {
  const row = {
    id: 1, slug: 'minha-pele', title: 'Cuidando da pele',
    date: '2026-06-12T12:00:00+00:00', modified: null,
    category_name: 'Cuidados com a Pele', category_color: '#057f7f',
    cover_image: 'https://x.supabase.co/cover.jpg', excerpt: 'resumo',
    content: '<p>oi</p>', meta_description: 'meta', seo_title: 'seo',
    og_image: '', focus_keyword: 'pele', tags: ['pele'], likes: 3,
  };
  const post = mapSupabaseRow(row);
  assert.equal(post.slug, 'minha-pele');
  assert.equal(post.category.name, 'Cuidados com a Pele');
  assert.equal(post.category.color, '#057f7f');
  assert.equal(post.coverImage, 'https://x.supabase.co/cover.jpg');
  assert.equal(post.dateLabel, '12 de junho de 2026');
  assert.equal(post.likes, 3);
  assert.equal(post.modified, post.date); // modified nulo cai para date
});
