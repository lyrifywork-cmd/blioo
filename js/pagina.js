import { read, KEY_DATA } from './session.js';
import { initCopy } from './copy.js';

function $(id){ return document.getElementById(id); }

var FALLBACK = {
  handle: 'anasolano',
  theme: 'essencial',
  links: [
    { label: 'Portfólio 2026', url: 'https://anasolano.com/portfolio', active: true },
    { label: 'Loja de impressos', url: 'https://loja.anasolano.com', active: true },
    { label: 'Newsletter mensal', url: 'https://anasolano.com/news', active: false },
    { label: 'Agendar conversa', url: 'https://cal.com/anasolano', active: true }
  ]
};

export function initPagina(){
  var data = read(KEY_DATA, null) || FALLBACK;
  var h = (data.handle || 'seunome').toLowerCase();
  document.body.setAttribute('data-tema', data.theme || 'essencial');
  document.title = h + ' — Blioo';
  $('pg-av').textContent = h.charAt(0).toUpperCase() || 'B';
  $('pg-name').textContent = h;
  $('pg-url').textContent = 'blioo.app/' + h;

  var box = $('pg-links');
  box.innerHTML = '';
  (data.links || []).forEach(function(l){
    if(!l.label || l.active === false) return;
    var a = document.createElement('a');
    a.className = 'plink';
    a.href = l.url || '#';
    if(l.url){ a.target = '_blank'; a.rel = 'noopener'; }
    a.innerHTML = '<span></span><span aria-hidden="true">↗</span>';
    a.firstChild.textContent = l.label;
    box.appendChild(a);
  });

  var c = $('pg-copy');
  c.setAttribute('data-copy', 'https://blioo.app/' + h);
  c.querySelector('span').textContent = 'Copiar blioo.app/' + h;
  initCopy();
}

if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', initPagina); }
else { initPagina(); }
