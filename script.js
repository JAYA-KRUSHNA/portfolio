/* ========================================================
   JAYA KRUSHNA PORTFOLIO — SCRIPT.JS
   Matches index.html structure exactly.
   Three.js · Cursor · Typed · Scroll Reveal · 3D Tilt
   Counters · Hamburger · Active Nav · Click FX · Parallax
======================================================== */
'use strict';

// ─── LOADER ───────────────────────────────────────────────
(function () {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loader-fill');
  let w = 0;
  const iv = setInterval(() => {
    w += Math.random() * 16;
    if (w >= 100) { w = 100; clearInterval(iv); setTimeout(() => loader.classList.add('done'), 500); }
    fill.style.width = w + '%';
  }, 70);
})();

// ─── ON LOAD ──────────────────────────────────────────────
window.addEventListener('load', () => {
  initThree();
  initCursor();
  initNavbar();
  initHamburger();
  initTyped();
  initReveal();
  initCounters();
  initTilt();
  initActiveNav();
  initClickFX();
  initParallax();
  // kick reveal for elements already in view
  setTimeout(() => window.dispatchEvent(new Event('scroll')), 300);
});

// ─── THREE.JS BACKGROUND ──────────────────────────────────
function initThree() {
  const canvas = document.getElementById('bg-canvas');
  if (!window.THREE || !canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 90;

  // Circular glow texture
  function makeTex(rgba) {
    const s = 64, cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const ctx = cv.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, rgba.replace('1)', '1)'));
    g.addColorStop(0.4, rgba.replace('1)', '0.5)'));
    g.addColorStop(1, rgba.replace('1)', '0)'));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    return new THREE.CanvasTexture(cv);
  }

  const groups = [
    { hex: 0x8b5cf6, rgba: 'rgba(139,92,246,1)', n: 280, sz: 2.2 },
    { hex: 0x06b6d4, rgba: 'rgba(6,182,212,1)', n: 200, sz: 2.0 },
    { hex: 0xec4899, rgba: 'rgba(236,72,153,1)', n: 120, sz: 1.8 },
    { hex: 0xfafafa, rgba: 'rgba(250,250,250,1)', n: 100, sz: 1.3 },
  ];

  const meshes = groups.map(({ hex, rgba, n, sz }) => {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 330;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 330;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: sz, map: makeTex(rgba), color: hex,
      transparent: true, opacity: 0.4, depthWrite: false, sizeAttenuation: true, alphaTest: 0.01
    });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);
    return { mesh, mat, spd: 0.00013 + Math.random() * 0.00017 };
  });

  let tx = 0, ty = 0;
  addEventListener('mousemove', e => {
    tx = (e.clientX / innerWidth - 0.5) * 0.12;
    ty = (e.clientY / innerHeight - 0.5) * 0.12;
  });
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  let f = 0;
  (function animate() {
    requestAnimationFrame(animate); f++;
    meshes.forEach(({ mesh, mat, spd }, i) => {
      mesh.rotation.y += spd;
      mesh.rotation.x += spd * 0.4;
      mat.opacity = (i === 3 ? 0.15 : 0.32) + 0.07 * Math.sin(f * 0.008 + i);
    });
    camera.position.x += (tx * 12 - camera.position.x) * 0.014;
    camera.position.y += (-ty * 12 - camera.position.y) * 0.014;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
}

// ─── CURSOR ───────────────────────────────────────────────
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function tr() {
    rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(tr);
  })();

  const sel = 'a, button, .project-card, .l-card, .cert-card, .tech-bubble, .contact-card, .skill-pill, .info-item, .timeline-card';
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(0.4)';
    ring.style.transform = 'translate(-50%,-50%) scale(0.6)';
    ring.style.borderColor = '#06b6d4';
  });
  addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = '';
  });
}

// ─── NAVBAR ───────────────────────────────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));
}

// ─── HAMBURGER ────────────────────────────────────────────
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn) return;
  btn.addEventListener('click', () => { links.classList.toggle('open'); btn.classList.toggle('active'); });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    links.classList.remove('open'); btn.classList.remove('active');
  }));
}

// ─── TYPED TEXT ───────────────────────────────────────────
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  const phrases = ['Intelligent Systems', 'ML Models', 'AI Applications', 'Data Pipelines', 'Smart Solutions', 'Computer Vision'];
  let pi = 0, ci = 0, del = false;
  function run() {
    const cur = phrases[pi];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; return setTimeout(run, 1800); }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; return setTimeout(run, 350); }
    }
    setTimeout(run, del ? 55 : 75);
  }
  run();
}

// ─── SCROLL REVEAL ────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); skillObs.unobserve(e.target); } });
  }, { threshold: 0.25 });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
  document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));
}

// ─── STAT COUNTERS ────────────────────────────────────────
function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const dec = el.dataset.decimal || '';
      const dur = 1700, t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(target * ease) + (p === 1 ? dec : '');
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => obs.observe(el));
}

// ─── 3D TILT ─────────────────────────────────────────────
function initTilt() {
  // Hero profile card
  const card = document.getElementById('card-3d');
  const inner = card?.querySelector('.card-3d-inner');
  if (card && inner) {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rotX = -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 16;
      const rotY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 16;
      inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => { inner.style.transform = 'rotateX(0) rotateY(0) scale(1)'; });
  }

  // Project cards
  document.querySelectorAll('.project-card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `translateY(-8px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
}

// ─── ACTIVE NAV ───────────────────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const m = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (m) m.classList.add('active');
      }
    });
  }, { rootMargin: '-42% 0px -42% 0px' })
    .bind ? null : void sections.forEach(s => {
      // plain approach
    });

  // Rebuild with named reference
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const m = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (m) m.classList.add('active');
      }
    });
  }, { rootMargin: '-42% 0px -42% 0px' });
  sections.forEach(s => navObs.observe(s));
}

// ─── CLICK FX ─────────────────────────────────────────────
function initClickFX() {
  // Inject ripple style once
  const s = document.createElement('style');
  s.textContent = `
    .ripple {
      position: absolute; border-radius: 50%; pointer-events: none; z-index: 99;
      transform: scale(0); animation: ripple-anim 0.6s linear forwards;
      background: radial-gradient(circle, rgba(255,255,255,.28) 0%, rgba(255,255,255,0) 70%);
    }
    @keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }
    .btn:active          { transform: scale(0.95) translateY(1px) !important; }
    .tech-bubble:active  { transform: scale(0.88) !important; }
    .skill-pill:active   { transform: scale(0.95) !important; border-color: rgba(139,92,246,.6) !important; }
    .contact-card:active { background: rgba(139,92,246,.1) !important; }
    .l-card:active, .cert-card:active, .timeline-card:active, .info-item:active {
      transform: scale(0.97) !important;
    }
    .nav-link.flash { color: #8b5cf6 !important; }
    .nav-link.flash::after { width: 100% !important; }
  `;
  document.head.appendChild(s);

  // Add ripple to interactive elements
  ['.btn', '.project-card', '.contact-card', '.l-card', '.cert-card',
    '.skill-pill', '.tech-bubble', '.nav-link', '.project-link',
    '.timeline-card', '.info-item'].forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.addEventListener('click', ev => {
          const r = el.getBoundingClientRect();
          const size = Math.max(r.width, r.height) * 2;
          const span = document.createElement('span');
          span.className = 'ripple';
          span.style.cssText = `width:${size}px;height:${size}px;` +
            `left:${ev.clientX - r.left - size / 2}px;top:${ev.clientY - r.top - size / 2}px`;
          el.appendChild(span);
          span.addEventListener('animationend', () => span.remove());
        });
      });
    });

  // Project card brightness burst
  document.querySelectorAll('.project-card').forEach(c => {
    c.addEventListener('click', () => {
      c.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.4)', transform: 'scale(1.02)' }, { filter: 'brightness(1)' }],
        { duration: 320, easing: 'cubic-bezier(.4,0,.2,1)' });
    });
  });

  // Skill pill pop
  document.querySelectorAll('.skill-pill').forEach(p => {
    p.addEventListener('click', () => {
      p.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.09)', boxShadow: '0 0 18px rgba(139,92,246,.5)' }, { transform: 'scale(1)' }],
        { duration: 360, easing: 'cubic-bezier(.4,0,.2,1)' });
    });
  });

  // Tech bubble bounce
  document.querySelectorAll('.tech-bubble').forEach(b => {
    b.addEventListener('click', () => {
      b.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-10px) scale(1.14)', boxShadow: '0 12px 28px rgba(6,182,212,.45)' }, { transform: 'translateY(0) scale(1)' }],
        { duration: 400, easing: 'cubic-bezier(.4,0,.2,1)' });
    });
  });

  // Nav link flash
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => { l.classList.add('flash'); setTimeout(() => l.classList.remove('flash'), 420); });
  });

  // Contact card glow burst
  document.querySelectorAll('.contact-card').forEach(c => {
    c.addEventListener('click', () => {
      c.animate([
        { boxShadow: '0 0 0 rgba(139,92,246,0)' },
        { boxShadow: '0 0 34px rgba(139,92,246,.6), 8px 0 22px rgba(139,92,246,.3)' },
        { boxShadow: '0 0 0 rgba(139,92,246,0)' },
      ], { duration: 520, easing: 'ease-out' });
    });
  });

  // Timeline dot burst on card click
  document.querySelectorAll('.timeline-card').forEach(c => {
    const dot = c.closest('.timeline-item')?.querySelector('.timeline-dot');
    c.addEventListener('click', () => {
      if (!dot) return;
      dot.animate([
        { transform: 'scale(1)', boxShadow: '0 0 20px rgba(139,92,246,.4)' },
        { transform: 'scale(1.5)', boxShadow: '0 0 44px rgba(139,92,246,.9)' },
        { transform: 'scale(1)', boxShadow: '0 0 20px rgba(139,92,246,.4)' },
      ], { duration: 400, easing: 'cubic-bezier(.4,0,.2,1)' });
    });
  });
}

// ─── PARALLAX ─────────────────────────────────────────────
function initParallax() {
  addEventListener('scroll', () => {
    const sy = scrollY;
    const hero = document.querySelector('.hero-content');
    const orbs = document.querySelectorAll('.orb');
    if (hero) hero.style.transform = `translateY(${sy * 0.16}px)`;
    orbs.forEach((o, i) => { o.style.transform = `translateY(${sy * (0.05 + i * 0.03)}px)`; });
  });
}
