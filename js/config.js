import { guardApp, paintIdentity } from './app.js';
import { loadData, saveData, sanitizeHandle } from './store.js';
import { logout, clearAll } from './session.js';

function $(id){ return document.getElementById(id); }

export function initConfig(){
  if(!guardApp()) return;
  paintIdentity();
  var data = loadData();

  var handle = $('identificador');
  handle.maxLength = 30;
  handle.value = data.handle || '';
  handle.addEventListener('input', function(){
    var clean = sanitizeHandle(handle.value);
    if(handle.value !== clean) handle.value = clean;
    data.handle = clean;
    saveData(data);
    paintIdentity();
  });
  handle.addEventListener('blur', function(){ saveData(data); });

  var btnOut = $('btn-logout');
  if(btnOut) btnOut.addEventListener('click', function(){
    saveData(data);
    logout();
    location.replace('index.html');
  });
  var btnDel = $('btn-danger');
  if(btnDel) btnDel.addEventListener('click', function(){
    if(confirm('Excluir sua conta, sua página e todos os dados? Essa ação não pode ser desfeita.')){
      clearAll();
      location.replace('index.html');
    }
  });
}

