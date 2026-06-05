// Generate the 5 stub pages (nav + slim header + footer, no body content yet).
// Inner pages share the exact global nav/footer with the home page.
import { writeFileSync } from "node:fs";

const WA =
  "https://wa.me/5551999704848?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta.";

const navLink = (href, label, current) =>
  `<a class="nav__link" href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
const drawerLink = (href, label, current) =>
  `<a class="drawer__link" href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;

const NAV = (active) => `  <header class="nav nav--solid" data-nav>
    <div class="nav__inner">
      <a class="nav__brand" href="index.html" aria-label="Dr. Márcio Teixeira, página inicial">
        <img class="nav__logo nav__logo--light" src="logo/logo-header-branco.png" alt="Dr. Márcio Teixeira" />
        <img class="nav__logo nav__logo--solid" src="logo/logo-header-colorido.png" alt="Dr. Márcio Teixeira" />
      </a>
      <nav class="nav__links" aria-label="Navegação principal">
        ${navLink("index.html", "Início", active === "index")}
        ${navLink("tratamentos.html", "Tratamentos", active === "tratamentos")}
        ${navLink("metodo-4d.html", "Método 4D", active === "metodo-4d")}
        ${navLink("tricologia.html", "Tricologia", active === "tricologia")}
        ${navLink("sobre.html", "Sobre", active === "sobre")}
        ${navLink("contato.html", "Contato", active === "contato")}
      </nav>
      <a class="btn btn--primary nav__cta" href="${WA}" target="_blank" rel="noopener">Agende sua consulta</a>
      <button class="nav__burger" data-drawer-open type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <div class="nav-scrim" data-drawer-scrim></div>
  <aside class="drawer" id="drawer" data-drawer aria-hidden="true">
    <button class="drawer__close" data-drawer-close type="button" aria-label="Fechar menu">&times;</button>
    ${drawerLink("index.html", "Início", active === "index")}
    ${drawerLink("tratamentos.html", "Tratamentos", active === "tratamentos")}
    ${drawerLink("metodo-4d.html", "Método 4D", active === "metodo-4d")}
    ${drawerLink("tricologia.html", "Tricologia", active === "tricologia")}
    ${drawerLink("sobre.html", "Sobre", active === "sobre")}
    ${drawerLink("contato.html", "Contato", active === "contato")}
    <a class="btn btn--primary drawer__cta" href="${WA}" target="_blank" rel="noopener">Agende sua consulta</a>
  </aside>`;

const FOOTER = `  <footer class="footer" aria-label="Rodapé">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <img class="footer__logo" src="logo/logo-rodape.png" alt="Dr. Márcio Teixeira" loading="lazy" />
          <p class="footer__tagline">Seu dermatologista de confiança em Porto Alegre, excelência desde 1993 em saúde e beleza da pele.</p>
        </div>
        <nav class="footer__nav" aria-label="Navegação do rodapé">
          <p class="footer__col-title">Navegação</p>
          <div class="footer__links">
            <a href="index.html">Início</a>
            <a href="tratamentos.html">Tratamentos</a>
            <a href="metodo-4d.html">Método 4D</a>
            <a href="tricologia.html">Tricologia</a>
            <a href="sobre.html">Sobre</a>
            <a href="contato.html">Contato</a>
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
            <a href="https://instagram.com/dr.marciodermato" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.21 8.49 3.2 8.86 3.2 12s.01 3.51.07 4.75c.04.9.2 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.39-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.2-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.51 4.01 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zm5.14-.69a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z" /></svg>
            </a>
            <a href="https://facebook.com/dr.marciodermato" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg>
            </a>
            <a href="https://wa.me/5551999704848" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13z" /></svg>
            </a>
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

  <a class="wpp" href="${WA}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13zM17.4 14.3c-.07-.12-.27-.19-.56-.34-.29-.14-1.71-.84-1.97-.94-.27-.1-.46-.14-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2.01 3.07 4.86 4.3.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37z" /></svg>
  </a>`;

const page = ({ file, active, title, metaTitle, desc, eyebrow, headline, lede }) => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${metaTitle}</title>
  <meta name="description" content="${desc}" />
  <meta name="theme-color" content="#057f7f" />
  <link rel="icon" type="image/png" href="logo/logo-header-colorido.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/css/main.css" />
</head>
<body class="is-loading">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

${NAV(active)}

  <main>
    <section class="page-head" id="conteudo" aria-labelledby="page-title">
      <div class="container page-head__inner">
        <p class="eyebrow"><span class="eyebrow__rule" aria-hidden="true"></span> ${eyebrow}</p>
        <h1 id="page-title" class="section__title">${headline}</h1>
        <p class="section__lede">${lede}</p>
        <span class="page-head__soon">Conteúdo em breve</span>
      </div>
    </section>
  </main>

${FOOTER}

  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;

const pages = [
  {
    file: "tratamentos.html",
    active: "tratamentos",
    metaTitle: "Tratamentos · Dr. Márcio Teixeira · Dermatologista em Porto Alegre",
    desc: "Tratamentos faciais organizados pelos quatro eixos do Método 4D, no consultório do Dr. Márcio Teixeira em Porto Alegre.",
    eyebrow: "Tratamentos",
    headline: 'Cuidados <span class="hl hl--italic">sob medida</span> para a sua pele',
    lede: "Cansado(a) dos mesmos resultados? O segredo é a avaliação correta, para o tratamento correto.",
  },
  {
    file: "metodo-4d.html",
    active: "metodo-4d",
    metaTitle: "Método 4D · Dr. Márcio Teixeira · Dermatologista em Porto Alegre",
    desc: "O Método 4D, criado pelo Dr. Márcio Teixeira, avalia sua pele em quatro eixos para tratamentos mais eficazes e personalizados.",
    eyebrow: "Método 4D · exclusivo do Dr. Márcio",
    headline: 'O segredo é a <span class="hl hl--italic">avaliação correta</span>, para o tratamento correto',
    lede: "Uma abordagem inovadora que avalia a pele em toda a sua complexidade, dividindo problemas e tratamentos em quatro eixos principais e complementares.",
  },
  {
    file: "tricologia.html",
    active: "tricologia",
    metaTitle: "Tricologia · Dr. Márcio Teixeira · Dermatologista em Porto Alegre",
    desc: "Diagnóstico e tratamento de queda capilar, calvície e saúde do couro cabeludo com o Dr. Márcio Teixeira, dermatologista e tricologista em Porto Alegre.",
    eyebrow: "Tricologia",
    headline: 'Saúde e força para os seus <span class="hl hl--italic">cabelos</span>',
    lede: "Diagnóstico e tratamento de queda, calvície e saúde do couro cabeludo, com a mesma precisão do Método 4D.",
  },
  {
    file: "sobre.html",
    active: "sobre",
    metaTitle: "Sobre · Dr. Márcio Teixeira · Dermatologista em Porto Alegre",
    desc: "Conheça o Dr. Márcio Teixeira: quase 30 anos de dermatologia clínica, estética e cirúrgica em Porto Alegre, com foco em resultados naturais.",
    eyebrow: "Sobre",
    headline: 'Cuidar da pele é minha <span class="hl hl--italic">vocação</span>',
    lede: "Bem-vindo à Clínica Dr. Márcio Teixeira, um espaço onde ciência, tecnologia e empatia se unem para oferecer o que há de melhor em dermatologia clínica, estética e cirúrgica.",
  },
  {
    file: "contato.html",
    active: "contato",
    metaTitle: "Contato · Dr. Márcio Teixeira · Dermatologista em Porto Alegre",
    desc: "Fale com a Clínica Dr. Márcio Teixeira em Porto Alegre. Agende sua consulta pelo WhatsApp (51) 99970-4848.",
    eyebrow: "Contato",
    headline: 'Fale <span class="hl hl--italic">conosco</span>',
    lede: "Estamos à disposição para tirar dúvidas, orientar sobre tratamentos e agendar sua consulta da forma mais prática para você.",
  },
];

for (const p of pages) {
  writeFileSync(p.file, page(p));
  console.log("wrote", p.file);
}
