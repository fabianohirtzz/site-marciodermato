import { SITE_META_TABLE, PUBLISH_FN } from '../config.js';

// Estado puro do controle "Atualizar site" a partir do mt_site_meta.
export function publishUiState({ dirty, publishing } = {}) {
  if (publishing) return { flagVisible: false, btnLabel: 'Publicando…', btnDisabled: true };
  return { flagVisible: !!dirty, btnLabel: 'Atualizar site', btnDisabled: false };
}

// Lê o estado de publicação (linha única id=1). Tolera ausência (Fase 3 cria a tabela).
export async function fetchSiteMeta(supabase) {
  const { data, error } = await supabase
    .from(SITE_META_TABLE).select('dirty,publishing,last_published_at').eq('id', 1).single();
  if (error) return { dirty: false, publishing: false };
  return data;
}

// Invoca a Edge Function que dispara o rebuild (existe a partir da Fase 3).
export async function requestPublish(supabase) {
  const { data, error } = await supabase.functions.invoke(PUBLISH_FN, { body: {} });
  if (error) throw error;
  return data;
}
