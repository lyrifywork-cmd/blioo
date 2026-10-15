export function initReveal(){
  var els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){
    els.forEach(function(el){el.classList.add('in');});
    return;
  }
  var rv=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.add('in');rv.unobserve(e.target);}
  });},{threshold:.12});
  els.forEach(function(el){rv.observe(el);});
}
