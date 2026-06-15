import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextView } from '../lib/auth-view.js';

test('nextView só troca de tela em transições reais', () => {
  // Primeira decisão a partir do estado neutro.
  assert.equal(nextView(null, true), 'app');
  assert.equal(nextView(null, false), 'login');

  // Eventos benignos (TOKEN_REFRESHED/SIGNED_IN ao focar a aba) não re-renderizam.
  assert.equal(nextView('app', true), null);
  assert.equal(nextView('login', false), null);

  // Transições reais entre logado e deslogado trocam de tela.
  assert.equal(nextView('app', false), 'login');
  assert.equal(nextView('login', true), 'app');
});
