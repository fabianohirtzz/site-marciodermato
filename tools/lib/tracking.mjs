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
