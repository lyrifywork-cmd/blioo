export function initCopy(){
  document.querySelectorAll('[data-copy]').forEach(function(c){
    var l=c.querySelector('span'),o=l.textContent,t;
    c.addEventListener('click',function(){
      var txt=c.getAttribute('data-copy');
      function done(ok){
        l.textContent=ok?'Link copiado ✓':'Não foi possível copiar';
        clearTimeout(t);
        t=setTimeout(function(){l.textContent=o;},2200);
      }
      if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){done(true);},function(){done(false);});}
      else{done(false);}
    });
  });
}
