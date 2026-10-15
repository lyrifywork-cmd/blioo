import { guardApp, paintIdentity } from './app.js';
import { loadData, saveData, fold, normalizeUrl, displayUrl, labelFromUrl, sanitizeHandle, MAX_LINKS, LABEL_MAX } from './store.js';
import { createPreview, paintPreview } from './preview.js';

function $(id){ return document.getElementById(id); }
function setText(node, text){ if(node) node.textContent = text; }

var el, state, preview;
var view = { q: '', filter: 'todos' };   // busca e filtro (não persistem)
var editingId = null;    // id do link em edição (apenas um por vez)
var draft = null;        // rascunho do editor aberto, preservado entre re-renderizações
var dragId = null;       // link sendo arrastado
var lastRemoved = null;  // { link, index } para o "Desfazer"
var toastTimer = null;

var TOAST_MS = 6000;

function sync(){
  paintPreview(preview, state);
  countLinks();
  saveData(state);
}

/* ------------------------------------------------------------------ */
/* Contadores, ferramentas e dica                                     */
/* ------------------------------------------------------------------ */
function isFiltered(){
  return view.q !== '' || view.filter !== 'todos';
}

function matches(l){
  if(l.isNew) return true;
  if(view.filter === 'ativos' && !l.active) return false;
  if(view.filter === 'desativados' && l.active) return false;
  if(view.q && fold(l.label + ' ' + l.url).indexOf(view.q) === -1) return false;
  return true;
}

function countLinks(){
  var list = state.links.filter(function(l){ return !l.isNew; });
  var n = list.length;
  var off = list.filter(function(l){ return !l.active; }).length;
  var offTxt = off + ' desativado' + (off > 1 ? 's' : '');
  setText(el.linksCount, n ? n + ' link' + (n > 1 ? 's' : '') + (off ? ' · ' + offTxt : '') : '');
  if(el.linksEmpty) el.linksEmpty.hidden = state.links.length > 0;
  if(el.tools) el.tools.hidden = n === 0;

  var totals = { todos: n, ativos: n - off, desativados: off };
  el.chipCounts.forEach(function(c){ setText(c, String(totals[c.getAttribute('data-count')] || 0)); });
  el.chips.forEach(function(c){
    c.setAttribute('aria-pressed', c.getAttribute('data-filter') === view.filter ? 'true' : 'false');
  });

  if(el.bulk){
    var vis = list.filter(matches);
    var anyOff = vis.some(function(l){ return !l.active; });
    setText(el.bulk, anyOff ? 'Ativar todos' : 'Desativar todos');
    el.bulk.disabled = vis.length === 0;
  }

  var hint = '';
  if(isFiltered()) hint = 'Limpe a busca e os filtros para reordenar os links.';
  else if(n > 1) hint = 'Arraste pelo ⠿ ou use as setas para reordenar.';
  setText(el.hint, hint);

  if(el.btnAdd) el.btnAdd.disabled = state.links.length >= MAX_LINKS;
}

/* ------------------------------------------------------------------ */
/* Lista de links (renderização a partir do estado)                   */
/* ------------------------------------------------------------------ */
function indexOf(id){
  for(var i = 0; i < state.links.length; i++){
    if(state.links[i].id === id) return i;
  }
  return -1;
}

function rowEl(id){
  return el.links.querySelector('.dlink[data-id="' + id + '"]');
}

function iconBtn(act, label, text){
  var b = document.createElement('button');
  b.className = 'icon-btn';
  b.type = 'button';
  b.setAttribute('data-act', act);
  b.setAttribute('aria-label', label);
  b.setAttribute('title', label);
  b.textContent = text;
  return b;
}

function buildEditor(link){
  var ed = document.createElement('div');
  ed.className = 'editor';
  ed.innerHTML =
    '<div class="field"><label for="e-label-' + link.id + '">Texto do link</label>' +
      '<input class="e-label" id="e-label-' + link.id + '" type="text" maxlength="' + LABEL_MAX + '" autocomplete="off" placeholder="Ex.: Meu portfólio"></div>' +
    '<div class="field"><label for="e-url-' + link.id + '">Endereço</label>' +
      '<input class="e-url" id="e-url-' + link.id + '" type="url" placeholder="https://…" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false"></div>' +
    '<span class="acts"></span>';
  var acts = ed.querySelector('.acts');
  acts.appendChild(iconBtn('save', 'Salvar', '✓'));
  acts.appendChild(iconBtn('cancel', 'Cancelar', '✕'));
  ed.querySelector('.e-label').value = draft ? draft.label : link.label;
  ed.querySelector('.e-url').value = draft ? draft.url : link.url;
  return ed;
}

function buildRow(link, i, total){
  var editing = editingId === link.id;
  var locked = isFiltered();
  var row = document.createElement('div');
  row.className = 'dlink' + (link.active ? '' : ' off') + (editing ? ' editing' : '');
  row.setAttribute('data-id', link.id);

  var grip = document.createElement('span');
  grip.className = 'grip';
  grip.setAttribute('aria-hidden', 'true');
  grip.textContent = '⠿';
  if(locked) grip.setAttribute('data-locked', '');
  row.appendChild(grip);

  if(!editing){
    var txt = document.createElement('span');
    txt.className = 'txt';
    var b = document.createElement('b');
    var s = document.createElement('small');
    b.textContent = link.label || 'Novo link';
    var shown = displayUrl(link.url) || 'Sem endereço';
    if(link.url && normalizeUrl(link.url) === link.url){
      var a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = shown;
      a.setAttribute('aria-label', 'Abrir ' + (link.label || 'link') + ' em nova aba');
      s.appendChild(a);
    }else{
      s.textContent = shown;
    }
    if(!link.active){
      var st = document.createElement('span');
      st.className = 'state';
      st.textContent = ' · Desativado';
      s.appendChild(st);
    }
    txt.appendChild(b);
    txt.appendChild(s);
    row.appendChild(txt);
  }

  var acts = document.createElement('span');
  acts.className = 'acts';
  var toggle = iconBtn('toggle', link.active ? 'Desativar link' : 'Ativar link', link.active ? '●' : '○');
  toggle.setAttribute('aria-pressed', link.active ? 'true' : 'false');
  var up = iconBtn('up', 'Mover link para cima', '↑');
  var down = iconBtn('down', 'Mover link para baixo', '↓');
  up.disabled = locked || i === 0;
  down.disabled = locked || i === total - 1;
  var dup = iconBtn('dup', 'Duplicar link', '⧉');
  dup.disabled = link.isNew || total >= MAX_LINKS;
  acts.appendChild(toggle);
  acts.appendChild(up);
  acts.appendChild(down);
  acts.appendChild(iconBtn('edit', 'Editar link', '✎'));
  acts.appendChild(dup);
  acts.appendChild(iconBtn('del', 'Remover link', '✕'));
  row.appendChild(acts);

  if(editing) row.appendChild(buildEditor(link));
  return row;
}

function captureDraft(){
  if(editingId === null) return;
  var row = rowEl(editingId);
  if(!row) return;
  var l = row.querySelector('.e-label');
  var u = row.querySelector('.e-url');
  if(l && u) draft = { label: l.value, url: u.value };
}

function renderList(){
  captureDraft(); // não perde o que a pessoa digitou se outra ação re-renderizar
  el.links.textContent = '';
  var frag = document.createDocumentFragment();
  var shown = 0;
  state.links.forEach(function(l, i){
    if(!(matches(l) || l.id === editingId)) return;
    shown++;
    frag.appendChild(buildRow(l, i, state.links.length));
  });
  el.links.appendChild(frag);
  if(el.noResult) el.noResult.hidden = !(state.links.length > 0 && shown === 0);
}

function restoreFocus(f){
  var target = null;
  if(f && f.id){
    var row = rowEl(f.id);
    if(row){
      target = row.querySelector('[data-act="' + f.act + '"]');
      if(target && target.disabled){
        var alt = { up: 'down', down: 'up' }[f.act] || 'edit';
        target = row.querySelector('[data-act="' + alt + '"]');
        if(target && target.disabled) target = row.querySelector('[data-act="edit"]');
      }
    }
  }
  if(!target) target = el.btnAdd;
  if(target && !target.disabled) target.focus();
}

function commit(focus){
  renderList();
  sync();
  if(focus) restoreFocus(focus);
}

// Apenas redesenha a lista (busca/filtro mudaram); não altera dados.
function refreshList(){
  renderList();
  countLinks();
}

function focusEditor(id){
  var row = rowEl(id);
  if(!row) return;
  var input = row.querySelector('.e-label');
  if(input){ input.focus(); input.select(); }
  row.scrollIntoView({ block: 'nearest' });
}

/* ------------------------------------------------------------------ */
/* Aviso temporário (toast) e "Desfazer"                              */
/* ------------------------------------------------------------------ */
function showToast(msg, undo){
  if(!el.toast) return;
  if(!undo) lastRemoved = null;
  setText(el.toastMsg, msg);
  el.toastUndo.hidden = !undo;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 6000);
}

function hideToast(){
  clearTimeout(toastTimer);
  if(el.toast) el.toast.hidden = true;
  lastRemoved = null;
}

function undoRemove(){
  if(!lastRemoved) return;
  var r = lastRemoved;
  hideToast();
  var at = Math.min(r.index, state.links.length);
  state.links.splice(at, 0, r.link);
  commit({ id: r.link.id, act: 'edit' });
}

/* ------------------------------------------------------------------ */
/* Edição                                                             */
/* ------------------------------------------------------------------ */
// Fecha o editor aberto descartando links novos que nunca foram salvos.
function closeEditor(){
  if(editingId === null) return;
  var i = indexOf(editingId);
  if(i > -1 && state.links[i].isNew) state.links.splice(i, 1);
  editingId = null;
  draft = null;
}

function openEditor(id){
  if(editingId === id) return;
  closeEditor();
  editingId = id;
  draft = null;
  commit(null);
  focusEditor(id);
}

function saveEditor(id){
  var i = indexOf(id);
  var row = rowEl(id);
  if(i < 0 || !row) return;
  var labelInput = row.querySelector('.e-label');
  var urlInput = row.querySelector('.e-url');
  var label = labelInput.value.trim();
  if(!label){
    labelInput.setCustomValidity('Dê um nome ao link.');
    labelInput.reportValidity();
    return;
  }
  var url = normalizeUrl(urlInput.value);
  if(!url){
    urlInput.setCustomValidity('Digite um endereço válido, como https://seusite.com');
    urlInput.reportValidity();
    return;
  }
  var link = state.links[i];
  link.label = label;
  link.url = url;
  link.isNew = false;
  editingId = null;
  draft = null;
  commit({ id: id, act: 'edit' });
}

function cancelEditor(id){
  closeEditor();
  commit({ id: id, act: 'edit' });
}

// Abre o editor completo para um link novo.
function addLink(){
  if(state.links.length >= MAX_LINKS) return;
  closeEditor();
  var l = { id: 'l' + Date.now().toString(36), label: '', url: '', active: true, isNew: true };
  state.links.push(l);
  editingId = l.id;
  draft = null;
  commit(null);
  focusEditor(l.id);
}

function resetFilters(){
  view.q = '';
  view.filter = 'todos';
  if(el.search) el.search.value = '';
}

// Adição rápida: cola o endereço, Enter, pronto. O nome é sugerido pelo domínio.
function onQuickSubmit(e){
  e.preventDefault();
  var raw = el.quickUrl.value.trim();
  if(!raw){ el.quickUrl.focus(); return; }
  if(state.links.length >= MAX_LINKS){
    setText(el.quickMsg, 'Você chegou ao limite de ' + MAX_LINKS + ' links.');
    return;
  }
  var url = normalizeUrl(raw);
  if(!url){
    setText(el.quickMsg, 'Endereço inválido. Tente algo como instagram.com/voce');
    el.quickUrl.focus();
    return;
  }
  closeEditor();
  resetFilters();
  var l = { id: 'l' + Date.now().toString(36), label: labelFromUrl(url), url: url, active: true, isNew: false };
  state.links.push(l);
  el.quickUrl.value = '';
  setText(el.quickMsg, '');
  commit(null);
  showToast('Link adicionado: ' + l.label + '. Toque no ✎ para renomear.');
  var row = rowEl(l.id);
  if(row) row.scrollIntoView({ block: 'nearest' });
  el.quickUrl.focus();
}

// Ativa ou desativa de uma vez todos os links que estão visíveis (respeita busca/filtro).
function bulkToggle(){
  var list = state.links.filter(function(l){ return !l.isNew && matches(l); });
  if(!list.length) return;
  var target = list.some(function(l){ return !l.active; });
  list.forEach(function(l){ l.active = target; });
  commit(null);
  var n = list.length;
  showToast(n + (n > 1 ? ' links ' : ' link ') + (target ? (n > 1 ? 'ativados' : 'ativado') : (n > 1 ? 'desativados' : 'desativado')) + '.');
}

/* ------------------------------------------------------------------ */
/* Eventos da lista (delegação)                                       */
/* ------------------------------------------------------------------ */
function onListClick(e){
  var btn = e.target.closest('[data-act]');
  if(!btn || !el.links.contains(btn) || btn.disabled) return;
  var row = btn.closest('.dlink');
  if(!row) return;
  var id = row.getAttribute('data-id');
  var i = indexOf(id);
  if(i < 0) return;
  var act = btn.getAttribute('data-act');

  if(act === 'toggle'){
    state.links[i].active = !state.links[i].active;
    commit({ id: id, act: 'toggle' });
  }else if(act === 'up' || act === 'down'){
    var j = act === 'up' ? i - 1 : i + 1;
    if(j < 0 || j >= state.links.length) return;
    var tmp = state.links[i];
    state.links[i] = state.links[j];
    state.links[j] = tmp;
    commit({ id: id, act: act });
  }else if(act === 'edit'){
    openEditor(id);
  }else if(act === 'dup'){
    var src = state.links[i];
    if(src.isNew || state.links.length >= MAX_LINKS) return;
    var copy = {
      id: 'l' + Date.now().toString(36),
      label: (src.label + ' (cópia)').slice(0, 40),
      url: src.url,
      active: src.active,
      isNew: false
    };
    state.links.splice(i + 1, 0, copy);
    commit({ id: copy.id, act: 'edit' });
    showToast('Link duplicado.');
  }else if(act === 'del'){
    var removed = state.links.splice(i, 1)[0];
    if(editingId === id){ editingId = null; draft = null; }
    var next = state.links[i] || state.links[i - 1];
    commit(next ? { id: next.id, act: 'edit' } : {});
    if(!removed.isNew){
      lastRemoved = { link: removed, index: i };
      showToast('Link removido.', true);
    }
  }else if(act === 'save'){
    saveEditor(id);
  }else if(act === 'cancel'){
    cancelEditor(id);
  }
}

function onListKey(e){
  if(e.isComposing) return;
  var input = e.target.closest && e.target.closest('.editor input');
  if(!input) return;
  var row = input.closest('.dlink');
  if(!row) return;
  var id = row.getAttribute('data-id');
  if(e.key === 'Enter'){
    e.preventDefault();
    saveEditor(id);
  }else if(e.key === 'Escape'){
    e.preventDefault();
    e.stopPropagation();
    cancelEditor(id);
  }
}

/* ------------------------------------------------------------------ */
/* Arrastar e soltar (mouse); setas continuam para teclado e toque    */
/* ------------------------------------------------------------------ */
function resetDraggable(){
  el.links.querySelectorAll('.dlink[draggable="true"]').forEach(function(r){ r.draggable = false; });
}

function clearDropMarks(){
  el.links.querySelectorAll('.drop-before,.drop-after').forEach(function(r){
    r.classList.remove('drop-before', 'drop-after');
  });
}

function endDrag(){
  dragId = null;
  clearDropMarks();
  el.links.querySelectorAll('.dragging').forEach(function(r){ r.classList.remove('dragging'); });
  resetDraggable();
}

function onPointerDown(e){
  var grip = e.target.closest('.grip');
  if(!grip || isFiltered() || editingId !== null) return;
  var row = grip.closest('.dlink');
  if(row) row.draggable = true;
}

function onDragStart(e){
  var row = e.target.closest('.dlink');
  if(!row || !row.draggable){ e.preventDefault(); return; }
  dragId = row.getAttribute('data-id');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
  row.classList.add('dragging');
}

function isAfter(row, e){
  var r = row.getBoundingClientRect();
  return e.clientY > r.top + r.height / 2;
}

function onDragOver(e){
  if(dragId === null) return;
  var row = e.target.closest('.dlink');
  if(!row) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  clearDropMarks();
  if(row.getAttribute('data-id') === dragId) return;
  row.classList.add(isAfter(row, e) ? 'drop-after' : 'drop-before');
}

function onDrop(e){
  if(dragId === null) return;
  var row = e.target.closest('.dlink');
  if(!row) return;
  e.preventDefault();
  var fromId = dragId;
  var toId = row.getAttribute('data-id');
  var after = isAfter(row, e);
  endDrag();
  if(fromId === toId) return;
  var from = indexOf(fromId);
  if(from < 0) return;
  var item = state.links.splice(from, 1)[0];
  var to = indexOf(toId);
  if(to < 0){ state.links.splice(from, 0, item); return; }
  state.links.splice(after ? to + 1 : to, 0, item);
  commit(null);
}

/* ------------------------------------------------------------------ */
/* Inicialização                                                      */
/* ------------------------------------------------------------------ */
export function initLinks(){
  if(!guardApp()) return;

  el = {
    links: $('dash-links'),
    btnAdd: $('btn-add-link'),
    linksCount: $('links-count'),
    linksEmpty: $('links-empty'),
    noResult: $('links-noresult'),
    tools: $('links-tools'),
    search: $('links-search'),
    chips: Array.prototype.slice.call(document.querySelectorAll('[data-filter]')),
    chipCounts: Array.prototype.slice.call(document.querySelectorAll('[data-count]')),
    bulk: $('btn-bulk'),
    hint: $('links-hint'),
    quickForm: $('quick-form'),
    quickUrl: $('quick-url'),
    quickMsg: $('quick-msg'),
    toast: $('links-toast'),
    toastMsg: $('toast-msg'),
    toastUndo: $('toast-undo')
  };
  if(!el.links) return;

  state = loadData();
  paintIdentity();

  var mount = $('preview-mount');
  preview = createPreview();
  mount.appendChild(preview);
  paintPreview(preview, state);

  /* lista */
  el.links.addEventListener('click', onListClick);
  el.links.addEventListener('keydown', onListKey);
  el.links.addEventListener('input', function(e){
    if(e.target.setCustomValidity) e.target.setCustomValidity('');
  });
  el.links.addEventListener('pointerdown', onPointerDown);
  el.links.addEventListener('pointerup', resetDraggable);
  el.links.addEventListener('dragstart', onDragStart);
  el.links.addEventListener('dragover', onDragOver);
  el.links.addEventListener('drop', onDrop);
  el.links.addEventListener('dragend', endDrag);

  /* adição, busca, filtros, ações em massa */
  if(el.btnAdd) el.btnAdd.addEventListener('click', addLink);
  if(el.quickForm) el.quickForm.addEventListener('submit', onQuickSubmit);
  if(el.quickUrl) el.quickUrl.addEventListener('input', function(){ setText(el.quickMsg, ''); });
  var btnEmptyAdd = $('btn-empty-add');
  if(btnEmptyAdd) btnEmptyAdd.addEventListener('click', function(){ if(el.quickUrl) el.quickUrl.focus(); });

  if(el.search){
    el.search.addEventListener('input', function(){
      view.q = fold(el.search.value).trim();
      refreshList();
    });
    el.search.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && el.search.value){
        e.preventDefault();
        el.search.value = '';
        view.q = '';
        refreshList();
      }
    });
  }
  el.chips.forEach(function(c){
    c.addEventListener('click', function(){
      view.filter = c.getAttribute('data-filter');
      refreshList();
    });
  });
  var btnClear = $('btn-clear-filters');
  if(btnClear) btnClear.addEventListener('click', function(){
    resetFilters();
    refreshList();
    if(el.search) el.search.focus();
  });
  if(el.bulk) el.bulk.addEventListener('click', bulkToggle);
  if(el.toastUndo) el.toastUndo.addEventListener('click', undoRemove);

  renderList();
  countLinks();
}

