// Ponte entre o <input type="datetime-local"> (horário local do navegador) e o
// timestamptz do Supabase (ISO UTC), mais a regra que decide o status gravado.

const pad = n => String(n).padStart(2, '0');

// ISO/timestamptz -> "YYYY-MM-DDTHH:mm" no fuso local (valor do input).
export function toLocalInputValue(iso) {
  const d = new Date(iso ?? Date.now());
  const ok = Number.isNaN(d.getTime()) ? new Date() : d;
  return `${ok.getFullYear()}-${pad(ok.getMonth() + 1)}-${pad(ok.getDate())}` +
    `T${pad(ok.getHours())}:${pad(ok.getMinutes())}`;
}

// Valor do input -> ISO UTC. Vazio/inválido devolve '' para o chamador poder
// omitir a chave do payload em vez de gravar lixo.
export function fromLocalInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

// intent ('publish' | 'draft') + data escolhida -> status gravado em mt_posts.
// Data no futuro agenda; passado ou agora publica (inclusive retroativo).
export function resolveStatus(intent, dateIso, now = new Date()) {
  if (intent !== 'publish') return 'draft';
  const d = new Date(dateIso || NaN);
  if (Number.isNaN(d.getTime())) return 'published';
  return d.getTime() > new Date(now).getTime() ? 'scheduled' : 'published';
}
