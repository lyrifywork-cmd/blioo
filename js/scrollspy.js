export function initScrollSpy(){
  var links=document.querySelectorAll('.nav a[data-spy]');
  if(!('IntersectionObserver' in window))return;
  var map={};
  links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  var spy=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting&&map[e.target.id]){
      links.forEach(function(l){l.removeAttribute('aria-current');});
      map[e.target.id].setAttribute('aria-current','true');
    }
  });},{rootMargin:'-35% 0px -55% 0px'});
  Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)spy.observe(s);});
}
