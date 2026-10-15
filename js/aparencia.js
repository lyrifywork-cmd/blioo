import { guardApp, paintIdentity } from './app.js';
import { loadData, saveData, THEMES } from './store.js';
import { createPreview, paintPreview } from './preview.js';

function $(id){ return document.getElementById(id); }

var state, preview;

function sync(){
  paintPreview(preview, state);
  saveData(state);
}

export function initAparencia(){
  if(!guardApp()) return;
  paintIdentity();
  state = loadData();
  preview = createPreview();
  $('preview-mount').appendChild(preview);
  document.querySelectorAll('input[name="tema"]').forEach(function(t){
    if(t.value === state.theme) t.checked = true;
    t.addEventListener('change', function(){
      var v = t.value;
      state.theme = THEMES.indexOf(v) > -1 ? v : 'essencial';
      sync();
    });
  });
  sync();
}

