import { escapeHtml, toast } from '../lib/ui.js';
import { POSTS_TABLE, DEFAULT_CATEGORY_COLOR } from '../config.js';
import { slugify } from '../lib/slug.js';
import { metaState, serp } from '../lib/seo.js';
import { buildPayload } from '../lib/post-payload.js';
import { uploadImage } from '../lib/upload.js';
import { fetchCategories } from '../lib/categories.js';
import { toLocalInputValue, fromLocalInputValue, resolveStatus } from '../lib/publish-date.js';

const SAVED_MSG = { published: 'Post publicado.', scheduled: 'Post agendado.', draft: 'Rascunho salvo.' };

// 23505 = slug duplicado. 23514 = violação de check constraint — hoje só pode
// ser status 'scheduled' rejeitado porque supabase/scheduled-marcio.sql ainda
// não rodou no banco; sem esta mensagem o admin só vê um erro genérico.
const ERROR_MESSAGES = {
  '23505': 'Já existe um post com esse slug.',
  '23514': 'O banco ainda não aceita posts agendados. Rode a migration supabase/scheduled-marcio.sql.',
};

export async function renderEditor(work, { supabase, id }) {
  let existing = null;
  if (id) {
    const { data, error } = await supabase.from(POSTS_TABLE).select('*').eq('id', id).single();
    if (error || !data) { toast('Post não encontrado.', 'err'); location.hash = '#/posts'; return; }
    existing = data;
  }

  const categories = await fetchCategories(supabase);
  const colorByName = new Map(categories.map(c => [c.name.toLowerCase(), c.color]));

  const tags = new Set(existing?.tags || []);
  let slugTouched = !!existing;
  let coverImage = existing?.cover_image || '';

  work.innerHTML = `
    <form id="editor" class="editor-grid">
      <section class="panel panel--pad">
        <p class="eyebrow">Conteúdo</p>
        <div class="field">
          <label class="field__label" for="f-title">Título</label>
          <input class="input" id="f-title" type="text" value="${escapeHtml(existing?.title || '')}" />
        </div>
        <div class="field">
          <span class="field__label">Texto</span>
          <div class="editor"><div id="quill"></div></div>
        </div>
        <div class="field">
          <span class="field__label">Imagem de capa</span>
          <div id="cover-slot"></div>
        </div>
      </section>

      <section class="panel panel--pad">
        <p class="eyebrow">Organização</p>
        <div class="field">
          <label class="field__label" for="f-cat">Categoria</label>
          <div class="cat-pick">
            <input class="input" id="f-cat" type="text" list="cat-list" placeholder="ex.: Cuidados com a Pele" value="${escapeHtml(existing?.category_name || '')}" />
            <input class="cat-pick__color" id="f-cat-color" type="color" value="${escapeHtml(existing?.category_color || DEFAULT_CATEGORY_COLOR)}" aria-label="Cor da categoria" />
          </div>
          <datalist id="cat-list">
            ${categories.map(c => `<option value="${escapeHtml(c.name)}"></option>`).join('')}
          </datalist>
          <p class="field__help">Digite uma categoria existente ou crie uma nova e escolha a cor.</p>
        </div>
        <div class="field">
          <span class="field__label">Tags</span>
          <div class="chips" id="chips">
            <input class="chips__input" id="chip-input" placeholder="Adicionar tag…" />
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="f-slug">Slug (URL)</label>
          <input class="input" id="f-slug" type="text" value="${escapeHtml(existing?.slug || '')}" />
          <p class="field__help">Mudar o endereço muda a URL e pode afetar o SEO.</p>
        </div>
        <div class="field">
          <label class="field__label" for="f-date">Data de publicação</label>
          <input class="input" id="f-date" type="datetime-local" value="${escapeHtml(toLocalInputValue(existing?.date))}" />
          <p class="field__help" id="date-help"></p>
        </div>
      </section>

      <section class="panel panel--pad">
        <p class="eyebrow">SEO</p>
        <div class="field">
          <label class="field__label" for="f-seotitle">Título de SEO</label>
          <input class="input" id="f-seotitle" type="text" value="${escapeHtml(existing?.seo_title || '')}" />
        </div>
        <div class="field">
          <label class="field__label" for="f-meta">Meta description</label>
          <textarea class="input" id="f-meta" rows="3">${escapeHtml(existing?.meta_description || '')}</textarea>
          <p class="field__help"><span class="counter" id="meta-count">0</span>/160 caracteres</p>
        </div>
        <div class="field">
          <label class="field__label" for="f-kw">Palavra-chave foco</label>
          <input class="input" id="f-kw" type="text" value="${escapeHtml(existing?.focus_keyword || '')}" />
        </div>
        <div class="field">
          <label class="field__label" for="f-excerpt">Resumo (excerpt)</label>
          <textarea class="input" id="f-excerpt" rows="2">${escapeHtml(existing?.excerpt || '')}</textarea>
        </div>
        <div class="serp" id="serp"></div>
      </section>

      <div class="editor-actions">
        <button class="btn btn--quiet" type="button" id="btn-preview">Ver prévia</button>
        <button class="btn btn--ghost" type="button" id="btn-draft">Salvar rascunho</button>
        <button class="btn btn--primary" type="button" id="btn-publish">Publicar</button>
      </div>
    </form>`;

  const quill = new window.Quill('#quill', {
    theme: 'snow',
    modules: { toolbar: [
      ['bold', 'italic'], [{ header: 2 }, { header: 3 }],
      [{ list: 'bullet' }], ['blockquote', 'link', 'image'],
    ] },
  });
  if (existing?.content) quill.clipboard.dangerouslyPasteHTML(existing.content);

  quill.getModule('toolbar').addHandler('image', () => pickImage(async (file) => {
    try {
      const url = await uploadImage(supabase, file);
      const range = quill.getSelection(true);
      quill.insertEmbed(range.index, 'image', url, 'user');
    } catch (e) { console.error('[upload imagem]', e); toast(`Falha no upload da imagem: ${e?.message || e}`, 'err'); }
  }));

  const $ = sel => work.querySelector(sel);
  const titleEl = $('#f-title'), slugEl = $('#f-slug'), catEl = $('#f-cat'), catColorEl = $('#f-cat-color');
  const dateEl = $('#f-date'), dateHelp = $('#date-help'), publishBtn = $('#btn-publish');
  const seoTitleEl = $('#f-seotitle'), metaEl = $('#f-meta'), excerptEl = $('#f-excerpt');

  titleEl.addEventListener('input', () => {
    if (!slugTouched) slugEl.value = slugify(titleEl.value);
    refreshSerp();
  });
  slugEl.addEventListener('input', () => { slugTouched = true; refreshSerp(); });
  dateEl.addEventListener('input', refreshPublishBtn);
  // Safari historicamente só dispara 'change' de forma confiável no seletor
  // nativo de datetime-local; 'input' sozinho pode deixar o rótulo desatualizado.
  dateEl.addEventListener('change', refreshPublishBtn);
  seoTitleEl.addEventListener('input', refreshSerp);
  excerptEl.addEventListener('input', refreshSerp);
  metaEl.addEventListener('input', () => { refreshMeta(); refreshSerp(); });
  // Ao digitar/escolher uma categoria já existente, herda a cor dela.
  catEl.addEventListener('input', () => {
    const hit = colorByName.get(catEl.value.trim().toLowerCase());
    if (hit) catColorEl.value = hit;
  });

  function refreshMeta() {
    const { count, level } = metaState(metaEl.value);
    const c = $('#meta-count'); c.textContent = count;
    c.style.color = level === 'over' ? 'var(--danger-ink)' : level === 'ok' ? 'var(--ok-ink)' : 'var(--tinta-muted)';
  }
  function refreshSerp() {
    const s = serp({ title: titleEl.value, slug: slugEl.value, seoTitle: seoTitleEl.value, metaDescription: metaEl.value, excerpt: excerptEl.value });
    $('#serp').innerHTML = `<span class="serp__url">${escapeHtml(s.url)}</span>
      <span class="serp__title">${escapeHtml(s.title)}</span>
      <span class="serp__desc">${escapeHtml(s.desc)}</span>`;
  }
  // O rótulo do botão sai da mesma função que decide o status gravado, então
  // o que está escrito no botão nunca diverge do que vai acontecer.
  function refreshPublishBtn() {
    // Campo limpo vira "agora" no envio (ver save()); repor o valor aqui evita
    // que o admin veja um campo vazio enquanto o rótulo já assume outra data.
    if (!dateEl.value) dateEl.value = toLocalInputValue();
    const agendado = resolveStatus('publish', fromLocalInputValue(dateEl.value)) === 'scheduled';
    publishBtn.textContent = agendado ? 'Agendar' : 'Publicar';
    dateHelp.textContent = agendado
      ? 'O post entra no ar sozinho nesse horário (com folga de até 30 minutos).'
      : 'Data no passado publica o post com essa data (retroativo).';
  }

  const chips = $('#chips'), chipInput = $('#chip-input');
  function drawChips() {
    chips.querySelectorAll('.chip').forEach(c => c.remove());
    [...tags].forEach(t => {
      const el = document.createElement('span');
      el.className = 'chip';
      el.innerHTML = `${escapeHtml(t)}<button type="button" class="chip__x" aria-label="Remover ${escapeHtml(t)}">×</button>`;
      el.querySelector('.chip__x').addEventListener('click', () => { tags.delete(t); drawChips(); });
      chips.insertBefore(el, chipInput);
    });
  }
  chipInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const v = chipInput.value.trim().replace(/,$/, '');
      if (v) { tags.add(v); chipInput.value = ''; drawChips(); }
    } else if (e.key === 'Backspace' && !chipInput.value && tags.size) {
      const last = [...tags].pop(); tags.delete(last); drawChips();
    }
  });
  drawChips();

  renderCover();
  function renderCover() {
    const slot = $('#cover-slot');
    if (coverImage) {
      slot.innerHTML = `<figure class="cover"><img class="cover__img" src="${escapeHtml(coverImage)}" alt="Prévia da capa" />
        <div class="cover__bar"><button class="btn btn--quiet" type="button" id="cover-change">Trocar</button>
        <button class="btn btn--danger" type="button" id="cover-remove">Remover</button></div></figure>`;
      slot.querySelector('#cover-remove').addEventListener('click', () => { coverImage = ''; renderCover(); });
      slot.querySelector('#cover-change').addEventListener('click', chooseCover);
    } else {
      slot.innerHTML = `<button type="button" class="dropzone" id="cover-pick">
        <span class="dropzone__t">Clique para enviar a capa</span>
        <span class="dropzone__hint">JPG ou PNG, 16:9 recomendado</span></button>`;
      slot.querySelector('#cover-pick').addEventListener('click', chooseCover);
    }
  }
  function chooseCover() {
    pickImage(async (file) => {
      try { coverImage = await uploadImage(supabase, file); renderCover(); }
      catch (e) { console.error('[upload capa]', e); toast(`Falha no upload da capa: ${e?.message || e}`, 'err'); }
    });
  }

  async function save(intent) {
    const form = {
      title: titleEl.value.trim(),
      slug: (slugEl.value.trim() || slugify(titleEl.value)),
      categoryName: catEl.value.trim(),
      categoryColor: catColorEl.value || DEFAULT_CATEGORY_COLOR,
      content: quill.root.innerHTML,
      excerpt: excerptEl.value.trim(),
      coverImage,
      metaDescription: metaEl.value.trim(),
      seoTitle: seoTitleEl.value.trim(),
      ogImage: existing?.og_image || coverImage,
      focusKeyword: $('#f-kw').value.trim(),
      tags: [...tags],
      // Campo limpo cai no agora: sem isso, buildPayload omitiria a chave e um
      // update preservaria a data futura já gravada, publicando com data errada.
      date: fromLocalInputValue(dateEl.value) || new Date().toISOString(),
      intent,
    };
    if (!form.title) { toast('Dê um título ao post.', 'err'); return; }
    if (!form.slug) { toast('O slug ficou vazio.', 'err'); return; }
    if (!form.categoryName) { toast('Escolha ou crie uma categoria.', 'err'); return; }
    const payload = buildPayload(form);

    let res;
    if (existing) res = await supabase.from(POSTS_TABLE).update(payload).eq('id', existing.id);
    else res = await supabase.from(POSTS_TABLE).insert(payload);

    if (res.error) {
      const msg = ERROR_MESSAGES[res.error.code] || 'Não deu para salvar.';
      toast(msg, 'err');
      return;
    }
    toast(SAVED_MSG[payload.status], 'ok');
    location.hash = '#/posts';
  }

  $('#btn-draft').addEventListener('click', () => save('draft'));
  $('#btn-publish').addEventListener('click', () => save('publish'));
  $('#btn-preview').addEventListener('click', () => openPreview(titleEl.value, quill.root.innerHTML, coverImage));

  refreshMeta(); refreshSerp(); refreshPublishBtn();
}

function pickImage(back) {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.addEventListener('change', () => { if (input.files[0]) back(input.files[0]); });
  input.click();
}

function openPreview(title, html, cover) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="modal" style="width:min(760px,100%);max-height:86vh;overflow:auto;text-align:left">
    ${cover ? `<img src="${escapeHtml(cover)}" alt="" style="width:100%;border-radius:var(--r-md);margin-bottom:16px" />` : ''}
    <h1 style="font-family:var(--font-display);font-weight:600;font-size:32px;margin:0 0 16px">${escapeHtml(title || 'Sem título')}</h1>
    <div class="editor__body" style="padding:0">${html}</div>
    <div class="modal__actions" style="margin-top:20px"><button class="btn btn--quiet" data-close>Fechar</button></div>
  </div>`;
  document.body.appendChild(ov);
  const close = () => ov.remove();
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.querySelector('[data-close]').addEventListener('click', close);
}
