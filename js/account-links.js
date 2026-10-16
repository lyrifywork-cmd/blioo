import { hasSession, hasOnboarding } from './session.js';

// Ajusta chamadas de conta na landing quando já existe sessão:
// deslogado não muda nada; logado aponta tudo para o destino certo.
export function initAccountLinks(){
  if(!hasSession()) return;
  var dest = hasOnboarding() ? 'app/dashboard.html' : 'app/onboarding.html';
  document.querySelectorAll('a[href$="entrar.html"],a[href$="criar-conta.html"],a[href$="onboarding.html"]')
    .forEach(function(a){ a.setAttribute('href', dest); });
  var acts = document.querySelector('.acts');
  if(acts){
    var link = document.createElement('a');
    link.className = 'btn btn-main';
    link.setAttribute('href', dest);
    link.textContent = 'Ir para o painel';
    acts.innerHTML = '';
    acts.appendChild(link);
  }
}
