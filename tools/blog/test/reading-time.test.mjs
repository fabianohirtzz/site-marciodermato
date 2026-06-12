import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingTime } from '../lib/reading-time.mjs';

test('estima 1 min para textos curtos', () => {
  assert.equal(readingTime('<p>Olá mundo</p>'), 1);
});

test('ignora tags HTML ao contar palavras', () => {
  const words = Array.from({ length: 400 }, () => 'palavra').join(' ');
  assert.equal(readingTime(`<p>${words}</p>`), 2);
});
