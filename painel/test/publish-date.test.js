import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toLocalInputValue, fromLocalInputValue, resolveStatus } from '../lib/publish-date.js';

test('toLocalInputValue e fromLocalInputValue fecham o ciclo sem perder o instante', () => {
  // Vale em qualquer fuso: todos os offsets do mundo são múltiplos de 1 minuto,
  // então só os segundos se perdem — e o ISO de entrada não tem segundos.
  const iso = '2026-03-12T12:00:00.000Z';
  const local = toLocalInputValue(iso);
  assert.match(local, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  assert.equal(fromLocalInputValue(local), iso);
});

test('toLocalInputValue cai no agora quando não recebe data usável', () => {
  const agora = toLocalInputValue();
  assert.match(agora, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  assert.match(toLocalInputValue('não é data'), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
});

test('fromLocalInputValue devolve vazio para entrada inútil', () => {
  assert.equal(fromLocalInputValue(''), '');
  assert.equal(fromLocalInputValue('não é data'), '');
});

test('resolveStatus agenda só quando a data está no futuro', () => {
  const now = new Date('2026-07-29T15:00:00.000Z');
  assert.equal(resolveStatus('publish', '2026-07-30T09:00:00.000Z', now), 'scheduled');
  assert.equal(resolveStatus('publish', '2026-01-10T09:00:00.000Z', now), 'published');
  // O instante exato conta como agora, não como futuro: publica na hora.
  assert.equal(resolveStatus('publish', '2026-07-29T15:00:00.000Z', now), 'published');
  // Sem data ou com data quebrada, publicar significa publicar agora.
  assert.equal(resolveStatus('publish', '', now), 'published');
  assert.equal(resolveStatus('publish', 'não é data', now), 'published');
});

test('resolveStatus nunca publica quando a intenção é rascunho', () => {
  const now = new Date('2026-07-29T15:00:00.000Z');
  assert.equal(resolveStatus('draft', '2026-07-30T09:00:00.000Z', now), 'draft');
  assert.equal(resolveStatus('draft', '2026-01-10T09:00:00.000Z', now), 'draft');
  // Intenção desconhecida cai no lado seguro.
  assert.equal(resolveStatus(undefined, '2026-01-10T09:00:00.000Z', now), 'draft');
});
