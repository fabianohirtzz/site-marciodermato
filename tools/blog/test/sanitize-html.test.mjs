import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeContent } from '../lib/sanitize-html.mjs';

test('remove scripts e desembrulha divs', () => {
  const out = sanitizeContent('<div><p>oi</p><script>alert(1)</script></div>');
  assert.equal(out, '<p>oi</p>');
});

test('rebaixa h1 para h2', () => {
  assert.equal(sanitizeContent('<h1>T</h1>'), '<h2>T</h2>');
});

test('mantém a URL absoluta da imagem', () => {
  const html = '<img src="https://x.supabase.co/storage/v1/object/public/marcio-blog-images/posts/a.jpg" alt="capa">';
  const out = sanitizeContent(html);
  assert.ok(out.includes('src="https://x.supabase.co/storage/v1/object/public/marcio-blog-images/posts/a.jpg"'));
  assert.ok(out.includes('alt="capa"'));
});

test('remove parágrafos vazios', () => {
  assert.equal(sanitizeContent('<p>&nbsp;</p><p>ok</p>'), '<p>ok</p>');
});
