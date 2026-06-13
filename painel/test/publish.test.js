import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publishUiState } from '../lib/publish.js';

test('publishUiState reflete dirty/publishing', () => {
  assert.deepEqual(publishUiState({ publishing: true }),
    { flagVisible: false, btnLabel: 'Publicando…', btnDisabled: true });
  assert.deepEqual(publishUiState({ dirty: true, publishing: false }),
    { flagVisible: true, btnLabel: 'Atualizar site', btnDisabled: false });
  assert.deepEqual(publishUiState({ dirty: false, publishing: false }),
    { flagVisible: false, btnLabel: 'Atualizar site', btnDisabled: false });
});
