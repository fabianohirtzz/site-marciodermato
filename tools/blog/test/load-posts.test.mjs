import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromSupabase, loadPosts } from '../lib/load-posts.mjs';

test('fromSupabase consulta mt_posts publicados e mapeia', async () => {
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push(url);
    return {
      ok: true,
      json: async () => ([{ id: 1, slug: 's', title: 'T', date: '2026-06-12T00:00:00+00:00',
        category_name: 'C', category_color: '#057f7f', tags: [], likes: 0 }]),
    };
  };
  const posts = await fromSupabase({ url: 'https://x.supabase.co', serviceKey: 'k', fetchImpl: fakeFetch });
  assert.match(calls[0], /\/rest\/v1\/mt_posts\?status=eq\.published&select=\*/);
  assert.equal(posts[0].slug, 's');
});

test('loadPosts cai para o seed JSON quando não há env', async () => {
  const seedUrl = new URL('../seed.json', import.meta.url);
  const posts = await loadPosts({ env: {}, jsonUrl: seedUrl });
  assert.ok(posts.length >= 2);
  assert.equal(posts[0].category.name, 'Cuidados com a Pele');
});
