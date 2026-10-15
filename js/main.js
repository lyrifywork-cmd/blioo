import { initMenu } from './menu.js';
import { initScrollSpy } from './scrollspy.js';
import { initReveal } from './reveal.js';
import { initCopy } from './copy.js';
import { initAccountLinks } from './account-links.js';

function boot(){
  initMenu();
  initScrollSpy();
  initReveal();
  initCopy();
  initAccountLinks();
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',boot);}
else{boot();}
