import { read, write, hasSession, hasOnboarding, KEY_ACCOUNT, KEY_SESSION, KEY_DATA } from './session.js';

// Telas de conta: criam sessão, validam acesso e rebatem quem já está logado.
// Sem JS, os formulários seguem o action como fallback.

var createForm = document.getElementById('form-criar');
var loginForm = document.getElementById('form-entrar');

function dest(){
  return hasOnboarding() ? 'dashboard.html' : 'onboarding.html';
}

if(createForm){
  if(hasSession()){ location.replace(dest()); }
  else{
    createForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = (createForm.querySelector('#email').value || '').trim().toLowerCase();
      var handle = (createForm.querySelector('#identificador') || {}).value || '';
      handle = handle.trim().toLowerCase() || 'seunome';
      write(KEY_ACCOUNT, { email: email, handle: handle, plan: 'grátis' });
      write(KEY_SESSION, { email: email, at: Date.now() });
      var data = read(KEY_DATA, null) || {};
      data.handle = handle;
      if(!data.links) data.links = [];
      if(!data.theme) data.theme = 'essencial';
      write(KEY_DATA, data);
      location.replace('onboarding.html');
    });
  }
}

function showError(msg){
  var box = document.getElementById('form-error');
  if(!box) return;
  box.textContent = msg;
  box.hidden = false;
  box.focus();
}

if(loginForm){
  if(hasSession()){ location.replace(dest()); }
  else{
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = (loginForm.querySelector('#email').value || '').trim().toLowerCase();
      var account = read(KEY_ACCOUNT, null);
      if(account && account.email === email && email){
        write(KEY_SESSION, { email: email, at: Date.now() });
        location.replace(dest());
      }else{
        showError('Não encontramos uma conta com esse e-mail. Confira o endereço ou crie sua conta.');
      }
    });
  }
}
