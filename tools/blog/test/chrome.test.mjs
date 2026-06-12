import { test } from 'node:test';
import assert from 'node:assert/strict';
import { navHTML, footerHTML } from '../lib/chrome.mjs';

test('nav usa o prefixo base e marca a página atual', () => {
  const root = navHTML('', 'blog');
  assert.ok(root.includes('href="index.html"'));
  assert.ok(root.includes('href="blog.html" aria-current="page"'));
  const post = navHTML('../../', 'blog');
  assert.ok(post.includes('href="../../index.html"'));
  assert.ok(post.includes('href="../../blog.html" aria-current="page"'));
});

test('footer inclui o link Blog e o WhatsApp flutuante', () => {
  const f = footerHTML('');
  assert.ok(f.includes('href="blog.html"'));
  assert.ok(f.includes('class="wpp"'));
});
