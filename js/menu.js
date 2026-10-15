export function initMenu(){
  var b=document.body, btn=document.querySelector('.menu-btn');
  if(!btn)return;
  function set(o){b.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));btn.textContent=o?'Fechar':'Menu';}
  btn.addEventListener('click',function(){set(!b.classList.contains('open'));});
  var sheet=document.querySelector('.sheet');
  if(sheet)sheet.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});
}
