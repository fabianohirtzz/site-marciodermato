/* Tags de tracking do site (MeuTrack + Google Tag Manager).
   Fonte única: as páginas escritas à mão e as geradas devem sair idênticas.
   Ao alterar aqui, rode `npm run build:treatments` e republique o blog. */

export const GTM_ID = 'GTM-NH4SM7PL';

/** Vai imediatamente antes de </head>. */
export const TRACKING_HEAD = `  <!-- MeuTrack -->
  <script async src="https://meutrack-ingest.carlosabsj-ti.workers.dev/t.js?p=4TqtCgzLsewg"></script>

  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM_ID}');</script>
  <!-- End Google Tag Manager -->`;

/** Vai imediatamente depois da tag <body> de abertura. */
export const TRACKING_BODY = `  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;

/* --- CTAs em popup ---------------------------------------------------
   O formulário abre dentro do site (modo modal do embed.js), acionado
   pelo atributo data-th-quiz. O href continua ali de propósito: o
   embed.js dá preventDefault() no clique, então o link só dispara se o
   script não carregar — e aí o visitante cai no formulário como antes. */
export const FORM_ID = 'PGW6nIOmTX';

export const CTA_HREF = `https://meutrack-ingest.carlosabsj-ti.workers.dev/f/${FORM_ID}`;

/** Atributos completos de um <a> de CTA. Uso: `<a class="btn" ${CTA_ATTRS}>`. */
export const CTA_ATTRS = `data-th-quiz="${FORM_ID}" href="${CTA_HREF}" target="_blank" rel="noopener"`;

/** Vai imediatamente antes de </body>, depois do main.js. */
export const TRACKING_FOOT = `  <!-- MeuTrack: popup dos CTAs (data-th-quiz) -->
  <script async src="https://meutrack-ingest.carlosabsj-ti.workers.dev/embed.js"></script>`;
