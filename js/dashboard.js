import { initCopy } from './copy.js';
import { guardApp, paintIdentity } from './app.js';
import { loadData } from './store.js';

function $(id){ return document.getElementById(id); }
function setText(node, text){ if(node) node.textContent = text; }

export function initDashboard(){
  if(!guardApp()) return;
  paintIdentity();
  var data = loadData();
  var list = data.links.filter(function(l){ return l && l.label; });
  var off = list.filter(function(l){ return !l.active; }).length;
  setText($('stat-links'), String(list.length - off));
  setText($('stat-off'), off ? ' · ' + off + ' desativado' + (off > 1 ? 's' : '') : '');
  initCopy();
}

