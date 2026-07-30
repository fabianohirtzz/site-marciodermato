/* build-podcast.mjs — gera podcast.html e injeta a seção do podcast na home,
   a partir de tools/podcast/podcast.json.

   Uso:
     node tools/build-podcast.mjs      (ou: npm run build:podcast)

   Para atualizar depois de um episódio ou short novo, veja
   tools/podcast/README.md. Plain Node (ESM), sem dependências. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHomeSection, renderPage, validate } from './podcast/lib/render.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'tools', 'podcast', 'podcast.json');

const START = '<!-- PODCAST:START -->';
const END = '<!-- PODCAST:END -->';

const data = JSON.parse(readFileSync(DATA, 'utf8'));

const erros = validate(data);
if (erros.length) {
  console.error('podcast.json inválido:\n  ' + erros.join('\n  '));
  process.exit(1);
}

/* Um arquivo faltando só apareceria como card quebrado no navegador, então
   falha aqui. */
const faltando = [];
for (const ep of data.episodios) if (!existsSync(join(ROOT, ep.capa))) faltando.push(ep.capa);
for (const s of data.shorts) {
  for (const ext of ['mp4', 'jpg']) {
    const rel = `assets/podcast/${s.arquivo}.${ext}`;
    if (!existsSync(join(ROOT, rel))) faltando.push(rel);
  }
}
if (faltando.length) {
  console.error('mídia ausente:\n  ' + faltando.join('\n  '));
  process.exit(1);
}

/* 1. podcast.html */
writeFileSync(join(ROOT, 'podcast.html'), renderPage(data));

/* 2. bloco da home */
const homePath = join(ROOT, 'index.html');
let home = readFileSync(homePath, 'utf8');
const i = home.indexOf(START);
const j = home.indexOf(END);
if (i === -1 || j === -1) {
  console.error(`marcadores ${START} / ${END} não encontrados em index.html`);
  process.exit(1);
}
home = home.slice(0, i + START.length) + '\n' + renderHomeSection(data) + '\n    ' + home.slice(j);
writeFileSync(homePath, home);

const naHome = data.shorts.filter((s) => s.home).length;
console.log(
  `podcast.html: ${data.episodios.length} episódios, ${data.shorts.length} cortes.\n` +
    `index.html: seção injetada com ${naHome} cortes no trilho.`
);

/* Avisa sem impedir: um título automático no ar é melhor do que um corte
   faltando, mas ninguém deve esquecer que aquele texto veio do YouTube. */
const revisar = data.shorts.filter((s) => s.revisar);
if (revisar.length) {
  console.log(`\nAtenção: ${revisar.length} título(s) ainda não revisado(s) —`);
  for (const s of revisar) console.log(`  ${s.arquivo}  "${s.titulo}"`);
  console.log('Ajuste em tools/podcast/podcast.json e tire o "revisar": true.');
}
