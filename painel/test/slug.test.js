import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../lib/slug.js';

test('slugify remove acentos e normaliza', () => {
  assert.equal(slugify('Proteção Solar Diária'), 'protecao-solar-diaria');
  assert.equal(slugify('  Olá, Mundo!  '), 'ola-mundo');
  assert.equal(slugify(''), '');
});
