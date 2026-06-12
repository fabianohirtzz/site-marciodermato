import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEditorHtml } from '../lib/clean-html.js';

test('normalizeEditorHtml tira classes ql-* e parágrafos vazios', () => {
  assert.equal(normalizeEditorHtml('<p class="ql-align-center">Oi</p><p><br></p>'), '<p>Oi</p>');
  assert.equal(normalizeEditorHtml('<p></p>'), '');
});
