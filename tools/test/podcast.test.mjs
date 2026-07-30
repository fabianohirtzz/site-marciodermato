import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHomeSection, renderPage, validate, minutos, esc, attr } from '../podcast/lib/render.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(readFileSync(join(ROOT, 'tools', 'podcast', 'podcast.json'), 'utf8'));

test('podcast.json passa na validação', () => {
  assert.deepEqual(validate(data), []);
});

test('validate acusa campos faltando', () => {
  const erros = validate({ canal: '', episodios: [{ id: 'x' }], shorts: [] });
  assert.ok(erros.some(e => e.includes('canal')));
  assert.ok(erros.some(e => e.includes('titulo')));
  assert.ok(erros.some(e => e.includes('nenhum short')));
});

test('validate barra o par antes/depois', () => {
  const sujo = structuredClone(data);
  sujo.shorts[0].titulo = 'A pele antes e depois do inverno';
  assert.ok(validate(sujo).some(e => e.includes('antes')));
});

test('minutos corta os segundos', () => {
  assert.equal(minutos('37:07'), '37 min');
  assert.equal(minutos('50:59'), '50 min');
  assert.equal(minutos(''), '');
});

test('escapa HTML no texto e nos atributos', () => {
  assert.equal(esc('<b>&</b>'), '&lt;b&gt;&amp;&lt;/b&gt;');
  assert.equal(attr('diz "oi"'), 'diz &quot;oi&quot;');
});

test('a seção da home traz só os cortes marcados', () => {
  const html = renderHomeSection(data);
  const naHome = data.shorts.filter(s => s.home);
  assert.equal((html.match(/class="preel__item"/g) || []).length, naHome.length);
  const fora = data.shorts.find(s => !s.home);
  assert.ok(!html.includes(`${fora.arquivo}.mp4`), 'corte fora da home não deveria aparecer');
});

test('a seção da home destaca o episódio mais recente', () => {
  const html = renderHomeSection(data);
  assert.ok(html.includes(`data-yt="${data.episodios[0].id}"`));
  assert.ok(html.includes('<!-- ') === false, 'sem comentários soltos no bloco injetado');
});

test('a página lista todos os episódios e todos os cortes', () => {
  const html = renderPage(data);
  assert.equal((html.match(/class="pep /g) || []).length, data.episodios.length);
  assert.equal((html.match(/class="preel__item"/g) || []).length, data.shorts.length);
  for (const s of data.shorts) assert.ok(html.includes(`${s.arquivo}.mp4`), `falta ${s.arquivo}`);
});

test('os vídeos do trilho carregam sob demanda e sem som', () => {
  const html = renderPage(data);
  assert.equal((html.match(/preload="none"/g) || []).length, data.shorts.length);
  assert.equal((html.match(/class="preel__video" playsinline muted loop/g) || []).length, data.shorts.length);
});

test('nenhum iframe do YouTube no HTML servido', () => {
  // O embed só nasce no clique, então nada de youtube.com em iframe/src aqui.
  const html = renderPage(data) + renderHomeSection(data);
  assert.ok(!/<iframe[^>]+youtube/i.test(html));
});

test('a página traz JSON-LD da série e de cada episódio', () => {
  const html = renderPage(data);
  const blocos = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/g) || [];
  assert.equal(blocos.length, 1 + data.episodios.length);
  assert.ok(html.includes('"@type":"PodcastSeries"'));
  assert.equal((html.match(/"@type":"VideoObject"/g) || []).length, data.episodios.length);
});

test('a página não expõe inscritos nem visualizações', () => {
  const html = renderPage(data).toLowerCase();
  assert.ok(!html.includes('inscrito'));
  assert.ok(!html.includes('visualiza'));
});

test('a página usa o nav e o rodapé compartilhados, com Podcast atual', () => {
  const html = renderPage(data);
  assert.ok(html.includes('<a class="nav__link" href="podcast.html" aria-current="page">Podcast</a>'));
  assert.ok(html.includes('class="footer__social"'));
  assert.ok(html.includes('drawer__social'));
});

test('os CTAs da página abrem o popup do formulário', () => {
  const html = renderPage(data);
  assert.ok(html.includes('data-th-quiz='));
  assert.ok(!html.includes('wa.me'));
});
