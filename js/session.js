// js/session.js — única fonte de verdade sobre autenticação e estado do app.
// Chaves:
//   blioo.session          {email, at} — existe só quando alguém está logado
//   blioo.account          {email, handle, plan} — conta criada no cadastro
//   blioo.onboarding       'ok' — configuração do onboarding concluída
//   blioo.onboarding.data  {handle, theme, links} — conteúdo compartilhado entre onboarding e dashboard

export var KEY_SESSION = 'blioo.session';
export var KEY_ACCOUNT = 'blioo.account';
export var KEY_ONBOARD = 'blioo.onboarding';
export var KEY_DATA = 'blioo.onboarding.data';

export function read(key, fallback){
  try{
    var v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  }catch(e){ return fallback; }
}

export function write(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
}

export function hasSession(){ return !!read(KEY_SESSION, null); }
export function hasOnboarding(){ return read(KEY_ONBOARD, null) === 'ok'; }
export function logout(){ try{ localStorage.removeItem(KEY_SESSION); }catch(e){} }
export function clearAll(){
  try{
    localStorage.removeItem(KEY_SESSION);
    localStorage.removeItem(KEY_ACCOUNT);
    localStorage.removeItem(KEY_ONBOARD);
    localStorage.removeItem(KEY_DATA);
  }catch(e){}
}
