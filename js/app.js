// js/app.js — casca compartilhada das telas do painel: guarda de acesso
// e identidade do cabeçalho. Cada página carrega este módulo + o seu.

import { hasSession, hasOnboarding } from './session.js';
import { loadData } from './store.js';

export function guardApp(){
  if(!hasSession()){ location.replace('entrar.html'); return false; }
  if(!hasOnboarding()){ location.replace('onboarding.html'); return false; }
  return true;
}

export function paintIdentity(){
  var data = loadData();
  var h = (data.handle || 'seunome').toLowerCase();
  var map = { 'dash-handle': h, 'dash-url': 'blioo.app/' + h, 'dash-url-2': 'blioo.app/' + h };
  Object.keys(map).forEach(function(id){
    var n = document.getElementById(id);
    if(n) n.textContent = map[id];
  });
  var av = document.getElementById('dash-avatar');
  if(av) av.textContent = h.charAt(0).toUpperCase() || 'B';
  var copy = document.getElementById('btn-copy');
  if(copy){
    copy.setAttribute('data-copy', 'https://blioo.app/' + h);
    var s = copy.querySelector('span');
    if(s) s.textContent = 'Copiar blioo.app/' + h;
  }
}
