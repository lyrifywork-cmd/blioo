// js/preview.js — mockup da página do usuário. Mesma peça no onboarding,
// no painel e nas views com pré-visualização: criar uma vez, pintar sempre.

export function createPreview(){
  var fig = document.createElement('figure');
  fig.className = 'phone';
  fig.style.margin = '0 auto';
  fig.innerHTML =
    '<div class="screen">' +
      '<div class="av" aria-hidden="true"></div>' +
      '<h3></h3><p></p><div class="pl"></div>' +
    '</div>';
  return fig;
}

export function paintPreview(fig, data){
  if(!fig) return;
  var h = ((data && data.handle) || 'seunome').toLowerCase();
  var screen = fig.querySelector('.screen');
  screen.classList.remove('screen--estudio', 'screen--profissional');
  if(data && data.theme === 'estudio') screen.classList.add('screen--estudio');
  if(data && data.theme === 'profissional') screen.classList.add('screen--profissional');
  fig.querySelector('.av').textContent = h.charAt(0).toUpperCase() || 'B';
  fig.querySelector('h3').textContent = h;
  fig.querySelector('p').textContent = 'blioo.app/' + h;
  var box = fig.querySelector('.pl');
  box.innerHTML = '';
  ((data && data.links) || []).forEach(function(l){
    if(!l.label || l.active === false) return;
    var a = document.createElement('div');
    a.className = 'lk';
    a.innerHTML = '<span></span><span aria-hidden="true">↗</span>';
    a.firstChild.textContent = l.label;
    box.appendChild(a);
  });
}
