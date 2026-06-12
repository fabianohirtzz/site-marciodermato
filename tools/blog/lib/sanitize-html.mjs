const KEEP = new Set([
  'p', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i',
  'blockquote', 'img', 'br',
]);
const UNWRAP = /<\/?(?:div|span|figure|figcaption|section|article|header|footer|main|table|tbody|tr|td|th|small|font)\b[^>]*>/gi;

export function sanitizeContent(html) {
  let s = String(html);

  // 1. Remover comentários, scripts e styles.
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');

  // 2. Normalizar headings fora da escala.
  s = s.replace(/<(\/?)h1\b[^>]*>/gi, '<$1h2>');
  s = s.replace(/<(\/?)h[4-6]\b[^>]*>/gi, '<$1h3>');

  // 3. Desembrulhar wrappers.
  s = s.replace(UNWRAP, '');

  // 4. Limpar atributos das tags mantidas (img conserva src absoluto + alt).
  s = s.replace(/<([a-z0-9]+)\b[^>]*>/gi, (full, tagRaw) => {
    const tag = tagRaw.toLowerCase();
    if (!KEEP.has(tag)) return full;
    if (tag === 'a') {
      const href = (full.match(/href\s*=\s*("([^"]*)"|'([^']*)')/i) || [])[0] || '';
      return href ? `<a ${href} target="_blank" rel="noopener">` : '<a>';
    }
    if (tag === 'img') {
      const src = (full.match(/src\s*=\s*"([^"]*)"/i) || [, ''])[1];
      const alt = (full.match(/alt\s*=\s*"([^"]*)"/i) || [, ''])[1];
      return `<img src="${src}" alt="${alt}" loading="lazy">`;
    }
    return `<${tag}>`;
  });
  s = s.replace(/<\/([a-z0-9]+)\b[^>]*>/gi, (full, tagRaw) => {
    const tag = tagRaw.toLowerCase();
    return KEEP.has(tag) ? `</${tag}>` : full;
  });

  // 5. Remover quaisquer tags fora da whitelist.
  s = s.replace(/<\/?([a-z0-9]+)\b[^>]*>/gi, (full, tagRaw) =>
    KEEP.has(tagRaw.toLowerCase()) ? full : '');

  // 6. Remover parágrafos/itens vazios.
  s = s.replace(/<p>(?:\s|&nbsp;)*<\/p>/gi, '');
  s = s.replace(/<li>(?:\s|&nbsp;)*<\/li>/gi, '');

  // 7. Colapsar espaços entre tags.
  s = s.replace(/>\s+</g, '><').trim();

  return s;
}
