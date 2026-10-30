(function(){
  "use strict";
  document.documentElement.classList.add('js');
  var root=document.body;
  if(document.querySelector('.subtreatment-hero')) root.classList.add('treatment-page');

  // Use a dedicated vertical video on mobile and the landscape version elsewhere.
  var responsiveVideoQuery=window.matchMedia('(max-width: 760px)');
  document.querySelectorAll('video[data-responsive-video]').forEach(function(video){
    video.addEventListener('playing',function(){
      video.style.removeProperty('opacity');
      video.style.removeProperty('transition');
      video.classList.add('is-ready');
    });
    function setVideoSource(){
      var source=responsiveVideoQuery.matches?video.getAttribute('data-mobile-src'):video.getAttribute('data-desktop-src');
      if(!source||video.getAttribute('src')===source) return;
      var wasPlaying=!video.paused;
      video.classList.remove('is-ready');
      video.style.transition='none';
      video.style.opacity='0';
      video.pause();
      video.setAttribute('src',source);
      video.load();
      if(wasPlaying||video.hasAttribute('autoplay')){
        var playPromise=video.play();
        if(playPromise) playPromise.catch(function(){});
      }
    }
    setVideoSource();
    if(responsiveVideoQuery.addEventListener){
      responsiveVideoQuery.addEventListener('change',setVideoSource);
    } else {
      responsiveVideoQuery.addListener(setVideoSource);
    }
  });

  // --- Analytics & Tag Management ---
  // Leave trackEvent in place as a no-op fallback; GTM reads dataLayer events directly.
  function trackEvent(name,params){ if(window.gtag) window.gtag('event',name,params||{}); }
  window.dataLayer=window.dataLayer||[];
  var SERVICE_BY_PAGE={
    'braces-orthodontics':'braces',
    'clear-aligners':'aligners',
    'ceramic-braces':'ceramic-braces',
    'implants':'implants',
    'night-guards-and-retainers':'night-guards-retainers',
    'teeth-whitening':'teeth-whitening',
    'ceramic-veneers':'ceramic-veneers',
    'composite-veneers':'composite-veneers',
    'zirconia-crowns':'zirconia-crowns',
    'metal-ceramic-crowns':'metal-ceramic-crowns',
    'full-metal-crowns':'full-metal-crowns',
    'ceramic-inlay-onlay':'inlay-onlay',
    'complete-dentures':'complete-dentures',
    'removable-partial-dentures':'partial-dentures',
    'root-canal-treatment':'root-canal',
    'composite-restoration':'composite-restoration',
    'post-and-core':'post-and-core',
    'pit-and-fissure-sealants':'fissure-sealants',
    'dental-prophylaxis':'prophylaxis',
    'dental-extractions':'extractions',
    'wisdom-tooth-extractions':'wisdom-extraction',
    'intraoral-xray':'intraoral-xray',
    'opg-xray':'opg-xray',
    'cbct-scan':'cbct',
    'braces-cost-delhi':'braces',
    'braces-for-kids-teens':'braces',
    'invisalign-cost-delhi':'aligners',
    'orthodontist-south-delhi':'braces'
  };
  function serviceName(){
    var p=location.pathname.toLowerCase();
    if(p.endsWith('/thank-you.html')){
      var requestedService=new URLSearchParams(location.search).get('service');
      if(requestedService) return requestedService;
    }
    var page=p.split('/').pop().replace(/\.html?$/,'');
    if(SERVICE_BY_PAGE[page]) return SERVICE_BY_PAGE[page];
    if(page&&page!=='index'&&page!=='contact'&&page!=='about') return page;
    return 'enquiry';
  }
  function clickPosition(a){
    if(location.pathname.toLowerCase().endsWith('/thank-you.html')) return 'thankyou';
    if(a.closest('header')) return 'header';
    if(a.closest('.subtreatment-hero,.hero')) return 'hero';
    if(a.closest('.cost-guidance')) return 'cost';
    if(a.closest('#fab')) return 'sticky';
    if(a.closest('footer')) return 'footer';
    return 'body';
  }
  function pushEvent(name,params){
    var eventData=params||{}; eventData.event=name; window.dataLayer.push(eventData);
  }
  // Persist Google click identifiers for 90 days and expose them to every enquiry form.
  (function(){
    var query=new URLSearchParams(location.search);
    ['gclid','wbraid','gbraid'].forEach(function(key){
      var value=query.get(key);
      if(value) document.cookie=key+'='+encodeURIComponent(value)+';path=/;max-age=7776000;SameSite=Lax';
    });
  }());
  function readCookie(name){
    var prefix=name+'=';
    return document.cookie.split(';').map(function(part){ return part.trim(); }).filter(function(part){ return part.indexOf(prefix)===0; }).map(function(part){ return decodeURIComponent(part.slice(prefix.length)); })[0]||'';
  }
  // Conversion events on WhatsApp and call actions
  document.addEventListener('click',function(e){
    var a=e.target.closest?e.target.closest('a'):null; if(!a) return;
    // T-2: Exclude form submits and .wa-submit from idle tap events
    if(a.closest('form')||a.classList.contains('wa-submit')) return;
    var href=a.getAttribute('href')||'';
    var type=a.getAttribute('data-cta-type')||(href.indexOf('wa.me')>-1?'whatsapp':href.indexOf('tel:')===0?'phone':'');
    if(!type) return;
    var location=a.getAttribute('data-cta-location')||clickPosition(a);
    pushEvent(type==='whatsapp'?'whatsapp_click':'phone_click',{
      cta_location:location,
      treatment_id:document.body.getAttribute('data-treatment-id')||serviceName(),
      page_path:window.location.pathname
    });
  },true);

  // year
  var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  // mobile menu & treatments accordion
  var mb=document.getElementById('menuBtn'), mm=document.getElementById('mobileMenu');
  if(mb&&mm){
    mb.setAttribute('aria-controls',mm.id);
    function setMobileMenu(open){
      mm.classList.toggle('open',open);
      document.body.classList.toggle('nav-open',open);
      mb.setAttribute('aria-expanded',open?'true':'false');
      mb.setAttribute('aria-label',open?'Close menu':'Open menu');
    }
    mb.addEventListener('click',function(){
      setMobileMenu(!mm.classList.contains('open'));
    });
    mm.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        setMobileMenu(false);
      });
    });
    window.addEventListener('resize',function(){
      if(window.innerWidth>1150) setMobileMenu(false);
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&mm.classList.contains('open')){
        setMobileMenu(false);
        mb.focus();
      }
    });
  }

  var mobileAccordion = mm && mm.querySelector('.mobile-treatments-accordion');
  var mtb = mobileAccordion && mobileAccordion.querySelector('.mobile-accord-btn');
  var mtc = mobileAccordion && mobileAccordion.querySelector('.mobile-accord-content');
  if(mtb&&mtc){
    mtb.setAttribute('aria-controls',mtc.id || 'mobileTreatmentsContent');
    function syncMobileAccordion(open){
      mtc.classList.toggle('open',open);
      mtb.classList.toggle('is-open',open);
      mtb.setAttribute('aria-expanded',open?'true':'false');
      mtc.setAttribute('aria-hidden',open?'false':'true');
    }
    syncMobileAccordion(mtb.getAttribute('aria-expanded')==='true');
    mtb.addEventListener('click',function(){
      syncMobileAccordion(mtb.getAttribute('aria-expanded')!=='true');
    });
  }

  // desktop mega-dropdown toggle & keyboard accessibility
  var tt=document.getElementById('treatmentsToggle');
  var hd=document.querySelector('.has-dropdown');
  if(tt&&hd){
    tt.addEventListener('click',function(e){
      if(window.innerWidth>1150){
        // On desktop, clicking can toggle or navigate to treatments.html if double clicked
        if(!hd.classList.contains('is-open')){
          e.preventDefault();
          hd.classList.add('is-open');
          tt.setAttribute('aria-expanded','true');
        }
      }
    });
    document.addEventListener('click',function(e){
      if(hd&&!hd.contains(e.target)){
        hd.classList.remove('is-open');
        tt.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&hd&&hd.classList.contains('is-open')){
        hd.classList.remove('is-open');
        tt.setAttribute('aria-expanded','false');
        tt.focus();
      }
    });
  }

  // consultation popup modal
  var consultModal=document.getElementById('consultModal');
  function openConsultModal(treatmentName){
    if(!consultModal) return;
    consultModal.classList.add('open');
    document.body.style.overflow='hidden';
    var svc=consultModal.querySelector('[name=service]');
    if(svc&&treatmentName){
      svc.value=treatmentName;
    }
    var firstInput=consultModal.querySelector('input:not([type=hidden])');
    if(firstInput) setTimeout(function(){ firstInput.focus(); }, 120);
  }
  function closeConsultModal(){
    if(!consultModal) return;
    consultModal.classList.remove('open');
    document.body.style.overflow='';
  }
  document.addEventListener('click',function(e){
    var trg=e.target.closest?e.target.closest('.trigger-consult-modal,[data-modal="consultation"],.trigger-book-modal'):null;
    if(trg){
      e.preventDefault();
      var tName=trg.getAttribute('data-treatment')||(document.querySelector('h1')?document.querySelector('h1').textContent.split(':')[0].trim():'');
      openConsultModal(tName);
      return;
    }
    if(e.target.closest&&e.target.closest('.modal-close')){
      e.preventDefault();
      closeConsultModal();
      return;
    }
    if(consultModal&&e.target===consultModal.querySelector('.modal-backdrop')){
      e.preventDefault();
      closeConsultModal();
      return;
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&consultModal&&consultModal.classList.contains('open')){
      closeConsultModal();
    }
  });

  // interactive Before & After tabs
  document.querySelectorAll('.ba-tab-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var wrap=btn.closest('.ba-gallery-wrap');
      if(!wrap) return;
      var targetId=btn.getAttribute('data-case');
      wrap.querySelectorAll('.ba-tab-btn').forEach(function(b){ b.classList.remove('active'); });
      wrap.querySelectorAll('.ba-case-card').forEach(function(c){ c.hidden=true; });
      btn.classList.add('active');
      var targetCase=wrap.querySelector('#'+targetId);
      if(targetCase) targetCase.hidden=false;
    });
  });

  // Reveal page sections and standalone cards as they enter view. Card contents
  // stay together; selected copy outside cards receives a short sibling stagger.
  var revealCards='.card,.review-card-item,.blog-article-card,.result-card,.member,.tech,.step,.val,.benefit-card,.suitability-card,.proc-step-card,.ba-case-card,.treatment-hero-card';
  document.querySelectorAll('main > section, main > article, '+revealCards).forEach(function(el){
    el.classList.add('reveal');
  });
  document.querySelectorAll('.reveal-img').forEach(function(el){
    if(!el.closest(revealCards)) el.classList.add('reveal');
  });
  document.querySelectorAll('.hero-left,.hero-right,.subtreatment-hero .hero-left,.subtreatment-hero .hero-right').forEach(function(el,index){
    el.classList.add('hero-entrance');
    el.style.setProperty('--hero-delay',index%2 ? '.1s' : '0s');
  });
  var textSelector='main h1,main h2,main h3,main p,main .eyebrow,main .btn';
  document.querySelectorAll(textSelector).forEach(function(el){
    if(el.closest(revealCards+',.hero-left,.hero-right,.subtreatment-hero .hero-left,.subtreatment-hero .hero-right')) return;
    el.classList.add('reveal-text');
  });
  var textStaggerCounts=new Map();
  document.querySelectorAll('.reveal-text').forEach(function(el){
    var parent=el.parentElement;
    var index=textStaggerCounts.get(parent)||0;
    el.style.setProperty('--d',Math.min(index*0.075,0.375)+'s');
    textStaggerCounts.set(parent,index+1);
  });
  document.querySelectorAll('main img').forEach(function(img){
    img.decoding='async';
    if(!img.closest('.hero,.subtreatment-hero,.page-hero,.brand,.foot-grid')) img.loading='lazy';
  });

  // Reveal on scroll, while leaving content already visible in the first viewport
  // readable immediately instead of hiding it until the observer's first tick.
  var revs=[].slice.call(document.querySelectorAll('.reveal, .reveal-text'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    revs.forEach(function(el){
      if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
      else io.observe(el);
    });
  } else { revs.forEach(function(el){el.classList.add('in');}); }

  // WhatsApp form wiring: handles standard booking & treatment-specific forms
  var LEAD_ENDPOINT=window.LEAD_ENDPOINT||'/api/public/queries';
  var SERVICE_OPTIONS=[
    {group:'Orthodontics',items:[['aligners','Invisalign & clear aligners'],['braces','Metal braces'],['ceramic-braces','Ceramic braces']]},
    {group:'Dental implants',items:[['implants','Dental implants']]},
    {group:'Cosmetic',items:[['teeth-whitening','Teeth whitening'],['ceramic-veneers','Ceramic veneers'],['composite-veneers','Composite veneers']]},
    {group:'Crowns & prosthetics',items:[['zirconia-crowns','Zirconia crowns'],['metal-ceramic-crowns','Metal ceramic crowns'],['full-metal-crowns','Full metal crowns'],['inlay-onlay','Inlay / onlay'],['complete-dentures','Complete dentures'],['partial-dentures','Partial dentures']]},
    {group:'General & preventive',items:[['root-canal','Root canal'],['composite-restoration','Composite restoration'],['post-and-core','Post and core'],['prophylaxis','Scaling & cleaning'],['fissure-sealants','Fissure sealants'],['night-guards-retainers','Night guards & retainers']]},
    {group:'Oral surgery',items:[['extractions','Tooth extraction'],['wisdom-extraction','Wisdom tooth extraction']]},
    {group:'Imaging',items:[['intraoral-xray','X-ray'],['opg-xray','OPG'],['cbct-scan','CBCT scan']]}
  ];

  function addHidden(form,name,value){
    var input=document.createElement('input');
    input.type='hidden';
    input.name=name;
    input.value=value||'';
    form.appendChild(input);
    return input;
  }

  function createLeadComponent(type,service,prefix,formClass){
    var component=document.createElement('div');
    component.className='ds-form';
    component.setAttribute('data-form',type);
    component.setAttribute('data-service',service);

    var form=document.createElement('form');
    form.className=formClass||(type==='quick'?'hero-quick-form glass':'form-fields');
    form.setAttribute('data-wa','');
    form.setAttribute('data-form-type',type);
    form.setAttribute('data-service',service);
    form.setAttribute('data-form-title',type==='quick'?'Quick Callback':'Consultation Request');
    form.setAttribute('novalidate','');
    addHidden(form,'form_type',type);
    addHidden(form,'service',service);
    addHidden(form,'gclid',readCookie('gclid'));
    addHidden(form,'page_url',location.pathname);
    addHidden(form,'submitted_at','');
    addHidden(form,'lead_id','');

    var trap=document.createElement('div');
    trap.className='ds-honeypot';
    trap.setAttribute('aria-hidden','true');
    trap.innerHTML='<label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
    form.appendChild(trap);

    var nameId=prefix+'_name',phoneId=prefix+'_phone';
    if(type==='quick'){
      form.insertAdjacentHTML('beforeend',
        '<div class="quick-title">Prefer we call you?</div>'+
        '<p class="quick-desc">Leave your name and number. We\'ll call you back the same day, during clinic hours.</p>'+
        '<div class="quick-fields">'+
          '<div class="field"><label for="'+nameId+'">Name *</label><input type="text" id="'+nameId+'" name="name" autocomplete="name" required placeholder="Your name"></div>'+
          '<div class="field"><label for="'+phoneId+'">Phone number *</label><input type="tel" id="'+phoneId+'" name="phone" autocomplete="tel" inputmode="numeric" maxlength="10" required placeholder="10-digit mobile number"></div>'+/* next field */
        '</div>'+
        '<button type="submit" class="btn btn-primary wa-submit">Request a callback</button>'+
        '<p class="privacy-note">We\'ll only use your number to contact you about this enquiry. <a href="privacy-policy.html">Privacy policy</a></p>');
    }else{
      form.insertAdjacentHTML('beforeend',
        '<h3>Book a consultation</h3>'+
        '<p class="bf-sub">Tell us what you need and when suits you. We\'ll confirm your slot by phone, usually the same day.</p>'+
        '<div class="field"><label for="'+nameId+'">Name *</label><input type="text" id="'+nameId+'" name="name" autocomplete="name" required placeholder="Your name"></div>'+
        '<div class="field"><label for="'+phoneId+'">Phone number *</label><input type="tel" id="'+phoneId+'" name="phone" autocomplete="tel" inputmode="numeric" maxlength="10" required placeholder="10-digit mobile number"></div>'+/* next field */
        '<div class="field"><label for="'+prefix+'_email">Email (optional)</label><input type="email" id="'+prefix+'_email" name="email" autocomplete="email" placeholder="you@example.com"></div>'+
        '<div class="field"><label for="'+prefix+'_treatment">What are you looking for? *</label><select id="'+prefix+'_treatment" name="treatment" required></select></div>'+
        '<div class="field"><label for="'+prefix+'_availability">When suits you? *</label><select id="'+prefix+'_availability" name="availability" required>'+
          '<option value="">Choose a time</option>'+
          '<option value="As soon as possible">As soon as possible</option>'+
          '<option value="Weekday morning (10am–1pm)">Weekday morning (10am–1pm)</option>'+
          '<option value="Weekday afternoon (1pm–6pm)">Weekday afternoon (1pm–6pm)</option>'+
          '<option value="Saturday">Saturday</option>'+
        '</select></div>'+
        '<div class="field"><label for="'+prefix+'_message">Anything you\'d like us to know? (optional)</label><textarea id="'+prefix+'_message" name="message" rows="2" placeholder="Your question or concern"></textarea></div>'+
        '<button type="submit" class="btn btn-primary wa-submit">Book a consultation</button>'+
        '<p class="privacy-note">No payment is taken online. We\'ll only use your details to contact you about this enquiry. <a href="privacy-policy.html">Privacy policy</a></p>');
      var treatmentSelect=form.querySelector('[name=treatment]');
      SERVICE_OPTIONS.forEach(function(group){
        var optgroup=document.createElement('optgroup');
        optgroup.label=group.group;
        group.items.forEach(function(item){
          var option=document.createElement('option');
          option.value=item[0];
          option.textContent=item[1];
          option.selected=item[0]===service;
          optgroup.appendChild(option);
        });
        treatmentSelect.appendChild(optgroup);
      });
      var other=document.createElement('option');
      other.value='something-else';
      other.textContent='Something else / not sure';
      other.selected=!SERVICE_OPTIONS.some(function(group){return group.items.some(function(item){return item[0]===service;});});
      treatmentSelect.appendChild(other);
    }

    component.appendChild(form);
    return component;
  }

  function wireBriefForm(form){
    if(!form) return;
    var button=form.querySelector('.wa-submit,button[type=submit],.btn-primary');
    if(!button) return;
    if(!form.querySelector('[name=consent]')){
      var consentWrap=document.createElement('div');
      consentWrap.className='field';
      consentWrap.innerHTML='<label class="lead-consent"><input type="checkbox" name="consent" value="1" required> I agree that Dental Specialities may use my details to respond to this enquiry. <a href="privacy-policy.html">Privacy policy</a></label>';
      consentWrap.querySelector('input').id='lead_consent_'+document.querySelectorAll('[name=consent]').length;
      button.parentNode.insertBefore(consentWrap,button);
    }
    var status=form.querySelector('.ds-form-status');
    if(!status){
      status=document.createElement('p');
      status.className='ds-form-status';
      status.setAttribute('role','status');
      status.setAttribute('aria-live','polite');
      button.parentNode.insertBefore(status,button.nextSibling);
    }
    var firstFocusAt=0;
    form.addEventListener('focusin',function(){if(!firstFocusAt) firstFocusAt=Date.now();});
    var gclidInput=form.querySelector('[name=gclid]');
    if(gclidInput) gclidInput.value=readCookie('gclid');

    function errorFor(input,message){
      var field=input.closest('.field')||input.parentNode;
      var errorId=input.id+'_error';
      var error=field.querySelector('#'+errorId);
      if(!error){
        error=document.createElement('span');
        error.id=errorId;
        error.className='field-error';
        error.setAttribute('role','alert');
        field.appendChild(error);
      }
      error.textContent=message;
      input.setAttribute('aria-invalid','true');
      var ids=(input.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
      if(ids.indexOf(errorId)===-1) ids.push(errorId);
      input.setAttribute('aria-describedby',ids.join(' '));
    }

    function clearError(input){
      var error=document.getElementById(input.id+'_error');
      if(error) error.remove();
      input.removeAttribute('aria-invalid');
      var ids=(input.getAttribute('aria-describedby')||'').split(/\s+/).filter(function(id){return id&&id!==input.id+'_error';});
      if(ids.length) input.setAttribute('aria-describedby',ids.join(' '));
      else input.removeAttribute('aria-describedby');
    }

    function cleanPhone(raw){
      var value=(raw||'').replace(/[\s\-()]/g,'');
      if(value.length>10&&/^\+?91/.test(value)) value=value.replace(/^\+?91/,'');
      else if(value.length>10&&/^0/.test(value)) value=value.slice(1);
      return value;
    }

    function validateField(input){
      var value=input.value.trim();
      if(input.type==='checkbox'&&input.required&&!input.checked){
        errorFor(input,'Please agree to the privacy notice before submitting.');
        return false;
      }else if(input.name==='phone'){
        if(!/^[6-9]\d{9}$/.test(cleanPhone(value))){
          errorFor(input,'Please enter a 10-digit mobile number.');
          return false;
        }
      }else if(input.required&&!value){
        errorFor(input,input.name==='name'?'Please enter your name.':'Please choose an option.');
        return false;
      }else if(input.type==='email'&&value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
        errorFor(input,'Please enter a valid email address.');
        return false;
      }
      clearError(input);
      return true;
    }

    form.querySelectorAll('input,select,textarea').forEach(function(input){
      input.addEventListener('input',function(){clearError(input);});
      input.addEventListener('change',function(){clearError(input);});
      if(input.name==='phone') input.addEventListener('blur',function(){if(input.value.trim()) validateField(input);});
    });

    function validate(){
      var valid=true,firstInvalid=null;
      form.querySelectorAll('input[required],select[required],textarea[required],input[type=email]').forEach(function(input){
        if(!validateField(input)){valid=false;if(!firstInvalid) firstInvalid=input;}
      });
      if(firstInvalid) firstInvalid.focus();
      return valid;
    }

    function submitLead(event){
      if(event) event.preventDefault();
      if(button.disabled) return;
    var trap=form.querySelector('[name=website],[name=_hp]');
    var elapsed=firstFocusAt ? Date.now()-firstFocusAt : Infinity;
    var minimumSubmitTime=(form.getAttribute('data-form-type')==='quick_enquiry') ? 1500 : 3000;
    if((trap&&trap.value)||elapsed<minimumSubmitTime){
      if(!(trap&&trap.value)) console.warn('Lead form submission rejected by the timing check.',{formType:form.getAttribute('data-form-type')||'consultation',elapsed:elapsed});
        var spamType=form.getAttribute('data-form-type')||'consultation';
        var spamService=form.getAttribute('data-service')||serviceName();
        window.location.href='thank-you.html?type='+encodeURIComponent(spamType)+'&service='+encodeURIComponent(spamService);
        return;
      }
      if(!validate()) return;

      var type=form.getAttribute('data-form-type')||'consultation';
      var service=form.getAttribute('data-service')||serviceName();
      var nameInput=form.querySelector('[name=name]');
      var phoneInput=form.querySelector('[name=phone]');
      var emailInput=form.querySelector('[name=email]');
      var name=nameInput?nameInput.value.trim():'';
      var phone=phoneInput?cleanPhone(phoneInput.value):'';
      if(phoneInput) phoneInput.value=phone;
      var email=emailInput?emailInput.value.trim().toLowerCase():'';
      var leadId=(window.crypto&&crypto.randomUUID&&crypto.randomUUID())||(String(Date.now())+'-'+Math.random().toString(36).slice(2,10));
      var now=new Date();
      var submittedTime=new Date(now.getTime()+330*60000).toISOString().replace('Z','+05:30');
      var submittedInput=form.querySelector('[name=submitted_at]');
      var leadIdInput=form.querySelector('[name=lead_id]');
      var pageUrlInput=form.querySelector('[name=page_url]');
      if(submittedInput) submittedInput.value=submittedTime;
      if(leadIdInput) leadIdInput.value=leadId;
      if(pageUrlInput) pageUrlInput.value=location.pathname;
      var preferredInput=form.querySelector('[name=availability]');
      var messageInput=form.querySelector('[name=message]');
      var selectedTreatment=form.querySelector('[name=treatment]');
      var message=messageInput?messageInput.value.trim():'';
      if(selectedTreatment&&selectedTreatment.value){
        message=(message?message+'\n':'')+'Treatment selected: '+selectedTreatment.options[selectedTreatment.selectedIndex].text;
      }
      var payload={
        timestamp:submittedTime,
        lead_id:leadId,
        form_type:type,
        service:service,
        name:name,
        consent:form.querySelector('[name=consent]').checked,
        website:trap?trap.value:'',
        lastName:name.split(/\s+/).slice(1).join(' '),
        phone:phone,
        email:email,
        preferred_time:preferredInput?preferredInput.value:'',
        appointmentTime:preferredInput?preferredInput.value:'',
        treatmentInterest:selectedTreatment&&selectedTreatment.value
          ?selectedTreatment.options[selectedTreatment.selectedIndex].text:service,
        source:type==='quick'?'Website Callback Request':'Website Consultation Request',
        campaign:location.pathname+(readCookie('gclid')?' · Google Ads':''),
        message:message,
        gclid:readCookie('gclid')||(gclidInput?gclidInput.value:''),
        wbraid:readCookie('wbraid'),
        gbraid:readCookie('gbraid'),
        page_url:location.pathname
      };
      var enhancedData={phone_number:'+91'+phone};
      if(email) enhancedData.email=email;
      var firstName=name?name.split(/\s+/)[0]:'';
      var endpoint=window.LEAD_ENDPOINT||LEAD_ENDPOINT;
      var buttonLabel=button.textContent;
      button.disabled=true;
      button.setAttribute('aria-busy','true');
      button.innerHTML='<span class="ds-spinner" aria-hidden="true"></span> Sending…';
      status.textContent='';

      function complete(){
        try{
          sessionStorage.setItem('dentalLeadName',firstName);
          sessionStorage.setItem('ds_lead',JSON.stringify({
            type:type,
            service:service,
            treatment_id:selectedTreatment?selectedTreatment.value:'',
            form_page_path:location.pathname,
            lead_id:leadId,
            enhanced_conversion_data:enhancedData
          }));
        }catch(error){
          console.error('Unable to store lead conversion details.',error);
        }
        window.location.href='/thank-you.html?type='+encodeURIComponent(type)+'&service='+encodeURIComponent(service);
      }

      fetch(endpoint,{
          method:'POST',
          credentials:'same-origin',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        }).then(function(response){
          return response.json().catch(function(){
            throw new Error('The lead server returned an invalid response.');
          }).then(function(result){
            if(!response.ok||!result.success) throw new Error(result.message||'Unable to save your enquiry.');
            return result;
          });
        }).then(function(){
          complete();
        }).catch(function(error){
          console.error('Lead delivery request failed.',error);
          status.textContent='We could not record your enquiry right now. Please try again or call us at +91 98115 04048.';
          button.disabled=false;
          button.removeAttribute('aria-busy');
          button.textContent=buttonLabel;
        });
    }

    form.addEventListener('submit',submitLead);
    if(button.tagName==='A') button.addEventListener('click',submitLead);
  }

  function installBriefLeadForms(){
    var hero=document.querySelector('.subtreatment-hero');
    var heroLeft=hero&&hero.querySelector('.hero-left');
    var heading=hero&&hero.querySelector('h1');
    var main=document.querySelector('main');
    if(heroLeft&&heading&&main){
      var page=location.pathname.split('/').pop().replace(/\.html?$/i,'');
      var service=SERVICE_BY_PAGE[page]||page;
      var prefix=page.replace(/[^a-z0-9_-]/gi,'_');
      heroLeft.querySelectorAll('.hero-quick-form,.ds-form[data-form=quick]').forEach(function(form){form.remove();});
      main.querySelectorAll('.booking-inline-section').forEach(function(section){section.remove();});

      var quickComponent=createLeadComponent('quick',service,'quick_'+prefix);
      quickComponent.querySelector('form').setAttribute('data-form-title','Quick Callback - '+heading.textContent.replace(/\s+/g,' ').trim());
      var heroCta=heroLeft.querySelector('.hero-cta');
      function positionQuickForm(){
        if(heroCta&&heroCta.parentNode) heroCta.parentNode.insertBefore(quickComponent,heroCta.nextSibling);
        else heroLeft.appendChild(quickComponent);
      }
      positionQuickForm();

      var bookingSection=document.createElement('section');
      bookingSection.className='booking-inline-section';
      bookingSection.id='book';
      var wrap=document.createElement('div');
      wrap.className='wrap';
      wrap.style.maxWidth='720px';
      var card=document.createElement('div');
      card.className='form-card glass form-treatment-specific';
      card.innerHTML='<span class="badge-form">Priority Consultation</span>';
      var consultation=createLeadComponent('consultation',service,'book_'+prefix);
      consultation.querySelector('form').setAttribute('data-form-title','Consultation Request - '+heading.textContent.replace(/\s+/g,' ').trim());
      card.appendChild(consultation);
      wrap.appendChild(card);
      bookingSection.appendChild(wrap);

      // #cost is the definitive cost section. Some pages also use cost-guidance
      // for an earlier informational block, which must not receive Form B.
      var cost=main.querySelector('#cost')||main.querySelector('.cost-guidance');
      var faq=null;
      main.querySelectorAll('section').forEach(function(candidate){
        if(!faq&&/frequently asked questions|faqs/i.test(candidate.textContent.slice(0,500))) faq=candidate;
      });
      if(cost&&cost.parentNode) cost.parentNode.insertBefore(bookingSection,cost.nextSibling);
      else if(faq&&faq.parentNode) faq.parentNode.insertBefore(bookingSection,faq);
      else main.appendChild(bookingSection);

      document.querySelectorAll('.trigger-consult-modal,[data-modal="consultation"],.trigger-book-modal').forEach(function(control){
        var link=document.createElement('a');
        Array.prototype.slice.call(control.attributes).forEach(function(attribute){
          if(attribute.name!=='type'&&attribute.name!=='data-modal'&&attribute.name!=='data-treatment'&&attribute.name!=='data-location'){
            if(attribute.name==='class'){
              var classes=attribute.value.split(/\s+/).filter(function(name){return name!=='trigger-consult-modal'&&name!=='trigger-book-modal';});
              if(classes.length) link.setAttribute('class',classes.join(' '));
            }else link.setAttribute(attribute.name,attribute.value);
          }
        });
        link.href='#book';
        link.innerHTML=control.innerHTML;
        control.parentNode.replaceChild(link,control);
      });
      document.querySelectorAll('a[href="contact.html#book"],a[href="contact.html#book-consultation"]').forEach(function(link){link.href='#book';});
      var modal=document.getElementById('consultModal');
      if(modal) modal.remove();
    }

    var contactForm=document.getElementById('contactForm');
    if(contactForm){
      var contactComponent=createLeadComponent('consultation','general','contact','form-fields');
      contactComponent.classList.add('book-form','glass','reveal');
      contactComponent.querySelector('form').setAttribute('data-form-title','Contact Consultation Request');
      contactForm.parentNode.replaceChild(contactComponent,contactForm);
      document.querySelectorAll('.trigger-consult-modal,[data-modal="consultation"],.trigger-book-modal').forEach(function(control){
        var link=document.createElement('a');
        Array.prototype.slice.call(control.attributes).forEach(function(attribute){
          if(attribute.name!=='type'&&attribute.name!=='data-modal'&&attribute.name!=='data-treatment'&&attribute.name!=='data-location'){
            if(attribute.name==='class'){
              var classes=attribute.value.split(/\s+/).filter(function(name){return name!=='trigger-consult-modal'&&name!=='trigger-book-modal';});
              if(classes.length) link.setAttribute('class',classes.join(' '));
            }else link.setAttribute(attribute.name,attribute.value);
          }
        });
        link.href='#book';
        link.innerHTML=control.innerHTML;
        control.parentNode.replaceChild(link,control);
      });
      var contactModal=document.getElementById('consultModal');
      if(contactModal) contactModal.remove();
    }
  }

  installBriefLeadForms();
  document.querySelectorAll('form[data-wa]').forEach(wireBriefForm);

  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  // hero background video: hold on the poster frame if the viewer prefers reduced motion
  var hv=document.querySelector('.hero-video');
  if(hv && reduce){ hv.removeAttribute('autoplay'); try{hv.pause();}catch(e){} }

  // Keep lightweight scroll UI in one animation frame. This avoids repeated style
  // work when a trackpad or touch scroll generates many events in a single frame.
  var bar=document.createElement('div');bar.className='progress';document.body.appendChild(bar);
  var fab=document.getElementById('fab'),scrollUiQueued=false;
  function updateScrollUi(){
    scrollUiQueued=false;
    var h=document.documentElement,sc=h.scrollTop||document.body.scrollTop;
    var max=(h.scrollHeight-h.clientHeight)||1;
    bar.style.width=(sc/max*100)+'%';
    if(fab) fab.classList.toggle('show',sc>380);
  }
  function requestScrollUi(){if(!scrollUiQueued){scrollUiQueued=true;requestAnimationFrame(updateScrollUi);}}
  addEventListener('scroll',requestScrollUi,{passive:true});
  addEventListener('resize',requestScrollUi,{passive:true});
  updateScrollUi();

  // scroll parallax (transform-only, rAF-throttled, motion-safe)
  var pxEls=[].slice.call(document.querySelectorAll('[data-parallax]'));
  if(!reduce && pxEls.length && matchMedia('(min-width:641px)').matches){
    var pxTick=false;
    function pxRun(){
      var vh=window.innerHeight;
      pxEls.forEach(function(el){
        var r=el.getBoundingClientRect();
        var speed=parseFloat(el.getAttribute('data-parallax'))||0.08;
        var sc=el.getAttribute('data-parallax-scale')||'1';
        var off=((r.top+r.height/2)-vh/2)*-speed;
        el.style.transform='translate3d(0,'+off.toFixed(1)+'px,0) scale('+sc+')';
      });
      pxTick=false;
    }
    addEventListener('scroll',function(){if(!pxTick){requestAnimationFrame(pxRun);pxTick=true;}},{passive:true});
    addEventListener('resize',pxRun,{passive:true}); pxRun();
  }

  // stagger reveals inside grids
  document.querySelectorAll('.cards,.team,.reviews,.steps,.why-grid,.stats,.tech-grid').forEach(function(grid){
    var i=0;[].slice.call(grid.children).forEach(function(c){ if(c.classList.contains('reveal')){ c.style.setProperty('--d',((i%4)*0.08)+'s'); i++; } });
  });

  // count-up stats
  function fmt(v,dec,comma){var n=dec?parseFloat(v.toFixed(dec)):Math.round(v);return comma?n.toLocaleString('en-IN'):(dec?n.toFixed(dec):String(n));}
  function countUp(span){
    if(reduce||span.dataset.done) return; span.dataset.done='1';
    var target=parseFloat(span.dataset.count),dec=+(span.dataset.dec||0),comma=span.dataset.comma;
    var start=performance.now(),dur=1400;span.textContent=fmt(0,dec,comma);
    function step(t){var p=Math.min((t-start)/dur,1),e=1-Math.pow(1-p,3);span.textContent=fmt(target*e,dec,comma);if(p<1)requestAnimationFrame(step);else span.textContent=fmt(target,dec,comma);}
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target);co.unobserve(e.target);}});},{threshold:.4});
    document.querySelectorAll('.stat .num').forEach(function(n){co.observe(n);});
  }

  // subtle backdrop parallax (desktop, motion on)
  if(!reduce && matchMedia('(pointer:fine)').matches){
    var bg=document.querySelector('.bg');
    if(bg) addEventListener('mousemove',function(e){var x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);bg.style.transform='translate('+(x*18).toFixed(1)+'px,'+(y*18).toFixed(1)+'px) scale(1.04)';},{passive:true});
  }

  // Google Map embed: show only at top-level (Hostinger); keep styled fallback inside the shared preview
  if(window.self===window.top){
    var gm=document.getElementById('gmap');
    if(gm){gm.hidden=false;}
  }

  // ==========================================================================
  // UNIVERSAL NAVIGATION SYNCHRONIZER: Results, Reviews, Blog across ALL pages
  // ==========================================================================
  function ensureGlobalNav(){
    var currentPath = window.location.pathname.toLowerCase();
    var currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    var isReviewsRoute = currentPath.indexOf('/reviews') > -1 || currentFile.indexOf('reviews') > -1 || currentFile.indexOf('patient-stories') > -1;
    var isBlogRoute = currentPath.indexOf('/blog') > -1 || currentFile.indexOf('blog') > -1 || currentFile.indexOf('journal') > -1 ||
      currentFile.indexOf('guide') > -1 || currentFile.indexOf('aligner-consultation') > -1 ||
      currentFile.indexOf('aligners-vs-braces') > -1 || currentFile.indexOf('orthodontic-assessment') > -1;

    document.querySelectorAll('a[href="patient-stories.html"]').forEach(function(link){
      link.href = 'reviews.html';
      if(link.textContent.trim() === 'Patient Stories') link.textContent = 'Patient Stories & Reviews';
    });
    document.querySelectorAll('a[href="journal.html"]').forEach(function(link){
      link.href = 'blog.html';
      if(link.textContent.trim() === 'Dental Journal') link.textContent = 'Blog & Dental Journal';
    });

    // 1. Desktop Nav (.nav-links)
    var navLinks = document.querySelector('.nav-links');
    if(navLinks){
      var hasReviews = !!navLinks.querySelector('a[href*="reviews"]');
      var hasBlog = !!navLinks.querySelector('a[href*="blog"]');
      var hasAbout = !!navLinks.querySelector('a[href*="about.html"]');

      var contactLink = navLinks.querySelector('a[href*="contact"]');
      var drAmitLink = navLinks.querySelector('a[href*="dr-amit"]');

      if(!hasReviews){
        var aRev = document.createElement('a');
        aRev.href = 'reviews.html';
        aRev.textContent = 'Reviews';
        navLinks.insertBefore(aRev, drAmitLink || contactLink || null);
      }
      if(!hasBlog){
        var aBlog = document.createElement('a');
        aBlog.href = 'blog.html';
        aBlog.textContent = 'Blog';
        navLinks.insertBefore(aBlog, drAmitLink || contactLink || null);
      }
      if(!hasAbout){
        var aAbout = document.createElement('a');
        aAbout.href = 'about.html';
        aAbout.textContent = 'About Us';
        navLinks.insertBefore(aAbout, contactLink || null);
      }

      // Hide redundant direct treatment links on tight desktop viewports
      var caLink = navLinks.querySelector('a[href="clear-aligners.html"]');
      var brLink = navLinks.querySelector('a[href="braces-orthodontics.html"]');
      if(caLink && brLink){
        caLink.classList.add('nav-hide-compact');
        brLink.classList.add('nav-hide-compact');
      }

      // Mark active link
      navLinks.querySelectorAll('a').forEach(function(a){
        var h = (a.getAttribute('href')||'').toLowerCase();
        if(!h) return;
        var hFile = h.substring(h.lastIndexOf('/') + 1);
        var isCurrent = (hFile === currentFile) ||
          (currentFile === '' && hFile === 'index.html') ||
          (isReviewsRoute && (hFile.indexOf('reviews') > -1 || hFile.indexOf('patient-stories') > -1)) ||
          (isBlogRoute && (hFile.indexOf('blog') > -1 || hFile.indexOf('journal') > -1));

        if(isCurrent){
          a.setAttribute('aria-current', 'page');
          a.classList.add('active');
        }
      });
    }

    var footerClinicLinks = document.querySelector('footer .foot-grid > div:last-child ul');
    if(footerClinicLinks){
      [
        { href: 'reviews.html', label: 'Patient Stories & Reviews' },
        { href: 'blog.html', label: 'Blog & Dental Journal' }
      ].forEach(function(item){
        if(footerClinicLinks.querySelector('a[href="' + item.href + '"]')) return;
        var listItem = document.createElement('li');
        var link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;
        listItem.appendChild(link);
        footerClinicLinks.appendChild(listItem);
      });
    }

    // 2. Mobile Menu (#mobileMenu)
    var mobileMenu = document.getElementById('mobileMenu');
    if(mobileMenu){
      // Keep the source menu as the single source of truth on mobile. Earlier
      // revisions could leave a second Reviews/Blog/About link in this panel.
      mobileMenu.querySelectorAll(':scope > a[href*="results"]').forEach(function(link){ link.remove(); });
      mobileMenu.querySelectorAll(':scope > a[href*="patient-stories"]').forEach(function(link){
        link.href = 'reviews.html';
        link.textContent = 'Patient Stories & Reviews';
      });
      mobileMenu.querySelectorAll(':scope > a[href*="journal.html"]').forEach(function(link){
        link.href = 'blog.html';
        link.textContent = 'Blog & Dental Journal';
      });

      var seenMobileLinks = {};
      mobileMenu.querySelectorAll(':scope > a').forEach(function(link){
        var key = (link.getAttribute('href') || '').toLowerCase();
        if(!key) key = link.textContent.trim().toLowerCase();
        if(seenMobileLinks[key]) link.remove();
        else seenMobileLinks[key] = true;
      });

      var mobReviews = mobileMenu.querySelector('a[href*="reviews"]');
      var mobBlog = mobileMenu.querySelector('a[href*="blog"]');
      var mobAbout = mobileMenu.querySelector('a[href*="about.html"]');

      var contactMob = mobileMenu.querySelector('a[href*="contact"]');
      var btnMob = mobileMenu.querySelector('.trigger-consult-modal, button.btn');

      if(!mobReviews){
        var mRev = document.createElement('a');
        mRev.href = 'reviews.html';
        mRev.textContent = 'Patient Stories & Reviews';
        mobileMenu.insertBefore(mRev, mobBlog || contactMob || btnMob || null);
      } else {
        mobReviews.href = 'reviews.html';
        mobReviews.textContent = 'Patient Stories & Reviews';
      }
      if(!mobBlog){
        var mBlog = document.createElement('a');
        mBlog.href = 'blog.html';
        mBlog.textContent = 'Blog & Dental Journal';
        mobileMenu.insertBefore(mBlog, contactMob || btnMob || null);
      } else {
        mobBlog.href = 'blog.html';
        mobBlog.textContent = 'Blog & Dental Journal';
      }
      if(!mobAbout){
        var mAbout = document.createElement('a');
        mAbout.href = 'about.html';
        mAbout.textContent = 'About Us';
        mobileMenu.insertBefore(mAbout, contactMob || btnMob || null);
      } else {
        mobAbout.textContent = 'About Us';
      }

      var finalSeenMobileLinks = {};
      mobileMenu.querySelectorAll(':scope > a').forEach(function(link){
        var key = (link.getAttribute('href') || '').toLowerCase();
        if(!key) key = link.textContent.trim().toLowerCase();
        if(finalSeenMobileLinks[key]) link.remove();
        else finalSeenMobileLinks[key] = true;
      });

      // Mark active link in mobile
      mobileMenu.querySelectorAll('a').forEach(function(a){
        var h = (a.getAttribute('href')||'').toLowerCase();
        if(!h) return;
        var hFile = h.substring(h.lastIndexOf('/') + 1);
        var isCurrent = (hFile === currentFile) ||
          (currentFile === '' && hFile === 'index.html') ||
          (isReviewsRoute && (hFile.indexOf('reviews') > -1 || hFile.indexOf('patient-stories') > -1)) ||
          (isBlogRoute && (hFile.indexOf('blog') > -1 || hFile.indexOf('journal') > -1));

        if(isCurrent){
          a.setAttribute('aria-current', 'page');
          a.classList.add('active');
        }
      });
    }
  }

  // --- Interactive Before & After Slider Handler ---
  function initBeforeAfterSliders(){
    document.querySelectorAll('.ba-comparison-frame').forEach(function(frame){
      var beforeLayer = frame.querySelector('.ba-layer.ba-before');
      var divider = frame.querySelector('.ba-divider');
      var range = frame.querySelector('.ba-range');
      if(!beforeLayer || !divider || !range) return;

      function setPosition(val){
        val = Math.max(0, Math.min(100, val));
        range.value = val;
        beforeLayer.style.clipPath = 'inset(0 ' + (100 - val) + '% 0 0)';
        divider.style.left = val + '%';
      }

      range.addEventListener('input', function(){
        setPosition(parseFloat(range.value));
      });
      range.addEventListener('change', function(){
        setPosition(parseFloat(range.value));
      });

      var isDragging = false;
      function handleMove(clientX){
        var rect = frame.getBoundingClientRect();
        var x = clientX - rect.left;
        var percent = (x / rect.width) * 100;
        setPosition(percent);
      }
      frame.addEventListener('pointerdown', function(e){
        if(frame.classList.contains('side-by-side')) return;
        isDragging = true;
        handleMove(e.clientX);
      });
      window.addEventListener('pointermove', function(e){
        if(!isDragging) return;
        handleMove(e.clientX);
      });
      window.addEventListener('pointerup', function(){
        isDragging = false;
      });
    });

    // View toggle: Slider vs Side-by-Side
    document.querySelectorAll('.view-toggle-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var parent = btn.closest('.results-view-controls') || document;
        var mode = btn.getAttribute('data-view');
        parent.querySelectorAll('.view-toggle-btn').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');

        document.querySelectorAll('.ba-comparison-frame').forEach(function(f){
          if(mode === 'split'){
            f.classList.add('side-by-side');
          } else {
            f.classList.remove('side-by-side');
          }
        });
      });
    });

    // Results category filtering
    var filterChips = document.querySelectorAll('.results-filter-bar .filter-chip');
    if(filterChips.length){
      filterChips.forEach(function(chip){
        chip.addEventListener('click', function(){
          filterChips.forEach(function(c){ c.classList.remove('active'); });
          chip.classList.add('active');
          var cat = chip.getAttribute('data-filter') || 'all';
          document.querySelectorAll('.result-card').forEach(function(card){
            var cardCat = card.getAttribute('data-category') || '';
            if(cat === 'all' || cardCat.indexOf(cat) > -1){
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });
    }
  }

  // Optional, server-side Google Places adapter. Keep API keys off the public site:
  // set data-reviews-endpoint on reviews.html to a same-origin endpoint returning
  // { rating, total, reviews: [{name, photo, rating, text, date, treatment}] }.
  function initReviewsFeed(){
    var page = document.body;
    var endpoint = page && page.getAttribute('data-reviews-endpoint');
    var grid = document.querySelector('.reviews-written-strip .reviews-marquee-group') || document.querySelector('.reviews-masonry-grid');
    if(!endpoint || !grid || !window.fetch) return Promise.resolve();

    function text(value){ return value == null ? '' : String(value); }
    function starText(rating){ return '★★★★★'.slice(0, Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))); }
    return fetch(endpoint, { credentials: 'same-origin' }).then(function(response){
      if(!response.ok) throw new Error('Review feed unavailable');
      return response.json();
    }).then(function(data){
      var reviews = Array.isArray(data.reviews) ? data.reviews : [];
      if(!reviews.length) return;
      grid.innerHTML = '';
      reviews.forEach(function(review){
        var card = document.createElement('article');
        var rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
        var category = text(review.treatment || 'general').toLowerCase();
        card.className = 'review-card-item';
        card.setAttribute('data-category', category);
        card.setAttribute('data-rating', rating);
        var head = document.createElement('div'); head.className = 'review-card-header';
        var profile = document.createElement('div'); profile.className = 'reviewer-profile';
        var avatar = document.createElement(review.photo ? 'img' : 'span'); avatar.className = 'reviewer-avatar';
        if(review.photo){ avatar.src = text(review.photo); avatar.alt = ''; avatar.loading = 'lazy'; }
        else { avatar.textContent = text(review.name).charAt(0).toUpperCase() || 'G'; }
        var info = document.createElement('div'); info.className = 'reviewer-info';
        var name = document.createElement('h4'); name.textContent = text(review.name || 'Google reviewer');
        var verified = document.createElement('span'); verified.className = 'review-pending-pill'; verified.textContent = 'Google review';
        info.appendChild(name); info.appendChild(verified); profile.appendChild(avatar); profile.appendChild(info); head.appendChild(profile);
        var ratingRow = document.createElement('div'); ratingRow.className = 'review-rating-row';
        var stars = document.createElement('span'); stars.className = 'review-stars'; stars.setAttribute('aria-label', rating + ' out of 5 stars'); stars.textContent = starText(rating);
        var date = document.createElement('span'); date.className = 'review-date'; date.textContent = text(review.date || ''); ratingRow.appendChild(stars); ratingRow.appendChild(date);
        var body = document.createElement('p'); body.className = 'review-body-text'; body.textContent = text(review.text);
        var tag = document.createElement('span'); tag.className = 'review-treatment-pill'; tag.textContent = text(review.treatment || 'Patient review');
        card.appendChild(head); card.appendChild(ratingRow); card.appendChild(body); card.appendChild(tag); grid.appendChild(card);
      });
      var ratingEl = document.getElementById('googleRating'); if(ratingEl && data.rating) ratingEl.textContent = Number(data.rating).toFixed(1);
      var countEl = document.getElementById('googleReviewCount'); if(countEl && data.total != null) countEl.textContent = text(data.total);
      var countNote = document.getElementById('googleCountNote'); if(countNote) countNote.textContent = '· live Google feed';
      var status = document.getElementById('reviewFeedStatus'); if(status) status.innerHTML = '<strong>Live Google reviews</strong><br>Showing the reviews supplied by the connected Google Places feed.';
    }).catch(function(){ /* Preserve the honest Google-listing fallback. */ });
  }

  // --- Reviews Filter, Search, and Pagination Engine ---
  function initReviewsEngine(){
    var cards = document.querySelectorAll('.reviews-written-strip .reviews-marquee-group .review-card-item, .reviews-masonry-grid:not(.reviews-written-strip) .review-card-item');
    if(!cards.length) return;

    var filterChips = document.querySelectorAll('.reviews-filter-bar .filter-chip');
    var searchInput = document.getElementById('reviewSearchInput');
    var loadMoreBtn = document.getElementById('loadMoreReviewsBtn');
    var emptyState = document.getElementById('reviewEmptyState');
    var visibleCount = document.querySelector('.reviews-written-strip') ? cards.length : 6;
    var currentFilter = 'all';
    var currentQuery = '';

    function filterReviews(){
      var matched = [];
      cards.forEach(function(card){
        var cat = (card.getAttribute('data-category')||'').toLowerCase();
        var rating = card.getAttribute('data-rating')||'5';
        var text = (card.textContent||'').toLowerCase();

        var matchesCat = (currentFilter === 'all') ||
                         (currentFilter === '5-star' && rating === '5') ||
                         (cat.indexOf(currentFilter) > -1);

        var matchesSearch = !currentQuery || (text.indexOf(currentQuery) > -1);

        if(matchesCat && matchesSearch){
          matched.push(card);
        } else {
          card.classList.add('hidden');
        }
      });

      matched.forEach(function(card, idx){
        if(idx < visibleCount){
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      if(emptyState) emptyState.classList.toggle('hidden', matched.length > 0);

      if(loadMoreBtn){
        if(visibleCount >= matched.length){
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.style.display = 'inline-flex';
          var remain = matched.length - visibleCount;
          loadMoreBtn.textContent = 'Load More Reviews (' + remain + ' more)';
        }
      }
    }

    if(filterChips.length){
      filterChips.forEach(function(chip){
        chip.addEventListener('click', function(){
          filterChips.forEach(function(c){ c.classList.remove('active'); });
          chip.classList.add('active');
          currentFilter = chip.getAttribute('data-filter') || 'all';
          visibleCount = 6;
          filterReviews();
        });
      });
    }

    if(searchInput){
      searchInput.addEventListener('input', function(){
        currentQuery = searchInput.value.trim().toLowerCase();
        visibleCount = 6;
        filterReviews();
      });
    }

    if(loadMoreBtn){
      loadMoreBtn.addEventListener('click', function(){
        visibleCount += 6;
        filterReviews();
      });
    }

    filterReviews();
  }

  function initReviewsMarquee(){
    var track = document.querySelector('.reviews-written-strip .reviews-marquee-track');
    var group = track && track.querySelector('.reviews-marquee-group');
    if(!track || !group || !group.children.length || track.querySelector('.reviews-marquee-duplicate')) return;

    var duplicate = group.cloneNode(true);
    duplicate.classList.add('reviews-marquee-duplicate');
    duplicate.setAttribute('aria-hidden', 'true');
    duplicate.querySelectorAll('.reveal,.reveal-text').forEach(function(element){ element.classList.add('in'); });
    duplicate.querySelectorAll('[id]').forEach(function(element){ element.removeAttribute('id'); });
    duplicate.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function(element){
      element.setAttribute('tabindex', '-1');
    });
    track.appendChild(duplicate);
  }

  // --- Blog Listing Filter Engine ---
  function initBlogEngine(){
    var chips = document.querySelectorAll('.blog-filter-bar .filter-chip');
    if(!chips.length) return;
    chips.forEach(function(chip){
      chip.addEventListener('click', function(){
        chips.forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        var cat = chip.getAttribute('data-filter') || 'all';
        document.querySelectorAll('.blog-article-card').forEach(function(card){
          var cardCat = (card.getAttribute('data-category')||'').toLowerCase();
          if(cat === 'all' || cardCat.indexOf(cat.toLowerCase()) > -1){
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // --- Article Table of Contents Scrollspy ---
  function initArticleScrollspy(){
    var tocLinks = document.querySelectorAll('.sidebar-toc a');
    if(!tocLinks.length) return;

    var headings = [];
    tocLinks.forEach(function(link){
      var id = link.getAttribute('href');
      if(id && id.startsWith('#')){
        var el = document.getElementById(id.substring(1));
        if(el) headings.push({ link: link, el: el });
      }
    });

    if(!headings.length) return;

    function onScroll(){
      var top = window.scrollY + 140;
      var current = headings[0];
      for(var i=0; i<headings.length; i++){
        if(headings[i].el.offsetTop <= top){
          current = headings[i];
        }
      }
      tocLinks.forEach(function(l){ l.classList.remove('active'); });
      if(current && current.link) current.link.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initArticleTemplate(){
    var article = document.querySelector('article.article');
    var content = article && article.querySelector('.wrap.narrow');
    if(!content || content.querySelector('.article-main-grid')) return;

    content.classList.remove('narrow');
    var grid = document.createElement('div');
    grid.className = 'article-main-grid article-reading-only';
    var body = document.createElement('div');
    body.className = 'article-body-col';
    while(content.firstChild) body.appendChild(content.firstChild);
    grid.appendChild(body);

    content.appendChild(grid);

    var mobileBar = document.createElement('div');
    mobileBar.className = 'mobile-action-bar';
    mobileBar.innerHTML = '<a href="contact.html#book" class="btn btn-primary">Book a consultation</a>';
    document.body.appendChild(mobileBar);
  }

  function addLegalFooterLinks(){
    var footerBottom=document.querySelector('.foot-bottom');
    if(!footerBottom || footerBottom.querySelector('.legal-links')) return;
    var legalNav=document.createElement('nav');
    legalNav.className='legal-links';
    legalNav.setAttribute('aria-label','Legal');
    legalNav.innerHTML='<a href="privacy-policy.html">Privacy Policy</a><a href="terms-and-conditions.html">Terms &amp; Conditions</a>';
    footerBottom.appendChild(legalNav);
  }

  function initTreatmentActionBar(){
    if(!document.querySelector('.subtreatment-hero') || document.querySelector('.treatment-action-bar')) return;
    var bar=document.createElement('nav');
    bar.className='mobile-action-bar treatment-action-bar';
    bar.setAttribute('aria-label','Quick contact actions');
    bar.innerHTML='<a data-cta="call" data-location="sticky" href="tel:+919811504048" class="btn btn-dark">Call</a><a data-cta="whatsapp" data-location="sticky" href="https://wa.me/919811504048?text=Hi%20Dental%20Specialities%2C%20I%20would%20like%20to%20book%20a%20consultation." target="_blank" rel="noopener" class="btn btn-wa">WhatsApp</a><a data-cta="book" data-location="sticky" href="#book" class="btn btn-primary">Book</a>';
    document.body.appendChild(bar);
    document.querySelectorAll('input,select,textarea').forEach(function(field){
      field.addEventListener('focus',function(){bar.hidden=true;});
      field.addEventListener('blur',function(){setTimeout(function(){bar.hidden=false;},100);});
    });
  }

  function applyClinicDetails(){
    document.querySelectorAll('.socials a[href*="instagram.com"]').forEach(function(a){a.href='https://www.instagram.com/dentalspecialities.co/';});
    document.querySelectorAll('.socials a[href*="facebook.com"]').forEach(function(a){a.remove();});
    document.querySelectorAll('option').forEach(function(option){
      if(/Morning \(10:00 AM - 1:00 PM\)/i.test(option.value)) option.textContent='Morning (10 AM – 1 PM)';
      if(/Afternoon \(1:00 PM - 5:00 PM\)/i.test(option.value)){option.value='Afternoon (1:00 PM - 4:00 PM)';option.textContent='Afternoon (1 PM – 4 PM)';}
      if(/Evening \(5:00 PM - 8:00 PM\)/i.test(option.value)){option.value='Evening (4:00 PM - 6:00 PM)';option.textContent='Evening (4 PM – 6 PM)';}
    });
  }

  // Run initializations
  ensureGlobalNav();
  initBeforeAfterSliders();
  initReviewsFeed().then(function(){
    initReviewsEngine();
    initReviewsMarquee();
  });
  initBlogEngine();
  initArticleTemplate();
  initTreatmentActionBar();
  initArticleScrollspy();
  addLegalFooterLinks();
  applyClinicDetails();

})();
