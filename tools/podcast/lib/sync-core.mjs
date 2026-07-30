/* Regras puras do sync do podcast, separadas do I/O para poderem ser testadas.
   Ver tools/podcast/sync.mjs para o comando e tools/podcast/README.md para o
   fluxo de manutenção. */

/* Quantos cortes ficam no trilho da home. Os demais aparecem só na página. */
export const CORTES_NA_HOME = 8;

/* Os títulos do YouTube vêm com hashtag, emoji e espaçamento irregular, e
   nada disso serve no site. A limpeza é chute educado: o sync marca o item
   com `revisar: true` para o build lembrar que ninguém leu aquilo ainda. */
export function limparTitulo(bruto = '') {
  let t = String(bruto)
    .replace(/#[\p{L}\p{N}_]+/gu, ' ')
    .replace(/[\p{Extended_Pictographic}️‍]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    // pontuação solta que sobra depois de tirar as hashtags do fim
    .replace(/[\s·|,;:—-]+$/u, '')
    .trim();

  if (!t) return '';
  // "o erro" no fim de uma frase truncada não vira título, mas continua
  // melhor do que a hashtag; quem revisa decide.
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/* short-01, short-02, ... — devolve o próximo número livre, não o tamanho da
   lista, senão um arquivo removido faria dois itens colidirem. */
export function proximoArquivo(shorts = []) {
  const usados = shorts
    .map((s) => /^short-(\d+)$/.exec(s.arquivo || ''))
    .filter(Boolean)
    .map((m) => parseInt(m[1], 10));
  const proximo = (usados.length ? Math.max(...usados) : 0) + 1;
  return `short-${String(proximo).padStart(2, '0')}`;
}

/* O que está no canal e ainda não está no JSON, do mais antigo para o mais
   novo — assim, ao inserir cada um no topo, a ordem final fica cronológica. */
export function novosItens(remotos = [], locais = []) {
  const conhecidos = new Set(locais.map((l) => l.id));
  return remotos.filter((r) => r.id && !conhecidos.has(r.id)).reverse();
}

/* Insere os cortes novos no topo e reequilibra o trilho da home: entra o
   novo, sai o mais antigo que estava lá. Sem isso a home congelaria na
   seleção do dia em que foi montada. Devolve um objeto novo. */
export function aplicarShorts(data, novos, naHome = CORTES_NA_HOME) {
  const shorts = data.shorts.slice();
  for (const novo of novos) {
    shorts.unshift({
      id: novo.id,
      arquivo: novo.arquivo || proximoArquivo(shorts),
      titulo: limparTitulo(novo.titulo) || 'Corte do podcast',
      home: true,
      revisar: true,
    });
  }

  let naFrente = 0;
  for (const s of shorts) {
    if (naFrente < naHome) {
      s.home = true;
      naFrente++;
    } else {
      delete s.home;
    }
  }

  return { ...data, shorts };
}

/* Episódios longos o sync não escreve sozinho: a descrição é copy, e copy
   automática não vai ao ar. Devolve o rascunho para quem for revisar. */
export function rascunhoEpisodio(remoto, data) {
  const num = (data.episodios[0] ? data.episodios[0].num : 0) + 1;
  return {
    id: remoto.id,
    num,
    titulo: limparTitulo(remoto.titulo),
    duracao: '',
    segundos: remoto.duracao || 0,
    publicado: '',
    capa: `assets/podcast/ep-${String(num).padStart(2, '0')}.jpg`,
    descricao: '',
  };
}
