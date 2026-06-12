// Limpa a saída do editor (Quill): tira classes ql-* e parágrafos vazios.
export function normalizeEditorHtml(html) {
  return String(html ?? '')
    .replace(/\s*class="[^"]*\bql-[^"]*"/g, '')
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .trim();
}
