(function(){
  var root=document.documentElement;
  var sys=function(){return window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'};
  var saved=null;try{saved=localStorage.getItem('sf-theme')}catch(e){}
  var apply=function(t){root.setAttribute('data-theme',t);
    document.querySelectorAll('.theme-toggle button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.set===t)})};
  apply(saved||sys());
  document.querySelectorAll('.theme-toggle button').forEach(function(b){b.addEventListener('click',function(){
    apply(b.dataset.set);try{localStorage.setItem('sf-theme',b.dataset.set)}catch(e){}})});
  var btn=document.getElementById('menuBtn'),nav=document.getElementById('nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}});
  }
  document.querySelectorAll('form.js-form').forEach(function(f){
    var msg=f.querySelector('.sent');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!f.checkValidity()){f.reportValidity();return}
      var key=f.dataset.key;
      var show=function(t,err){msg.textContent=t;msg.classList.toggle('err',!!err);msg.hidden=false};
      var fallback='Your message did not send. Please email contact@sound-furnishings.com or call Atomic at (828) 774-5024.';
      if(!key||key.indexOf('REPLACE')===0){show(fallback,true);return}
      var data=Object.fromEntries(new FormData(f).entries());
      data.access_key=key;
      data.subject='New question from sound-furnishings.com';
      data.from_name='Sound Furnishings website';
      var submit=f.querySelector('button[type=submit]');submit.disabled=true;
      fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json()})
        .then(function(j){if(j.success){f.reset();show('Thanks. We got your message and will get back to you soon.',false)}else{show(fallback,true)}})
        .catch(function(){show(fallback,true)})
        .then(function(){submit.disabled=false});
    });
  });
})();
