/* Contratos de tracking.mjs — a fonte única das tags e do CTA.
   Se algum destes quebrar, páginas geradas e escritas à mão divergem. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { FORM_ID, CTA_HREF, CTA_ATTRS, TRACKING_FOOT } from '../lib/tracking.mjs';

test('FORM_ID é o formulário novo', () => {
  assert.equal(FORM_ID, 'PGW6nIOmTX');
});

test('CTA_HREF aponta para o formulário do FORM_ID', () => {
  assert.equal(
    CTA_HREF,
    'https://meutrack-ingest.carlosabsj-ti.workers.dev/f/PGW6nIOmTX'
  );
});

test('CTA_ATTRS abre o popup e mantém o href de fallback', () => {
  assert.match(CTA_ATTRS, /data-th-quiz="PGW6nIOmTX"/);
  assert.match(CTA_ATTRS, /href="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\/PGW6nIOmTX"/);
  assert.match(CTA_ATTRS, /target="_blank"/);
  assert.match(CTA_ATTRS, /rel="noopener"/);
});

test('CTA_ATTRS põe data-th-quiz antes do href', () => {
  assert.ok(
    CTA_ATTRS.indexOf('data-th-quiz') < CTA_ATTRS.indexOf('href='),
    'a ordem dos atributos precisa bater com a das páginas migradas'
  );
});

test('TRACKING_FOOT carrega o embed.js sem data-form', () => {
  assert.match(TRACKING_FOOT, /src="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/embed\.js"/);
  assert.ok(!TRACKING_FOOT.includes('data-form'), 'modo modal não usa data-form');
  assert.match(TRACKING_FOOT, /async/);
});
