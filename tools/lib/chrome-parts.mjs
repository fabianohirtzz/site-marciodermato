/* Peças compartilhadas do nav e do rodapé.

   Antes deste arquivo o mesmo bloco de redes existia em quatro versões pelo
   site (a home tinha 4 ícones, os tratamentos 3, o blog 2), e cada gerador
   mantinha a sua cópia. Como o WhatsApp passou a abrir o formulário e o
   YouTube entrou na lista, a divergência viraria bug garantido — então a
   lista canônica passa a morar aqui.

   O HTML das páginas escritas à mão (index, sobre, contato, ...) precisa
   sair idêntico ao que estas funções produzem. */
import { CTA_ATTRS } from './tracking.mjs';

export const YOUTUBE_URL = 'https://www.youtube.com/@%C3%89UmaQuest%C3%A3odePele01';
export const INSTAGRAM_URL = 'https://instagram.com/dr.marciodermato';
export const FACEBOOK_URL = 'https://facebook.com/dr.marciodermato';
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CSvT6zxc3wPiEBM/review';

/* Ícones em currentColor: o sistema de design só abre exceção de cor para o
   dourado do Google (avaliações) e o verde do WhatsApp (botão flutuante).
   O vermelho do YouTube não entra. */
export const ICON = {
  instagram:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.51.01-4.75.07-.9.04-1.39.2-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71C3.21 8.49 3.2 8.86 3.2 12s.01 3.51.07 4.75c.04.9.2 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.9-.04 1.39-.2 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.9-.2-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32C15.51 4.01 15.14 4 12 4zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28zm5.14-.69a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.52A3 3 0 0 0 .5 6.2C0 8.09 0 12 0 12s0 3.91.5 5.8a3 3 0 0 0 2.12 2.13c1.88.52 9.38.52 9.38.52s7.5 0 9.38-.52a3 3 0 0 0 2.12-2.13C24 15.91 24 12 24 12s0-3.91-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .14 11.86C.14 5.32 5.46.001 12 .001S23.86 5.32 23.86 11.86 18.54 23.72 12 23.72a11.82 11.82 0 0 1-5.66-1.44L.057 24zM6.6 20.13c1.65.98 3.22 1.57 5.4 1.57 5.44 0 9.86-4.42 9.86-9.84S17.44 2.02 12 2.02 2.14 6.44 2.14 11.86c0 2.29.67 4 1.79 5.78l-.99 3.62 3.66-1.13zM17.4 14.3c-.07-.12-.27-.19-.56-.34-.29-.14-1.71-.84-1.97-.94-.27-.1-.46-.14-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.65-1.56-.89-2.14-.23-.56-.47-.48-.65-.49l-.55-.01c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2.01 3.07 4.86 4.3.68.29 1.21.47 1.62.6.68.22 1.3.19 1.79.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37z"/></svg>',
  google:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 11.3v2.97h4.18c-.18 1.08-.73 2-1.56 2.62v2.16h2.52c1.48-1.36 2.33-3.37 2.33-5.76 0-.56-.05-1.1-.15-1.62L12 11.3z"/><path d="M12 20c2.1 0 3.87-.7 5.16-1.89l-2.52-1.95c-.7.47-1.6.75-2.64.75-2.03 0-3.75-1.37-4.37-3.21H5.03v2.02A7.79 7.79 0 0 0 12 20z"/><path d="M7.63 13.7a4.68 4.68 0 0 1 0-2.99V8.69H5.03a7.8 7.8 0 0 0 0 7.03l2.6-2.02z"/><path d="M12 7.36c1.15 0 2.18.4 2.99 1.17l2.23-2.23A7.5 7.5 0 0 0 12 4.4a7.79 7.79 0 0 0-6.97 4.29l2.6 2.02C8.25 8.73 9.97 7.36 12 7.36z"/></svg>',
};

/* Ordem canônica do menu. `key` marca a página atual. */
export const NAV_ITEMS = [
  ['index.html', 'Início', 'home'],
  ['tratamentos.html', 'Tratamentos', 'tratamentos'],
  ['metodo-4d.html', 'Método 4D', 'metodo'],
  ['tricologia.html', 'Tricologia', 'tricologia'],
  ['sobre.html', 'Sobre', 'sobre'],
  ['podcast.html', 'Podcast', 'podcast'],
  ['blog.html', 'Blog', 'blog'],
  ['contato.html', 'Contato', 'contato'],
];

/* O ícone do WhatsApp abre o popup do formulário, como o botão flutuante já
   fazia. O aria-label segue a mesma convenção dele ("Falar no WhatsApp"),
   porque é o que o visitante entende ao ver o ícone. */
export function footerSocialHTML(indent = '            ') {
  const a = (href, label, icon, cls = '') =>
    `${indent}<a ${cls}href="${href}" target="_blank" rel="noopener" aria-label="${label}">${icon}</a>`;
  return [
    a(INSTAGRAM_URL, 'Instagram', ICON.instagram),
    a(FACEBOOK_URL, 'Facebook', ICON.facebook),
    a(YOUTUBE_URL, 'Canal no YouTube', ICON.youtube),
    `${indent}<a ${CTA_ATTRS} aria-label="Falar no WhatsApp">${ICON.whatsapp}</a>`,
    a(GOOGLE_REVIEW_URL, 'Avaliar no Google', ICON.google, 'class="footer__social--g" '),
  ].join('\n');
}

export function drawerSocialHTML(indent = '    ') {
  const a = (href, label, icon) =>
    `${indent}  <a href="${href}" target="_blank" rel="noopener" aria-label="${label}">${icon}</a>`;
  return [
    `${indent}<div class="drawer__social" aria-label="Redes sociais">`,
    a(INSTAGRAM_URL, 'Instagram', ICON.instagram),
    a(FACEBOOK_URL, 'Facebook', ICON.facebook),
    a(YOUTUBE_URL, 'Canal no YouTube', ICON.youtube),
    `${indent}  <a ${CTA_ATTRS} aria-label="Falar no WhatsApp">${ICON.whatsapp}</a>`,
    `${indent}</div>`,
  ].join('\n');
}

/* O número escrito também abre o formulário (decisão do cliente em 30/07/2026).
   Não sobra nenhum wa.me direto no rodapé. */
export function footerPhoneHTML() {
  return `<a ${CTA_ATTRS}>(51) 99970-4848</a>`;
}
