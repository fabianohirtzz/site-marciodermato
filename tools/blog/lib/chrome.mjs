const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Todo CTA vai para o formulário rastreado, que ao final leva o lead ao
// WhatsApp. O wa.me direto só aparece no telefone escrito e no ícone de redes.
export const CTA = 'https://meutrack-ingest.carlosabsj-ti.workers.dev/f/ng_MXvkuBh';

const WPP_ICON =
  '<svg class="wpp__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13zM17.4 14.3c-.07-.12-.27-.19-.56-.34-.29-.14-1.71-.84-1.97-.94-.27-.1-.46-.14-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2.01 3.07 4.86 4.3.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37z"/></svg>';

export function navHTML(base = '', current = '') {
  const links = [
    ['index.html', 'Início', 'home'],
    ['tratamentos.html', 'Tratamentos', 'tratamentos'],
    ['metodo-4d.html', 'Método 4D', 'metodo'],
    ['tricologia.html', 'Tricologia', 'tricologia'],
    ['sobre.html', 'Sobre', 'sobre'],
    ['blog.html', 'Blog', 'blog'],
    ['contato.html', 'Contato', 'contato'],
  ];
  const cur = key => (key === current ? ' aria-current="page"' : '');
  const navLinks = links
    .map(([h, l, k]) => `        <a class="nav__link" href="${base}${h}"${cur(k)}>${l}</a>`).join('\n');
  const drawerLinks = links
    .map(([h, l, k]) => `    <a class="drawer__link" href="${base}${h}"${cur(k)}>${l}</a>`).join('\n');
  const cta = CTA;
  return `  <header class="nav nav--solid" data-nav>
    <div class="nav__inner">
      <a class="nav__brand" href="${base}index.html" aria-label="Dr. Márcio Teixeira, página inicial">
        <img class="nav__logo nav__logo--light" src="${base}logo/logo-header-branco.png" alt="Dr. Márcio Teixeira" />
        <img class="nav__logo nav__logo--solid" src="${base}logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
      </a>
      <nav class="nav__links" aria-label="Navegação principal">
        <span class="nav__indicator" aria-hidden="true"></span>
${navLinks}
      </nav>
      <a class="btn btn--primary nav__cta" href="${attr(cta)}" target="_blank" rel="noopener">Agende sua consulta</a>
      <button class="nav__burger" data-drawer-open type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="nav-scrim" data-drawer-scrim></div>
  <aside class="drawer" id="drawer" data-drawer aria-hidden="true">
    <button class="drawer__close" data-drawer-close type="button" aria-label="Fechar menu">&times;</button>
${drawerLinks}
    <a class="btn btn--primary drawer__cta" href="${attr(cta)}" target="_blank" rel="noopener">Agende sua consulta</a>
  </aside>`;
}

export function footerHTML(base = '') {
  return `  <footer class="footer" aria-label="Rodapé">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <img class="footer__logo" src="${base}logo/logo-rodape.png" alt="Dr. Márcio Teixeira" loading="lazy" />
          <p class="footer__tagline">Seu dermatologista de confiança em Porto Alegre, excelência desde 1993 em saúde e beleza da pele.</p>
        </div>
        <nav class="footer__nav" aria-label="Navegação do rodapé">
          <p class="footer__col-title">Navegação</p>
          <div class="footer__links">
            <a href="${base}index.html">Início</a>
            <a href="${base}tratamentos.html">Tratamentos</a>
            <a href="${base}metodo-4d.html">Método 4D</a>
            <a href="${base}tricologia.html">Tricologia</a>
            <a href="${base}sobre.html">Sobre</a>
            <a href="${base}blog.html">Blog</a>
            <a href="${base}contato.html">Contato</a>
          </div>
        </nav>
        <div class="footer__info">
          <p class="footer__col-title">Contato</p>
          <div class="footer__contact">
            <span>Av. Dr. Nilo Peçanha, 1221/602, Porto Alegre/RS</span>
            <span>Seg a Sex: 09h às 19h · Sáb: fechado</span>
            <a href="https://wa.me/5551999704848" target="_blank" rel="noopener">(51) 99970-4848</a>
            <a href="tel:+555131104110">(51) 3110-4110</a>
            <a href="mailto:secretaria@dermaclin.poa.br">secretaria@dermaclin.poa.br</a>
          </div>
        </div>
        <div class="footer__connect">
          <p class="footer__col-title">Redes</p>
          <div class="footer__social">
            <a href="https://instagram.com/dr.marciodermato" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2z"/></svg></a>
            <a href="https://wa.me/5551999704848" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13z"/></svg></a>
          </div>
        </div>
      </div>
      <p class="footer__creds">CREMERS 20214 · RQE 10858 | 12078 · Membro titular da Sociedade Brasileira de Dermatologia</p>
      <div class="footer__bottom">
        <span>Dr. Márcio Teixeira © Todos os Direitos Reservados</span>
        <span>Desenvolvido por: Freela In Home</span>
      </div>
    </div>
  </footer>

  <a class="wpp" href="${CTA}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <span class="wpp__label">Agende pelo WhatsApp</span>
    <span class="wpp__btn">
      <span class="wpp__rings" aria-hidden="true"></span>
      ${WPP_ICON}
      <span class="wpp__pip" aria-hidden="true">1</span>
    </span>
  </a>`;
}
