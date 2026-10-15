// js/store.js — estado da página (handle, tema, links) compartilhado entre
// onboarding, dashboard e página pública. Única fonte: blioo.onboarding.data.

import { read, write, KEY_DATA } from './session.js';

export var THEMES = ['essencial', 'estudio', 'profissional'];
export var MAX_LINKS = 100;      // teto técnico de segurança (o plano Grátis é "ilimitado")
export var HANDLE_MAX = 30;
export var LABEL_MAX = 40;

export var DEFAULT_DATA = {
  handle: 'anasolano',
  theme: 'essencial',
  links: [
    { label: 'Portfólio 2026', url: 'https://anasolano.com/portfolio', active: true },
    { label: 'Loja de impressos', url: 'https://loja.anasolano.com', active: true },
    { label: 'Newsletter mensal', url: 'https://anasolano.com/news', active: false },
    { label: 'Agendar conversa', url: 'https://cal.com/anasolano', active: true }
  ]
};

var seq = 0;
export function newId(){ return 'l' + (++seq) + '-' + Date.now().toString(36); }

export function fold(s){
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function sanitizeHandle(v){
  return fold(v).replace(/[^a-z0-9._-]/g, '').slice(0, HANDLE_MAX);
}

// Devolve a URL normalizada (com https:// quando faltar) ou null se inválida.
export function normalizeUrl(raw){
  var s = String(raw || '').trim();
  if(!s) return null;
  if(!/^(https?:\/\/|mailto:|tel:)/i.test(s)){
    if(/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) return null; // ftp://, javascript:// etc.
    s = 'https://' + s.replace(/^\/+/, '');
  }
  var u;
  try{ u = new URL(s); }catch(err){ return null; }
  if(u.protocol === 'mailto:' || u.protocol === 'tel:') return s;
  if(u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if(u.hostname.indexOf('.') === -1 && u.hostname !== 'localhost') return null;
  return s;
}

export function displayUrl(u){
  return String(u || '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
}

// Sugere um nome a partir do endereço: instagram.com/voce -> "Instagram"
export function labelFromUrl(u){
  if(/^mailto:/i.test(u)) return 'E-mail';
  if(/^tel:/i.test(u)) return 'Telefone';
  try{
    var host = new URL(u).hostname.replace(/^www\./, '');
    var name = host.split('.')[0] || host;
    return (name.charAt(0).toUpperCase() + name.slice(1)).slice(0, LABEL_MAX);
  }catch(err){
    return 'Novo link';
  }
}

export function loadData(){
  var src = read(KEY_DATA, null);
  if(!src || typeof src !== 'object') return JSON.parse(JSON.stringify(DEFAULT_DATA));
  var list = Array.isArray(src.links) ? src.links : [];
  return {
    handle: typeof src.handle === 'string' && src.handle ? src.handle : DEFAULT_DATA.handle,
    theme: THEMES.indexOf(src.theme) > -1 ? src.theme : 'essencial',
    links: list
      .filter(function(l){ return l && typeof l === 'object'; })
      .slice(0, MAX_LINKS)
      .map(function(l){
        return {
          id: newId(),
          label: String(l.label || '').slice(0, LABEL_MAX),
          url: String(l.url || ''),
          active: l.active !== false,
          isNew: false
        };
      })
  };
}

export function saveData(data){
  write(KEY_DATA, {
    handle: data.handle,
    theme: data.theme,
    links: data.links.map(function(l){
      return { label: l.label, url: l.url, active: l.active };
    })
  });
}
