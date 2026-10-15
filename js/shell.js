// js/shell.js — casca de navegação instantânea do painel.
// As páginas continuam arquivos separados; o clique no menu busca o HTML,
// troca só o <main>, atualiza título/histórico e monta o módulo da página.
// Sem JS ou se o fetch falhar, os links funcionam como navegação normal.

import { guardApp, paintIdentity } from './app.js';

var PAGES = {
  'dashboard.html': './dashboard.js',
  'links.html': './links.js',
  'aparencia.html': './aparencia.js',
  'configuracoes.html': './config.js'
};

function fileOf(url){
  return url.split('/').pop().split('?')[0].split('#')[0] || 'dashboard.html';
}

async function mountModule(file){
  var path = PAGES[file];
  if(!path) return;
  var m = await import(path);
  var fn = m.initDashboard || m.initLinks || m.initAparencia || m.initConfig;
  if(fn) fn();
}

async function navigate(url){
  var main = document.querySelector('main');
  if(main) main.setAttribute('aria-busy', 'true');
  var res;
  try{
    res = await fetch(url, { headers: { 'X-Requested-With': 'fetch' } });
  }catch(err){
    location.href = url;
    return;
  }
  if(!res.ok){ location.href = url; return; }
  var html = await res.text();
  var doc = new DOMParser().parseFromString(html, 'text/html');
  var next = doc.querySelector('main');
  if(!next){ location.href = url; return; }
  main.replaceWith(next);
  document.title = doc.title || document.title;
  history.pushState({}, '', url);
  window.scrollTo(0, 0);
  var h1 = next.querySelector('h1');
  if(h1){ h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  await mountModule(fileOf(url));
}

function wireNav(){
  document.addEventListener('click', function(e){
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var a = e.target.closest && e.target.closest('.dash-nav a');
    if(!a) return;
    var href = a.getAttribute('href');
    if(!href || href.charAt(0) === '#') return;
    if(fileOf(href) === fileOf(location.pathname)) return;
    e.preventDefault();
    navigate(href);
  });
  window.addEventListener('popstate', async function(){
    var file = fileOf(location.pathname);
    var res = await fetch(file);
    if(!res.ok) return;
    var html = await res.text();
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var next = doc.querySelector('main');
    if(!next) return;
    document.querySelector('main').replaceWith(next);
    document.title = doc.title || document.title;
    window.scrollTo(0, 0);
    await mountModule(file);
  });
}

export async function initShell(){
  if(!guardApp()) return;
  paintIdentity();
  wireNav();
  await mountModule(fileOf(location.pathname));
}

if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', initShell); }
else { initShell(); }
