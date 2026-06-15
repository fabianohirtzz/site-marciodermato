// Decide a próxima tela ('app' | 'login') a partir da tela atual e da presença
// de sessão. Retorna null quando nada muda — assim eventos benignos do Supabase
// (TOKEN_REFRESHED / SIGNED_IN disparados ao focar a aba via _recoverAndRefresh)
// não re-renderizam o app e não apagam o que o usuário está editando.
export function nextView(current, hasSession) {
  if (hasSession) return current === 'app' ? null : 'app';
  return current === 'login' ? null : 'login';
}
