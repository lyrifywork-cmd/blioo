import { initCopy } from './copy.js';
import { read, write, hasSession, KEY_ONBOARD, KEY_DATA } from './session.js';

var panes, prog, actions, screen, nameEl, subEl, avEl, linksEl, rowsEl, handleInput, copyBtn, cur = 0, rowSeq = 0;

function initials(s){
  return (s || 'blioo').replace(/[^a-zA-Z0-9]/g, ' ').trim().split(/\s+/).slice(0, 2)
    .map(function(w){ return w.charAt(0).toUpperCase(); }).join('') || 'BL';
}

function rows(){
  return Array.prototype.slice.call(rowsEl.querySelectorAll('.link-row'));
}

function persist(){
  var data = {
    handle: (handleInput.value || '').trim().toLowerCase(),
    theme: (document.querySelector('input[name="tema"]:checked') || {}).value || 'essencial',
    links: rows().map(function(r){
      return {
        label: r.querySelector('.link-label').value.trim(),
        url: r.querySelector('.link-url').value.trim(),
        active: true
      };
    }).filter(function(l){ return l.label; })
  };
  write(KEY_DATA, data);
  return data;
}

function updatePreview(){
  var h = (handleInput.value || 'seunome').toLowerCase();
  nameEl.textContent = h;
  subEl.textContent = 'blioo.app/' + h;
  avEl.textContent = initials(h);
  linksEl.innerHTML = '';
  rows().forEach(function(r){
    var label = r.querySelector('.link-label').value.trim();
    if(!label) return;
    var a = document.createElement('div');
    a.className = 'lk';
    a.innerHTML = '<span></span><span aria-hidden="true">↗</span>';
    a.firstChild.textContent = label;
    linksEl.appendChild(a);
  });
  copyBtn.setAttribute('data-copy', 'https://blioo.app/' + h);
  copyBtn.querySelector('span').textContent = 'Copiar blioo.app/' + h;
  persist();
}

function checkHandle(){
  var tag = document.getElementById('disp');
  var v = handleInput.value.trim().toLowerCase();
  var taken = ['blioo', 'admin', 'login', 'app', 'suporte'];
  var ok = v.length >= 3 && taken.indexOf(v) === -1;
  tag.textContent = ok ? 'Disponível' : v ? 'Indisponível' : 'Escolha um nome';
  tag.className = 'tag' + (ok ? '' : ' soon');
}

function show(i){
  cur = Math.max(0, Math.min(i, panes.length - 1));
  panes.forEach(function(p, idx){ p.classList.toggle('active', idx === cur); });
  Array.prototype.forEach.call(prog.children, function(li, idx){
    li.setAttribute('data-state', idx < cur ? 'done' : idx === cur ? 'current' : 'pending');
  });
  actions.style.display = cur === panes.length - 1 ? 'none' : 'flex';
  var next = document.getElementById('btn-next');
  next.textContent = cur === panes.length - 2 ? 'Publicar página' : 'Próximo';
  if(cur === panes.length - 1){
    Array.prototype.forEach.call(prog.children, function(li){ li.setAttribute('data-state', 'done'); });
  }
  updatePreview();
}

function addRow(label, url){
  var n = ++rowSeq;
  var row = document.createElement('div');
  row.className = 'link-row';
  row.innerHTML =
    '<div class="field"><label for="lk-label-' + n + '">Texto do link</label>' +
    '<input class="link-label" id="lk-label-' + n + '" type="text" placeholder="Portfólio 2026" maxlength="40"></div>' +
    '<div class="field"><label for="lk-url-' + n + '">Endereço</label>' +
    '<input class="link-url" id="lk-url-' + n + '" type="url" placeholder="https://…" inputmode="url"></div>' +
    '<button class="link-del" type="button" aria-label="Remover link">✕</button>';
  row.querySelector('.link-label').value = label || '';
  row.querySelector('.link-url').value = url || '';
  row.querySelector('.link-del').addEventListener('click', function(){
    row.remove();
    updatePreview();
  });
  row.querySelector('.link-label').addEventListener('input', updatePreview);
  row.querySelector('.link-url').addEventListener('input', updatePreview);
  rowsEl.appendChild(row);
  return row;
}

function fromHash(){
  var m = (location.hash.match(/^#passo-(\d)$/) || [])[1];
  return m ? parseInt(m, 10) - 1 : 0;
}

export function initOnboarding(){
  if(!hasSession()){ location.replace('criar-conta.html'); return; }
  panes = Array.prototype.slice.call(document.querySelectorAll('.pane'));
  prog = document.querySelector('.prog');
  actions = document.querySelector('.onb-actions');
  screen = document.getElementById('screen');
  nameEl = document.getElementById('pv-name');
  subEl = document.getElementById('pv-sub');
  avEl = document.getElementById('pv-av');
  linksEl = document.getElementById('pv-links');
  rowsEl = document.getElementById('link-rows');
  handleInput = document.getElementById('identificador');
  copyBtn = document.getElementById('btn-copy');
  if(!panes.length || !rowsEl) return;

  document.getElementById('btn-next').addEventListener('click', function(){
    if(cur === 0){
      var v = handleInput.value.trim().toLowerCase();
      if(v.length < 3){ handleInput.focus(); return; }
    }
    if(cur === panes.length - 2){
      write(KEY_ONBOARD, 'ok');
      persist();
    }
    show(cur + 1);
  });
  document.getElementById('btn-back').addEventListener('click', function(){ show(cur - 1); });

  handleInput.addEventListener('input', function(){ checkHandle(); updatePreview(); });

  document.getElementById('btn-add-link').addEventListener('click', function(){
    var r = addRow('', '');
    r.querySelector('.link-label').focus();
    updatePreview();
  });

  document.querySelectorAll('input[name="tema"]').forEach(function(t){
    t.addEventListener('change', function(){
      screen.classList.remove('screen--estudio', 'screen--profissional');
      if(t.value === 'estudio') screen.classList.add('screen--estudio');
      if(t.value === 'profissional') screen.classList.add('screen--profissional');
      persist();
    });
  });

  var saved = read(KEY_DATA, null);
  if(saved && saved.handle){ handleInput.value = saved.handle; }
  if(saved && saved.links && saved.links.length){
    saved.links.forEach(function(l){ addRow(l.label, l.url); });
    var t = document.querySelector('input[name="tema"][value="' + (saved.theme || 'essencial') + '"]');
    if(t){ t.checked = true; }
  }else{
    addRow('Portfólio 2026', 'https://exemplo.com/portfolio');
    addRow('Loja de impressos', 'https://exemplo.com/loja');
  }

  var tv = document.querySelector('input[name="tema"]:checked');
  if(tv){
    screen.classList.remove('screen--estudio', 'screen--profissional');
    if(tv.value === 'estudio') screen.classList.add('screen--estudio');
    if(tv.value === 'profissional') screen.classList.add('screen--profissional');
  }

  initCopy();
  window.addEventListener('hashchange', function(){ show(fromHash()); });
  checkHandle();
  show(fromHash());
}

if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', initOnboarding); }
else { initOnboarding(); }
