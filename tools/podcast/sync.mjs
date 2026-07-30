/* sync.mjs — traz os Shorts novos do canal para o site.

   Uso:
     npm run podcast:sync              baixa, converte e reconstrói
     npm run podcast:sync -- --dry-run só mostra o que faria

   Por que não roda sozinho no Actions: o YouTube recusa download vindo de IP
   de datacenter ("confirme que você não é um robô"), e o runner do GitHub cai
   nisso. Contornar exigiria cookies de sessão ou proxy, uma dependência que
   quebra sem avisar. Rodando aqui, funciona.

   Depende de yt-dlp (pip install yt-dlp) e ffmpeg no PATH. */
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { novosItens, aplicarShorts, proximoArquivo, limparTitulo, rascunhoEpisodio } from './lib/sync-core.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = join(ROOT, 'tools', 'podcast', 'podcast.json');
const MIDIA = join(ROOT, 'assets', 'podcast');
const TEMP = join(ROOT, 'tools', 'podcast', '.tmp');

const dryRun = process.argv.includes('--dry-run');
const data = JSON.parse(readFileSync(DATA, 'utf8'));

/* --- 1. o que está no canal ---------------------------------------- */
function listar(aba) {
  // --flat-playlist não abre cada vídeo, então a varredura leva segundos.
  const saida = execFileSync(
    'python',
    ['-m', 'yt_dlp', '--flat-playlist', '--no-warnings', '--print', '%(id)s\t%(title)s', `${data.canal}/${aba}`],
    { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' }, maxBuffer: 8 * 1024 * 1024 }
  );
  return saida
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [id, titulo] = l.split('\t');
      return { id, titulo: titulo || '' };
    });
}

console.log('Consultando o canal...');
let remotosShorts, remotosEps;
try {
  remotosShorts = listar('shorts');
  remotosEps = listar('videos');
} catch (e) {
  console.error(
    'Não consegui ler o canal. Confira se o yt-dlp está instalado (pip install yt-dlp)\n' +
      'e atualizado (pip install -U yt-dlp) — o YouTube muda o player com frequência.\n' +
      String(e.message || e).split('\n').slice(0, 3).join('\n')
  );
  process.exit(1);
}

const novosShorts = novosItens(remotosShorts, data.shorts);
const novosEps = novosItens(remotosEps, data.episodios);

console.log(`Canal: ${remotosShorts.length} cortes, ${remotosEps.length} episódios.`);
console.log(`Site:  ${data.shorts.length} cortes, ${data.episodios.length} episódios.`);

if (!novosShorts.length && !novosEps.length) {
  console.log('\nNada novo. Site em dia.');
  process.exit(0);
}

/* Episódio novo é copy, então o sync não escreve: entrega o rascunho. */
if (novosEps.length) {
  console.log(`\n${novosEps.length} episódio(s) novo(s) — estes NÃO entram sozinhos, porque a`);
  console.log('descrição é texto escrito, não gerado. Acrescente à mão no topo de');
  console.log('tools/podcast/podcast.json, com a capa (ver o README):\n');
  for (const ep of novosEps) console.log(JSON.stringify(rascunhoEpisodio(ep, data), null, 2));
}

if (!novosShorts.length) process.exit(0);

console.log(`\n${novosShorts.length} corte(s) novo(s):`);
for (const s of novosShorts) console.log(`  ${s.id}  ${limparTitulo(s.titulo) || '(sem título)'}`);

if (dryRun) {
  console.log('\n--dry-run: nada foi baixado nem escrito.');
  process.exit(0);
}

/* --- 2. baixa e converte -------------------------------------------- */
mkdirSync(TEMP, { recursive: true });
const preparados = [];
let numeracao = data.shorts.slice();

for (const s of novosShorts) {
  const arquivo = proximoArquivo(numeracao);
  numeracao = [...numeracao, { arquivo }];
  console.log(`\n[${arquivo}] baixando ${s.id}...`);

  try {
    execFileSync(
      'python',
      [
        '-m', 'yt_dlp',
        '-f', 'bv*[height<=1080]/bv*',
        '--download-sections', '*0-14',
        '--force-keyframes-at-cuts',
        '--no-warnings', '--quiet',
        '-o', join(TEMP, `${s.id}.%(ext)s`),
        `https://www.youtube.com/shorts/${s.id}`,
      ],
      { stdio: 'inherit', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } }
    );
  } catch {
    console.error(`[${arquivo}] falhou o download de ${s.id}, pulando.`);
    continue;
  }

  const bruto = readdirSync(TEMP).find((f) => f.startsWith(s.id + '.'));
  if (!bruto) {
    console.error(`[${arquivo}] o download não deixou arquivo, pulando.`);
    continue;
  }

  // 12s, 480px, sem faixa de áudio: o card é um preview mudo, o short
  // completo abre no lightbox do YouTube.
  console.log(`[${arquivo}] convertendo...`);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', join(TEMP, bruto), '-t', '12',
    '-vf', 'scale=480:-2,fps=24',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-profile:v', 'main',
    '-movflags', '+faststart', '-an',
    join(MIDIA, `${arquivo}.mp4`),
  ]);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-ss', '1', '-i', join(MIDIA, `${arquivo}.mp4`),
    '-frames:v', '1', '-vf', 'scale=360:-2', '-q:v', '6',
    join(MIDIA, `${arquivo}.jpg`),
  ]);

  preparados.push({ ...s, arquivo });
}

rmSync(TEMP, { recursive: true, force: true });

if (!preparados.length) {
  console.error('\nNenhum corte pôde ser preparado.');
  process.exit(1);
}

/* --- 3. escreve o JSON e reconstrói --------------------------------- */
const atualizado = aplicarShorts(data, preparados);
writeFileSync(DATA, JSON.stringify(atualizado, null, 2) + '\n');
console.log(`\npodcast.json: ${preparados.length} corte(s) adicionado(s).`);

// O build já lista os títulos pendentes de revisão; não repetir aqui.
execFileSync('node', [join(ROOT, 'tools', 'build-podcast.mjs')], { stdio: 'inherit' });
