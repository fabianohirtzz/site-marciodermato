import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugsToPrune } from '../lib/prune-slugs.mjs';

test('devolve slugs que existiam antes e sumiram', () => {
  assert.deepEqual(slugsToPrune(['a', 'b', 'c'], ['a', 'c']), ['b']);
});

test('tolera entradas vazias', () => {
  assert.deepEqual(slugsToPrune(null, ['a']), []);
  assert.deepEqual(slugsToPrune(['a'], null), ['a']);
});
