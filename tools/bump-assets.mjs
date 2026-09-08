/* bump-assets.mjs — troca o ?v= de main.css e main.js em todo o site.

   Uso:
     node tools/bump-assets.mjs            (carimba com a data de hoje)
     node tools/bump-assets.mjs 20260908   (carimba com um valor específico)

   Por que existe: o .htaccess serve CSS e JS com "access plus 1 year", e a URL
   nunca mudava. Quem já tinha visitado o site continuava com o arquivo antigo
   no cache do navegador por até um ano, então uma correção de layout ia ao ar
   sem chegar a quem já conhecia a página. Trocar a query resolve, mas só se
   alguém lembrar de trocá-la: por isso é um comando, e não uma instrução no
   README.

   Rode depois de mexer no CSS ou no JS do site, antes de
   publicar. Plain Node (ESM), sem dependências. */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IGNORAR = new Set(['node_modules', '.git', '.claude', 'antes-depois', 'fotos', 'ambiente']);

const hoje = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const versao = process.argv[2] || hoje;
if (!/^[\w.-]+$/.test(versao)) {
  console.error(`versão inválida: "${versao}" (use letras, números, ponto ou hífen)`);
  process.exit(1);
}

/* Casa o arquivo com ou sem query, para o comando ser idempotente e poder
   rodar de novo em cima do carimbo anterior. */
const ALVO = /((?:\.\.\/)*assets\/(?:css\/main\.css|js\/main\.js))(\?v=[\w.-]+)?/g;

/* Este arquivo fala dos dois caminhos em prosa, e sem a exceção o comando
   carimbaria o próprio comentário. */
const EU = fileURLToPath(import.meta.url);

function arquivos(dir) {
  const saida = [];
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome)) continue;
    const caminho = join(dir, nome);
    if (caminho === EU) continue;
    if (statSync(caminho).isDirectory()) saida.push(...arquivos(caminho));
    else if (/\.(html|mjs)$/.test(nome)) saida.push(caminho);
  }
  return saida;
}

let tocados = 0;
for (const caminho of arquivos(ROOT)) {
  const antes = readFileSync(caminho, 'utf8');
  const depois = antes.replace(ALVO, `$1?v=${versao}`);
  if (depois !== antes) {
    writeFileSync(caminho, depois);
    tocados++;
  }
}

console.log(`?v=${versao} em ${tocados} arquivo(s).`);
console.log('Se mexeu nos geradores, rode os builds antes de publicar.');
