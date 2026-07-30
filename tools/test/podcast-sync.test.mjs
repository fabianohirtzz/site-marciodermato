import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  limparTitulo,
  proximoArquivo,
  novosItens,
  aplicarShorts,
  rascunhoEpisodio,
  CORTES_NA_HOME,
} from '../podcast/lib/sync-core.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const data = JSON.parse(readFileSync(join(ROOT, 'tools', 'podcast', 'podcast.json'), 'utf8'));

test('limparTitulo tira hashtags do fim', () => {
  assert.equal(
    limparTitulo('Pele Ardendo no Inverno?  O Erro #podcast #dermatologia #pele #ácidos'),
    'Pele Ardendo no Inverno? O Erro'
  );
});

test('limparTitulo tira hashtags do meio sem colar as palavras', () => {
  assert.equal(limparTitulo('Pele seca #derma envelhece mais?'), 'Pele seca envelhece mais?');
});

test('limparTitulo tira emoji e espaço sobrando', () => {
  assert.equal(limparTitulo('você sabe escolher o demaquilante ideal? ✨️'), 'Você sabe escolher o demaquilante ideal?');
});

test('limparTitulo devolve vazio quando só havia hashtag', () => {
  assert.equal(limparTitulo('#podcast #dermatologia'), '');
  assert.equal(limparTitulo(''), '');
});

test('proximoArquivo pega o maior número, não o tamanho da lista', () => {
  assert.equal(proximoArquivo([{ arquivo: 'short-01' }, { arquivo: 'short-14' }]), 'short-15');
  assert.equal(proximoArquivo([]), 'short-01');
  // um arquivo removido no meio não pode fazer dois itens colidirem
  assert.equal(proximoArquivo([{ arquivo: 'short-01' }, { arquivo: 'short-09' }]), 'short-10');
});

test('novosItens ignora o que já está no site', () => {
  const remotos = [{ id: 'novo2' }, { id: 'novo1' }, { id: data.shorts[0].id }];
  const novos = novosItens(remotos, data.shorts);
  assert.deepEqual(novos.map((n) => n.id), ['novo1', 'novo2']);
});

test('novosItens devolve do mais antigo para o mais novo', () => {
  // o canal lista do mais recente para o mais antigo; invertendo, cada
  // unshift deixa a lista final em ordem cronológica
  const novos = novosItens([{ id: 'c' }, { id: 'b' }, { id: 'a' }], []);
  assert.deepEqual(novos.map((n) => n.id), ['a', 'b', 'c']);
});

test('aplicarShorts insere no topo e marca para revisão', () => {
  const out = aplicarShorts(data, [{ id: 'zzz', titulo: 'Um corte novo #podcast' }]);
  assert.equal(out.shorts[0].id, 'zzz');
  assert.equal(out.shorts[0].titulo, 'Um corte novo');
  assert.equal(out.shorts[0].revisar, true);
  assert.equal(out.shorts[0].arquivo, 'short-15');
  assert.equal(out.shorts.length, data.shorts.length + 1);
});

test('aplicarShorts não altera o objeto recebido', () => {
  const antes = data.shorts.length;
  aplicarShorts(data, [{ id: 'zzz', titulo: 'x' }]);
  assert.equal(data.shorts.length, antes);
});

test('o trilho da home mantém o tamanho, trocando o mais antigo', () => {
  const out = aplicarShorts(data, [{ id: 'a1', titulo: 'A' }, { id: 'b2', titulo: 'B' }]);
  const naHome = out.shorts.filter((s) => s.home);
  assert.equal(naHome.length, CORTES_NA_HOME);
  // os novos entram
  assert.ok(naHome.some((s) => s.id === 'a1'));
  assert.ok(naHome.some((s) => s.id === 'b2'));
  // e são exatamente os primeiros da lista
  assert.deepEqual(out.shorts.slice(0, CORTES_NA_HOME).map((s) => s.id), naHome.map((s) => s.id));
});

test('com poucos cortes, todos ficam na home', () => {
  const pequeno = { ...data, shorts: data.shorts.slice(0, 3) };
  const out = aplicarShorts(pequeno, []);
  assert.equal(out.shorts.filter((s) => s.home).length, 3);
});

test('rascunhoEpisodio numera a partir do último e deixa a copy em branco', () => {
  const r = rascunhoEpisodio({ id: 'novo', titulo: 'EP 04 | Alguma coisa #podcast' }, data);
  assert.equal(r.num, data.episodios[0].num + 1);
  assert.equal(r.capa, 'assets/podcast/ep-04.jpg');
  assert.equal(r.descricao, '', 'descrição é copy, o sync não inventa');
});
