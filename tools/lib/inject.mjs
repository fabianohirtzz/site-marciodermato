/* inject.mjs — troca o conteúdo entre dois marcadores HTML.

   Usado pelos builds que escrevem dentro de páginas feitas à mão (home,
   tricologia, blog.html). Falha alto se um marcador sumir: um replace que
   não encontra nada deixaria a página parada no conteúdo antigo sem
   ninguém perceber. Puro, sem I/O, para os testes chamarem direto. */
export function injectBetween(html, start, end, inner, indent = '          ') {
  const i = html.indexOf(start);
  const j = html.indexOf(end, i + start.length);
  if (i === -1 || j === -1) {
    throw new Error(`marcadores ${start} / ${end} não encontrados`);
  }
  // Dois blocos com o mesmo marcador significariam que alguém colou a
  // seção duas vezes; só o primeiro seria atualizado.
  if (html.indexOf(start, i + start.length) !== -1) {
    throw new Error(`marcador ${start} aparece mais de uma vez`);
  }
  return html.slice(0, i + start.length) + '\n' + indent + inner + '\n' + indent + html.slice(j);
}
