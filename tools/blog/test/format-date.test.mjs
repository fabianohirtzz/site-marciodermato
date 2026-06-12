import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDatePtBr } from '../lib/format-date.mjs';

test('formata data ISO em pt-BR por extenso (UTC)', () => {
  assert.equal(formatDatePtBr('2026-06-12T15:00:00Z'), '12 de junho de 2026');
});

test('usa UTC, não o fuso local', () => {
  assert.equal(formatDatePtBr('2026-01-01T01:00:00Z'), '1 de janeiro de 2026');
});
