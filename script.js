/* =========================
   Particle background (light & efficient)
   ========================= */
(function(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const DPR = window.devicePixelRatio || 1;
  canvas.width = innerWidth * DPR;
  canvas.height = innerHeight * DPR;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.scale(DPR, DPR);

  let particles = [];
  const count = Math.min(80, Math.floor((w*h)/(1600*DPR))); // density scale
  function rand(min,max){return Math.random()*(max-min)+min;}

  function init(){
    particles = [];
    for(let i=0;i<count;i++){
      particles.push({
        x: rand(0,w),
        y: rand(0,h),
        r: rand(0.6,2.6),
        vx: rand(-0.15,0.15),
        vy: rand(-0.05,0.12),
        alpha: rand(0.08,0.35),
        tw: rand(2000,6000),
        t: Math.random()*6000
      });
    }
  }

  function resize(){
    w = canvas.width = innerWidth * DPR;
    h = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
    init();
  }
  addEventListener('resize', resize);

  function draw(t){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    particles.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      p.t += 16;
      // bounce edges gracefully
      if(p.x < -20) p.x = innerWidth + 20;
      if(p.x > innerWidth + 20) p.x = -20;
      if(p.y < -20) p.y = innerHeight + 20;
      if(p.y > innerHeight + 20) p.y = -20;

      // pulsing alpha
      const pulse = 0.5 + 0.5*Math.sin((p.t/p.tw)*Math.PI*2);
      ctx.beginPath();
      ctx.fillStyle = `rgba(110,95,220,${p.alpha * pulse})`; // purple-blue tone
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  init(); draw();
})();

/* =========================
   Slider: fade + auto + dots + keyboard
   ========================= */
(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  if(!slides.length) return;
  const slidesEl = document.getElementById('slides');
  const dotsRoot = document.getElementById('dots');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let idx = 0;
  let auto = true;
  let interval = null;
  const DURATION = 4500;

  function createDots(){
    slides.forEach((_,i)=>{
      const el = document.createElement('div');
      el.className = 'dot' + (i===0? ' active':'');
      el.setAttribute('data-i', i);
      el.addEventListener('click', ()=> goTo(i));
      dotsRoot.appendChild(el);
    });
  }
  function update(){
    slides.forEach((s,i)=> s.classList.toggle('show', i===idx));
    document.querySelectorAll('.dot').forEach((d,i)=> d.classList.toggle('active', i===idx));
  }
  function next(){ idx = (idx+1) % slides.length; update(); }
  function prev(){ idx = (idx-1 + slides.length) % slides.length; update(); }
  function goTo(i){ idx = i; update(); reset(); }

  function start(){ stop(); interval = setInterval(()=> next(), DURATION); }
  function stop(){ if(interval){ clearInterval(interval); interval=null; } }
  function reset(){ if(auto) start(); }

  prevBtn.addEventListener('click', ()=>{ prev(); reset(); });
  nextBtn.addEventListener('click', ()=>{ next(); reset(); });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') prev();
    if(e.key === 'ArrowRight') next();
  });

  createDots();
  start();

  // pause on hover
  const slider = document.getElementById('slider');
  slider.addEventListener('mouseenter', ()=> stop());
  slider.addEventListener('mouseleave', ()=> { if(auto) start(); });

})();

/* =========================
   Gallery lightbox
   ========================= */
(function(){
  const gallery = document.getElementById('gallery');
  const lbRoot = document.getElementById('lightbox-root');

  function open(src){
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML = `<img src="${src}" alt="Foto">`;
    overlay.addEventListener('click', ()=> overlay.remove());
    document.body.appendChild(overlay);
  }

  gallery.addEventListener('click', (e)=>{
    const img = e.target.closest('img');
    if(!img) return;
    open(img.src.replace('&w=800','&w=1400')); // try load larger if available
  });

  // also close on esc
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ const lb = document.querySelector('.lightbox'); if(lb) lb.remove(); } });
})();

/* =========================
   Inject struktur 38 siswa
   ========================= */
(function(){
  const names = [
    "1. Adinda F.G","2. Adrian S.K","3. Andika R.P","4. Ardina R","5. Ardiansyah","6. Arie I.R","7. Aulya B.P.A",
    "8. Ayu P","9. Elfina J","10. Fatikha A","11. Fitriyani","12. Girald H.W","13. Hafiz A.S","14. Hakam S",
    "15. Keyla M","16. Kholifa","17. M. Arifin","18. Marsya N.N","19. Meilina","20. Meilinda N","21. Monika N", "22. M. Dzaky G",
    "23. M. Taufik","24. Nia R","25. Nita A","26. Nur Sobbah","27. Nur Aeni","28. Putra F.A","29. Putri A",
    "30. Reza D.A","31. Ridho R","32. Rizky A.P","33. Sela R","34. S. Okta","35. Shofi M.P","36. Syfa N",
    "37. Vanessa T.P","38. Wira D.R"
  ];
  const grid = document.getElementById('struktur-grid');
  names.forEach(n=>{
    const el = document.createElement('div');
    el.className = 'member';
    el.textContent = n;
    el.addEventListener('click', ()=> {
      el.animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}], {duration:300});
    });
    grid.appendChild(el);
  });
})();

/* =========================
   Testimonials local save
   ========================= */
(function(){
  const STORAGE_KEY = 'tkj2_messages_v1';
  const container = document.getElementById('testimonials');
  const addBtn = document.getElementById('addMsg');
  const nameInput = document.getElementById('msgName');
  const textInput = document.getElementById('msgText');

  function getMsgs(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){ return []; } }
  function saveMsgs(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

  function render(){
    const arr = getMsgs();
    // clear non-default messages
    container.innerHTML = '';
    // default examples always shown
    const defaults = [
      {n:'Ipin', t:'Teruslah menuntut ilmu walau sadar diri kita blm mampu mencerna.'},
      {n:'Putra', t:'Siswa nya banyak yang aktif & tidak ada kata tenang'},
      {n:'Girald', t:'Kelas yang ramai kayak pasar!'}
    ];
    const list = defaults.concat(arr);
    list.forEach(item=>{
      const d = document.createElement('div');
      d.className = 'testi';
      d.innerHTML = `“${escapeHTML(item.t)}” — <strong>${escapeHTML(item.n)}</strong>`;
      container.appendChild(d);
    });
  }

  addBtn.addEventListener('click', ()=>{
    const n = nameInput.value.trim() || 'Anonim';
    const t = textInput.value.trim();
    if(!t) return alert('Isi pesan dulu ya.');
    const arr = getMsgs();
    arr.unshift({n,t});
    saveMsgs(arr.slice(0,20)); // keep only recent 20
    nameInput.value=''; textInput.value='';
    render();
  });

  render();

  function escapeHTML(s){ return s.replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'<','>':'>','"':'"',"'":"&#39;" })[m]); }
})();

/* =========================
   Simple AOS-like: IntersectionObserver
   ========================= */
(function(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        // if you don't want to animate again, unobserve:
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  document.querySelectorAll('[data-animate]').forEach(el=> obs.observe(el));
})();

/* =========================
   Dark/Light toggle (saves to localStorage)
   ========================= */
(function(){
  const key = 'tkj2_theme';
  const btn = document.getElementById('modeToggle');

  function set(theme){
    if(theme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    btn.textContent = theme === 'light' ? '🌤 Mode Terang' : '🌙 Mode Gelap';
    localStorage.setItem(key, theme);
  }

  btn.addEventListener('click', ()=>{
    const cur = localStorage.getItem(key) === 'light' ? 'light' : 'dark';
    set(cur === 'light' ? 'dark' : 'light');
  });

  // init
  const saved = localStorage.getItem(key) || (matchMedia && matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  set(saved);
})();

/* =========================
   Music toggle (note: browsers block auto-play until user interacts)
   ========================= */
(function(){
  const bg = document.getElementById('musicToggle');
  const audio = document.getElementById('bgMusic') || (function(){
    const a=document.createElement('audio'); a.id='bgMusic'; a.loop=true;
    a.src='https://cdn.simple-music.example/ambient-loop.mp3'; document.body.appendChild(a); return a;
  })();
  bg.addEventListener('click', async ()=>{
    try{
      if(audio.paused){ await audio.play(); bg.textContent = '⏸ Musik'; }
      else{ audio.pause(); bg.textContent = '▶ Musik'; }
    }catch(e){ alert('Browser memblokir pemutaran otomatis. Silakan klik tombol lagi untuk izinkan.'); }
  });
})();

/* =========================
   Accessibility: close lightbox on ESC, focus handling etc handled above
   ========================= */
