/* Invariantes dos CTAs em popup.
   As páginas de tratamento e do blog são geradas; sem esta guarda, um
   rebuild com o gerador desatualizado devolve o site ao redirect. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORM_ID, TRACKING_FOOT } from '../lib/tracking.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/* Enumera só o que está versionado no git (`git ls-files`), em vez de
   varrer o disco: o projeto usa worktrees para features em paralelo
   (.claude/worktrees/*), e uma varredura por disco encontraria HTMLs em
   estado intermediário lá dentro, quebrando ou mascarando o npm test
   rodado da raiz do master. Mantém as mesmas exclusões de sempre:
   painel/ (app à parte, sem CTAs de popup) e preview-*.html (rascunhos
   de desenvolvimento). node_modules/ nunca aparece em `git ls-files`,
   mas o filtro fica aqui como cinto e suspensórios. */
function paginas() {
  const saida = execFileSync('git', ['ls-files', '*.html'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return saida
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)
    .filter((rel) => !rel.startsWith('painel/'))
    .filter((rel) => !rel.startsWith('node_modules/'))
    .filter((rel) => !rel.split('/').pop().startsWith('preview-'))
    .map((rel) => [rel, lerNormalizado(join(ROOT, rel))]);
}

/* No Windows com core.autocrlf=true o arquivo em disco vem com CRLF, mas as
   constantes deste repositório (TRACKING_FOOT, por exemplo) usam LF. Sem
   normalizar, a suíte passa no Linux e falha no Windows pelo fim de linha. */
function lerNormalizado(caminho) {
  return readFileSync(caminho, 'utf8').replace(/\r\n/g, '\n');
}

const PAGINAS = paginas();
const LINK_FORM = /<a\b[^>]*href="https:\/\/meutrack-ingest\.carlosabsj-ti\.workers\.dev\/f\/[^"]*"[^>]*>/g;
const LINK_POPUP = /<a\b[^>]*data-th-quiz[^>]*>/g;

/* O link dentro de <noscript> é o fallback para quando não há JS — e sem
   JS não existe embed.js nem popup possível, então ele fica de fora da
   exigência de data-th-quiz (ver contato.html). */
const semNoscript = (html) => html.replace(/<noscript[\s\S]*?<\/noscript>/g, '');

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
    for (const tag of semNoscript(html).match(LINK_FORM) || []) {
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

test('toda página com CTA carrega o embed.js do rodapé (TRACKING_FOOT)', () => {
  /* Amarrado à fonte única (tools/lib/tracking.mjs) em vez de uma
     substring solta: em contato.html o embed.js também é carregado
     inline (data-form) para o formulário embutido na página, então uma
     checagem por substring passaria mesmo sem a tag do modal do rodapé
     — justo a página com configuração dupla, a mais fácil de quebrar
     num rebuild. */
  for (const [arquivo, html] of PAGINAS) {
    if (!html.includes('data-th-quiz')) continue;
    assert.ok(
      html.includes(TRACKING_FOOT),
      `${arquivo} tem CTA de popup mas não carrega o embed.js do rodapé (TRACKING_FOOT)`
    );
  }
});

test('há pelo menos 225 CTAs em popup no site', () => {
  /* Piso de contagem: as asserções acima só falam de links que já
     casaram com um padrão. Uma regressão que troque o <a> por <button>
     (sem href nem data-th-quiz) passaria em todas elas sem este total.
     225 CTAs reais (não 226): o link dentro do <noscript> em
     contato.html tinha data-th-quiz "morto" — sem JS não há popup
     possível — e essa marcação foi removida (ver o link acima). */
  const alvo = `data-th-quiz="${FORM_ID}"`;
  let total = 0;
  for (const [, html] of PAGINAS) {
    const m = html.match(new RegExp(alvo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    total += m ? m.length : 0;
  }
  assert.ok(total >= 225, `esperava >= 225 CTAs com ${alvo}, achei ${total}`);
});
