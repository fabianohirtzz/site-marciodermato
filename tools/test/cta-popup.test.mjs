/* Invariantes dos CTAs em popup.
   As páginas de tratamento e do blog são geradas; sem esta guarda, um
   rebuild com o gerador desatualizado devolve o site ao redirect. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORM_ID } from '../lib/tracking.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const IGNORAR = new Set(['node_modules', 'painel', '.git', 'docs']);

function paginas(dir = ROOT, acc = []) {
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome)) continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) paginas(caminho, acc);
    else if (nome.endsWith('.html') && !nome.startsWith('preview-')) acc.push(caminho);
  }
  return acc;
}

const PAGINAS = paginas().map((f) => [relative(ROOT, f), readFileSync(f, 'utf8')]);
const LINK_FORM = /<a\b[^>]*href="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\/[^"]*"[^>]*>/g;
const LINK_POPUP = /<a\b[^>]*data-th-quiz[^>]*>/g;

test('encontrou as páginas publicadas', () => {
  assert.ok(PAGINAS.length >= 23, `esperava >= 23 páginas, achei ${PAGINAS.length}`);
});

test('nenhuma página publicada usa o formulário antigo', () => {
  for (const [arquivo, html] of PAGINAS) {
    assert.ok(!html.includes('ng_MXvkuBh'), `${arquivo} ainda aponta para ng_MXvkuBh`);
  }
});

test('todo link para o formulário abre em popup', () => {
  for (const [arquivo, html] of PAGINAS) {
    for (const tag of html.match(LINK_FORM) || []) {
      assert.ok(
        tag.includes(`data-th-quiz="${FORM_ID}"`),
        `${arquivo}: CTA sem data-th-quiz -> ${tag}`
      );
    }
  }
});

test('todo CTA em popup mantém o href de fallback', () => {
  for (const [arquivo, html] of PAGINAS) {
    for (const tag of html.match(LINK_POPUP) || []) {
      assert.match(
        tag,
        /href="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\//,
        `${arquivo}: CTA sem href de fallback -> ${tag}`
      );
    }
  }
});

test('toda página com CTA carrega o embed.js', () => {
  for (const [arquivo, html] of PAGINAS) {
    if (!html.includes('data-th-quiz')) continue;
    assert.ok(
      html.includes('workers.dev/embed.js'),
      `${arquivo} tem CTA de popup mas não carrega o embed.js`
    );
  }
});
