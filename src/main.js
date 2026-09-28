import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/dm-sans';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/jetbrains-mono';
import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { registerSW } from 'virtual:pwa-register';

import { projects, training, journey, certs, skills, more } from './data.js';
import { LOGO_PATH, LOGO_VIEWBOX } from './logo-path.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const isMobile = () => innerWidth < 900;
const TONES = ['lilac', 'peach', 'mint', 'sky', 'butter', 'rose'];
const toneVar = (t) => `var(--${t})`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/* ───────── logo svgs ───────── */
$$('[data-logo]').forEach((svg) => {
  svg.setAttribute('viewBox', LOGO_VIEWBOX);
  svg.innerHTML = `<path d="${LOGO_PATH}" fill="currentColor"/>`;
});

/* ───────── render content ───────── */
function consoleMarkup(p) {
  const c = p.clips[0];
  return `
    <div class="device console" data-device>
      <div class="console__pad"><div class="dpad"></div><div class="stick"></div></div>
      <div class="console__screen">
        <video muted loop playsinline preload="none" poster="${c.poster}" data-src="${c.src}"></video>
        <div class="screen-glare"></div>
      </div>
      <div class="console__pad"><div class="abtn"><i></i><i></i></div><div class="stick"></div></div>
      ${p.clips.length > 1 ? `<div class="clip-tabs">${p.clips.map((k, i) => `<button class="${i ? '' : 'is-on'}" data-clip="${i}">${k.label}</button>`).join('')}</div>` : ''}
    </div>`;
}
function phoneMarkup(p) {
  const c = p.clips[0];
  return `<div class="device phone" data-device><video muted loop playsinline preload="none" poster="${c.poster}" data-src="${c.src}"></video></div>`;
}
$('[data-projects]').innerHTML = projects
  .map(
    (p) => `
  <article class="panel proj" id="p-${p.id}" data-proj="${p.id}" style="--a:${p.accent};--a2:${p.accent2}">
    <span class="proj__no" aria-hidden="true">${p.no}</span>
    <div class="proj__info">
      <div class="proj__top">
        <img class="proj__icon ${p.pixel ? 'pixel' : ''}" src="${p.icon}" alt="" width="64" height="64" loading="lazy" />
        <div><div class="proj__kind">${p.kind}</div><span class="proj__live"><span class="pulse"></span>Live now</span></div>
      </div>
      <h3 class="proj__name">${p.name}</h3>
      <p class="proj__tag">${p.tagline}</p>
      <p class="proj__blurb">${p.blurb}</p>
      <ul class="proj__feats">${p.features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <div class="proj__stack">${p.stack.map((s) => `<span>${s}</span>`).join('')}</div>
      <div class="proj__cta">
        <a class="btn btn--solid" href="${p.url}" target="_blank" rel="noopener" data-magnetic>${p.device === 'phone' ? 'Open app' : 'Play now'} ↗</a>
        <button class="btn" data-preview="${p.id}" data-magnetic>Try it here</button>
        ${p.source ? `<a class="btn" href="${p.source}" target="_blank" rel="noopener" data-magnetic>Source</a>` : ''}
      </div>
    </div>
    <div class="proj__stage">${p.device === 'phone' ? phoneMarkup(p) : consoleMarkup(p)}</div>
  </article>`,
  )
  .join('');

$('[data-programmes]').innerHTML =
  training.programmes
    .map(
      (p, i) => `<article class="tcard prog" style="--acc:${toneVar(p.color)}">
        <div class="prog__top"><span class="prog__tag">${p.tag}</span><span class="prog__no">0${i + 1}</span></div>
        <h3>${p.title}</h3><p>${p.text}</p>
        <ul>${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
      </article>`,
    )
    .join('') +
  `<article class="tcard ttt">
    <svg class="ttt__seal" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="seal" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"/></defs><text><textPath href="#seal">HRD CORP ✦ CERTIFIED TRAINER ✦ </textPath></text></svg>
    <p class="kicker">Professional certification</p>
    <h3>HRD Corp Train-the-Trainer</h3>
    <p>Certified through the HRD Corp TTT programme in August 2026.</p>
    <div class="ttt__status">
      <span><i class="ok">✓</i>TTT certified · Aug 2026</span>
      <span><i class="wait"></i>Accreditation in progress</span>
    </div>
  </article>`;
$('[data-topics]').innerHTML = training.topics.map((t, i) => `<span style="--c:${toneVar(TONES[i % 6])}">${t}</span>`).join('');
$('[data-audiences]').innerHTML = training.audiences.map((a, i) => `<li><small>0${i + 1}</small>${a}</li>`).join('');
const tool = $('[data-tool]');
tool.href = training.tool.url;
tool.innerHTML = `<span class="arrow">↗</span><span class="kicker" style="color:inherit">Built for my trainees</span><h3>${training.tool.name}</h3><p>${training.tool.text}</p>`;

const typeTone = { work: ['lilac', 'sky', 'peach', 'rose'], edu: ['mint'], cert: ['butter'] };
const typeName = { work: 'Work', edu: 'Education', cert: 'Certification' };
let workN = 0;
$('[data-journey]').innerHTML = journey
  .map((j, i) => {
    const tones = typeTone[j.type];
    const tone = j.type === 'work' ? tones[workN++ % tones.length] : tones[0];
    return `<li class="stack__item" style="--i:${i}">
      <article class="jcard t-${tone}">
        <div class="jcard__side">
          <span class="jcard__ghost" aria-hidden="true">${j.year}</span>
          <span class="jcard__year">${j.year}</span>
          <div class="jcard__meta"><span class="jcard__when">${j.when}</span><span class="jcard__type">${typeName[j.type]}</span></div>
        </div>
        <div class="jcard__body">
          <span class="jcard__idx">${String(i + 1).padStart(2, '0')} / ${String(journey.length).padStart(2, '0')}</span>
          <h3>${j.role}</h3><p class="jcard__org">${j.org}</p>
          <ul>${j.points.map((p) => `<li>${p}</li>`).join('')}</ul>
        </div>
      </article>
    </li>`;
  })
  .join('');

$('[data-certs]').innerHTML = certs
  .map(
    (c, i) => `<article class="holo t-${c.tone}" data-holo>
      ${c.ribbon ? `<span class="holo__ribbon">${c.ribbon}</span>` : ''}
      <div class="holo__top"><span>No. ${String(i + 1).padStart(3, '0')}</span><span>Certified</span></div>
      <div class="holo__mark">${c.mark}</div>
      <svg class="holo__pattern" data-logo viewBox="${LOGO_VIEWBOX}"><path d="${LOGO_PATH}" fill="currentColor"/></svg>
      <h3>${c.name}</h3><p>${c.by}</p>
    </article>`,
  )
  .join('');

$('[data-skills]').innerHTML = Object.entries(skills)
  .map(([k, list], i) => `<div class="skill-row" style="--tone:${toneVar(TONES[i % 6])}"><h3>${k}</h3><div>${list.map((s) => `<span>${s}</span>`).join('')}</div></div>`)
  .join('');

$('[data-more]').innerHTML = more
  .map((m, i) => {
    const inner = `<div class="more__row"><span class="more__idx">${String(i + 1).padStart(2, '0')}</span><span class="more__name">${m.name}</span><span class="more__what">${m.what}</span><span class="more__note">${m.note}</span>${m.url ? '<span class="more__go">↗</span>' : '<span class="private">private</span>'}</div>`;
    return `<li class="more__item t-${m.tone}">${m.url ? `<a href="${m.url}" target="_blank" rel="noopener" data-cursor="Visit">${inner}</a>` : inner}</li>`;
  })
  .join('');

/* ───────── smooth scroll ───────── */
const lenis = new Lenis({ lerp: 0.1, smoothWheel: !reduced, anchors: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
lenis.stop();

// Touch devices already scroll natively (Lenis only smooths the wheel), so hand long jumps to the
// browser's own smooth scroll there: it runs on the compositor and stays smooth on iPhone, where a
// JS-driven scroll competing with the 3D render stutters.
function smoothTo(target, duration = 1.6) {
  if (reduced) return target === 0 ? scrollTo(0, 0) : target.scrollIntoView();
  if (!finePointer) {
    const top = target === 0 ? 0 : target.getBoundingClientRect().top + scrollY;
    return window.scrollTo({ top, behavior: 'smooth' });
  }
  lenis.scrollTo(target, { offset: 0, duration });
}
function scrollToHash(hash) {
  const el = hash === '#top' ? 0 : $(hash);
  if (el === null) return;
  smoothTo(el);
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.hasAttribute('data-menu-link')) return;
  e.preventDefault();
  scrollToHash(a.getAttribute('href'));
});

/* ───────── 3D scene ───────── */
let scene = null;
import('./scene.js')
  .then(({ createScene }) => {
    scene = createScene($('#gl'), { mobile: isMobile() || !finePointer, reduced });
    scene.setScroll(lenis.scroll);
    scene.setDark(currentTheme() === 'dark');
  })
  .catch((err) => console.warn('WebGL scene unavailable', err));
lenis.on('scroll', ({ scroll }) => scene?.setScroll(scroll));

// The 3D logo lives in reserved slots in the layout, never behind text.
const anchors = $$('[data-anchor]');
gsap.ticker.add(() => {
  if (!scene) return;
  let rect = null;
  for (const el of anchors) {
    const r = el.getBoundingClientRect();
    if (r.bottom > -r.height * 0.5 && r.top < innerHeight + r.height * 0.5) { rect = { x: r.left, y: r.top, w: r.width, h: r.height }; break; }
  }
  scene.setAnchor(rect);
});

/* ───────── loader + intro ───────── */
const heroSm = $('.hero__line--sm');
const heroXl = $('.hero__line--xl');
heroSm.innerHTML = heroSm.textContent.split(' ').map((w) => `<span class="line-mask" style="display:inline-block">${[...w].map((c) => `<span class="ch" style="display:inline-block">${c}</span>`).join('')}</span>`).join(' ');
heroXl.innerHTML = `<span class="line-mask">${[...heroXl.textContent].map((c) => `<span class="ch">${c}</span>`).join('')}</span>`;
const xlChars = $$('.ch', heroXl);

function intro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from($$('.ch', heroSm), { yPercent: 120, duration: 1.2, stagger: 0.03 })
    .from(xlChars, { yPercent: 110, rotate: 8, duration: 1.4, stagger: 0.06 }, '<0.1')
    .from('.hero__meta span, .hero__role', { y: 20, opacity: 0, stagger: 0.08, duration: 1 }, '<0.3')
    .from('.hero__intro', { y: 30, opacity: 0, duration: 1 }, '<0.2')
    .from('.badge', { scale: 0, rotate: -120, duration: 1.4, ease: 'back.out(1.6)' }, '<')
    .from('.nav > *', { y: -30, opacity: 0, stagger: 0.08, duration: 1 }, '<')
    .from('#gl', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0);
  return tl;
}

(function loader() {
  const count = $('[data-count]');
  const path = $('.loader__logo path');
  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  const state = { v: 0 };
  const ready = Promise.race([Promise.all([document.fonts.ready, new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r)))]), new Promise((r) => setTimeout(r, 3500))]);
  const tl = gsap.timeline();
  tl.to(state, { v: 86, duration: reduced ? 0.1 : 1.3, ease: 'power2.inOut', onUpdate: () => (count.textContent = Math.round(state.v)) })
    .to(path, { strokeDashoffset: 0, duration: reduced ? 0.1 : 1.3, ease: 'power2.inOut' }, 0);
  ready.then(() => {
    tl.then(() => {
      gsap.timeline()
        .to(state, { v: 100, duration: 0.35, onUpdate: () => (count.textContent = Math.round(state.v)) })
        .to(path, { fill: 'currentColor', duration: 0.3 }, '<')
        .to('.loader__inner', { yPercent: -30, opacity: 0, duration: 0.6, ease: 'power3.in' })
        .to('.loader__bars i', { yPercent: -100, duration: 0.9, stagger: 0.07, ease: 'expo.inOut' }, '-=0.2')
        .add(() => {
          document.body.classList.remove('is-loading');
          lenis.start();
          intro();
        }, '-=0.75')
        .set('.loader', { display: 'none' });
    });
  });
})();

/* ───────── hero: variable-font wave + parallax ───────── */
if (finePointer && !reduced) {
  const hero = $('.hero');
  let mx = -9999, my = -9999;
  hero.addEventListener('pointermove', (e) => ((mx = e.clientX), (my = e.clientY)));
  hero.addEventListener('pointerleave', () => ((mx = -9999), (my = -9999)));
  const cur = xlChars.map(() => ({ w: 800, s: 1 }));
  gsap.ticker.add(() => {
    if (lenis.scroll > innerHeight) return;
    xlChars.forEach((ch, i) => {
      const r = ch.getBoundingClientRect();
      const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
      const k = Math.max(0, 1 - d / (innerWidth * 0.28));
      const tw = 800 - k * 600, ts = 1 + k * 0.12;
      cur[i].w += (tw - cur[i].w) * 0.12;
      cur[i].s += (ts - cur[i].s) * 0.12;
      ch.style.fontVariationSettings = `'wght' ${cur[i].w.toFixed(0)}, 'opsz' 96`;
      ch.style.scale = `1 ${cur[i].s.toFixed(3)}`;
    });
  });
}
gsap.to('.hero__title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
gsap.to('.hero__bottom', { y: -80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

/* rotator: the pill resizes to hug each phrase */
(function rotator() {
  const box = $('[data-rotator]');
  const words = $$('b', box);
  const colors = ['var(--lilac)', 'var(--peach)', 'var(--mint)', 'var(--sky)'];
  let i = 0;
  gsap.set(words, { yPercent: 110 });
  gsap.set(words[0], { yPercent: 0 });
  const fit = () => {
    const pad = parseFloat(getComputedStyle(words[i]).left) || 0;
    box.style.width = Math.ceil(words[i].getBoundingClientRect().width + pad * 2) + 'px';
  };
  fit();
  document.fonts.ready.then(fit);
  addEventListener('resize', fit);
  setInterval(() => {
    const prev = words[i];
    i = (i + 1) % words.length;
    const next = words[i];
    gsap.to(prev, { yPercent: -110, duration: 0.6, ease: 'expo.inOut' });
    gsap.fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' });
    box.style.background = colors[i % colors.length];
    fit();
  }, 2400);
})();

/* ───────── tapes (velocity-reactive marquee) ───────── */
$$('[data-tape]').forEach((track) => {
  const dir = Number(track.dataset.tape || 1);
  const text = track.innerHTML;
  track.innerHTML = `<span>${text}</span>`.repeat(4);
  let x = 0;
  const unit = () => track.firstElementChild.offsetWidth;
  gsap.ticker.add((_, dt) => {
    const v = 1 + Math.min(Math.abs(lenis.velocity) * 0.25, 12);
    x -= dir * v * dt * 0.06;
    const u = unit();
    if (x < -u) x += u;
    if (x > 0) x -= u;
    track.style.transform = `translate3d(${x}px,0,0)`;
  });
});

/* ───────── reveals ───────── */
document.fonts.ready.then(() => {
  $$('[data-reveal]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 1.2, stagger: 0.09, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }),
    });
  });
  ScrollTrigger.refresh();
});
gsap.utils.toArray('.bento__card').forEach((c, i) => {
  gsap.from(c, { y: 80, opacity: 0, rotate: i % 2 ? 2 : -2, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 92%', once: true } });
});
$$('[data-count-to]').forEach((el) => {
  const to = parseFloat(el.dataset.countTo), dec = Number(el.dataset.decimals || 0), o = { v: 0 };
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: () => (el.textContent = o.v.toFixed(dec)) }) });
});
ScrollTrigger.create({ trigger: '.langs', start: 'top 90%', once: true, onEnter: () => $$('.langs i').forEach((i) => i.style.setProperty('--p', 1)) });

/* ───────── draggable stickers ───────── */
$$('[data-drag]').forEach((el) => {
  let sx, sy, ox = 0, oy = 0, id = null;
  const rot = getComputedStyle(el).transform;
  el.addEventListener('pointerdown', (e) => {
    id = e.pointerId; el.setPointerCapture(id); sx = e.clientX - ox; sy = e.clientY - oy;
    gsap.to(el, { scale: 1.12, duration: 0.3, ease: 'back.out(3)' });
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    ox = e.clientX - sx; oy = e.clientY - sy;
    el.style.translate = `${ox}px ${oy}px`;
  });
  const up = (e) => {
    if (e.pointerId !== id) return;
    id = null;
    gsap.to(el, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.style.transform = rot === 'none' ? '' : rot;
});

/* ───────── tilt ───────── */
function tilt(el, target = el, max = 10) {
  if (!finePointer) return;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(target, { rotateY: px * max, rotateX: -py * max, duration: 0.6, ease: 'power3.out', transformPerspective: 1000 });
  });
  el.addEventListener('pointerleave', () => gsap.to(target, { rotateY: 0, rotateX: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }));
}
$$('[data-tilt]').forEach((el) => tilt(el, el, 8));
$$('.proj').forEach((p) => tilt(p, $('[data-device]', p), 16));

$$('[data-holo]').forEach((card) => {
  const move = (x, y) => {
    const r = card.getBoundingClientRect();
    const px = (x - r.left) / r.width, py = (y - r.top) / r.height;
    card.style.setProperty('--rx', `${(0.5 - py) * 22}deg`);
    card.style.setProperty('--ry', `${(px - 0.5) * 22}deg`);
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
  };
  card.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
  card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
});
gsap.from('.holo', { y: 120, rotate: (i) => (i % 2 ? 6 : -6), opacity: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.holo-grid', start: 'top 85%', once: true } });

/* ───────── playground ───────── */
const accentFor = (p) => [p.accent, p.accent2, '#ffffff', p.accent, p.accent2, p.accent, '#ffffff', p.accent2];
function setAccent(id) {
  const p = projects.find((q) => q.id === id);
  scene?.setAccent(p ? accentFor(p) : null);
}
const mm = gsap.matchMedia();
mm.add('(min-width: 900px)', () => {
  const track = $('[data-track]');
  const bar = $('[data-work-bar]'), count = $('[data-work-count]');
  const dist = () => track.scrollWidth - innerWidth;
  const tween = gsap.to(track, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: '.work', pin: '.work__pin', scrub: 0.8, start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: (st) => {
        bar.style.transform = `scaleX(${st.progress})`;
        count.textContent = `${String(Math.min(projects.length, Math.round(st.progress * projects.length + 0.35))).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
      },
    },
  });
  $$('.proj').forEach((p) => {
    gsap.from($('.proj__stage', p), { xPercent: 40, rotate: 8, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'left 30%', scrub: true } });
    gsap.from($$('.proj__name, .proj__tag, .proj__blurb', p), { x: 120, opacity: 0, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 95%', end: 'left 45%', scrub: true } });
    ScrollTrigger.create({ trigger: p, containerAnimation: tween, start: 'left 60%', end: 'right 40%', onToggle: (s) => s.isActive && setAccent(p.dataset.proj), onLeaveBack: () => p === $('.proj') && setAccent(null) });
  });
  ScrollTrigger.create({ trigger: '.work', start: 'bottom 60%', onEnter: () => setAccent(null), onLeaveBack: () => {} });
  return () => setAccent(null);
});
mm.add('(max-width: 899px)', () => {
  const cards = $$('.proj');
  cards.forEach((p, i) => {
    ScrollTrigger.create({ trigger: p, start: 'top 60%', end: 'bottom 40%', onToggle: (s) => s.isActive && setAccent(p.dataset.proj) });
    gsap.from(p, { y: 90, rotate: i % 2 ? 3 : -3, scale: 0.94, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 95%', once: true } });
    gsap.from($('[data-device]', p), { y: 60, rotate: i % 2 ? -8 : 8, duration: 1.4, ease: 'elastic.out(1,0.6)', scrollTrigger: { trigger: p, start: 'top 80%', once: true } });
  });
  ScrollTrigger.create({ trigger: '.trainer', start: 'top 80%', onEnter: () => setAccent(null) });
});

// videos: lazy-load and only play while on screen
const vio = new IntersectionObserver(
  (entries) => entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else v.pause();
  }),
  { rootMargin: '0px 200px', threshold: 0.2 },
);
$$('.proj video').forEach((v) => vio.observe(v));
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-clip]');
  if (!b) return;
  const proj = projects.find((p) => p.id === b.closest('.proj').dataset.proj);
  const clip = proj.clips[Number(b.dataset.clip)];
  const v = $('video', b.closest('.proj'));
  $$('[data-clip]', b.parentElement).forEach((x) => x.classList.toggle('is-on', x === b));
  v.poster = clip.poster; v.src = clip.src; v.play().catch(() => {});
});

/* ───────── live preview modal ───────── */
const modal = $('[data-modal]');
const screen = $('[data-modal-screen]');
function openPreview(id) {
  const p = projects.find((q) => q.id === id);
  modal.classList.toggle('modal--phone', p.device === 'phone');
  $('[data-modal-title]').textContent = `${p.name} — live`;
  $('[data-modal-open]').href = p.url;
  screen.innerHTML = `<div class="modal__loading">loading ${esc(p.name)}…</div><iframe src="${p.url}" title="${esc(p.name)} live preview" allow="autoplay; fullscreen; gamepad; clipboard-write" allowfullscreen></iframe>`;
  modal.classList.add('is-open');
  document.documentElement.classList.add('modal-open');
  modal.setAttribute('aria-hidden', 'false');
  lenis.stop();
  $('iframe', screen).addEventListener('load', (e) => e.target.focus());
  $('.modal__close').focus({ preventScroll: true });
}
function closePreview() {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  document.documentElement.classList.remove('modal-open');
  modal.setAttribute('aria-hidden', 'true');
  lenis.start();
  setTimeout(() => (screen.innerHTML = ''), 450);
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-preview]');
  if (b) openPreview(b.dataset.preview);
  if (e.target.closest('[data-modal-close]')) closePreview();
});
addEventListener('keydown', (e) => e.key === 'Escape' && (closePreview(), closeMenu()));

/* ───────── trainer ───────── */
gsap.from('.trainer__cards .tcard, .trainer__bottom .tcard', { y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: '.trainer__cards', start: 'top 88%', once: true } });
gsap.from('.polaroid', { rotate: -18, y: 60, opacity: 0, duration: 1.4, ease: 'elastic.out(1,0.6)', scrollTrigger: { trigger: '.trainer', start: 'top 70%', once: true } });
gsap.from('.trainer__title > span', { yPercent: 60, opacity: 0, stagger: 0.12, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.trainer', start: 'top 75%', once: true } });
$$('.topics__wrap span').forEach((t, i) => t.style.setProperty('--d', `${i * 45}ms`));
ScrollTrigger.create({ trigger: '.topics__wrap', start: 'top 92%', once: true, onEnter: () => $('.topics__wrap').classList.add('is-in') });

// Nav switches to light-on-dark while the dark trainer panel is under it.
ScrollTrigger.create({ trigger: '.trainer', start: 'top 40px', end: 'bottom 40px', toggleClass: { targets: '.nav', className: 'nav--invert' } });

/* ───────── journey: cards stack and recede as the next one arrives ───────── */
(function stack() {
  const items = $$('.stack__item');
  items.forEach((li, i) => {
    const card = $('.jcard', li);
    gsap.from(card, { y: 80, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 92%', once: true } });
    const next = items[i + 1];
    if (!next) return;
    gsap.fromTo(card, { scale: 1, '--dim': 0 }, {
      scale: 0.94, '--dim': 1, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: next, start: 'top bottom', end: () => `top ${parseFloat(getComputedStyle(next).top) + 20}px`, scrub: true, invalidateOnRefresh: true },
    });
  });
})();

/* ───────── skills sphere ───────── */
(function sphere() {
  const box = $('[data-sphere]');
  const words = Object.values(skills).flat();
  const colors = ['--lilac', '--peach', '--mint', '--sky', '--butter', '--rose'];
  box.innerHTML = words.map((w) => `<span>${esc(w)}</span>`).join('');
  const els = $$('span', box);
  const N = els.length;
  const pts = els.map((_, i) => {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
    return [Math.cos(th) * r, y, Math.sin(th) * r];
  });
  els.forEach((e, i) => (e.dataset.c = colors[i % colors.length]));
  let ax = 0.3, ay = 0, vx = 0.0022, vy = 0.0012, drag = false, lx = 0, ly = 0, visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(box);
  box.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', (e) => {
    if (!drag) return;
    vy = (e.clientX - lx) * 0.0004; vx = -(e.clientY - ly) * 0.0004; lx = e.clientX; ly = e.clientY;
  });
  box.addEventListener('pointerup', () => (drag = false));
  box.addEventListener('pointercancel', () => (drag = false));
  gsap.ticker.add((_, dt) => {
    if (!visible) return;
    const k = dt / 16.7;
    ay += vy * k * 4; ax += vx * k * 4;
    if (!drag) { vy += (0.0012 - vy) * 0.02; vx += (0.0006 - vx) * 0.02; }
    const R = box.offsetWidth * 0.4, cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    const fs = Math.max(13, box.offsetWidth * 0.032);
    els.forEach((e, i) => {
      let [x, y, z] = pts[i];
      [x, z] = [x * cy - z * sy, x * sy + z * cy];
      [y, z] = [y * cx - z * sx, y * sx + z * cx];
      const s = (z + 2) / 3;
      e.style.transform = `translate(-50%,-50%) translate3d(${(x * R).toFixed(1)}px,${(y * R).toFixed(1)}px,0) scale(${s.toFixed(3)})`;
      e.style.opacity = (0.25 + s * 0.75).toFixed(2);
      e.style.zIndex = String(Math.round(s * 100));
      e.style.fontSize = fs + 'px';
      const front = z > 0.55;
      e.style.background = front ? `var(${e.dataset.c})` : 'transparent';
      e.style.color = front ? 'var(--on-pastel)' : 'var(--ink)';
    });
  });
})();

/* ───────── more list ───────── */
gsap.from('.more__item', { y: 60, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.more__list', start: 'top 85%', once: true } });

/* ───────── contact ───────── */

(function bounce() {
  const el = $('[data-bounce]');
  el.innerHTML = el.textContent.split(' ').map((w) => `<span style="display:inline-block;white-space:nowrap">${[...w].map((c) => `<span class="ch">${esc(c)}</span>`).join('')}</span>`).join(' ');
  const chars = $$('.ch', el);
  gsap.from(chars, { yPercent: -160, rotate: () => gsap.utils.random(-40, 40), opacity: 0, duration: 1.6, ease: 'elastic.out(1, 0.45)', stagger: { each: 0.035, from: 'random' }, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  chars.forEach((c) => c.addEventListener('pointerenter', () => gsap.fromTo(c, { y: 0 }, { y: -30, rotate: gsap.utils.random(-15, 15), duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: true })));
})();
const toast = $('[data-toast]');
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('is-on');
  clearTimeout(say.t);
  say.t = setTimeout(() => toast.classList.remove('is-on'), 2200);
}
$('[data-copy]').addEventListener('click', async (e) => {
  const v = e.currentTarget.dataset.copy;
  try { await navigator.clipboard.writeText(v); say('Email copied — talk soon ✦'); $('[data-copy-tip]').textContent = 'copied!'; }
  catch { location.href = `mailto:${v}`; }
});

/* ───────── cursor + magnetic ───────── */
if (finePointer) {
  const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
  addEventListener('pointerdown', () => cur.classList.add('is-down'));
  addEventListener('pointerup', () => cur.classList.remove('is-down'));
  gsap.ticker.add(() => {
    rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
    dot.style.translate = `${x}px ${y}px`;
    ring.style.translate = `${rx}px ${ry}px`;
  });
  document.addEventListener('pointerover', (e) => {
    const l = e.target.closest('[data-cursor]');
    const h = e.target.closest('a, button, [data-drag], [data-sphere], [data-holo]');
    cur.classList.toggle('has-label', !!l);
    cur.classList.toggle('is-hover', !!h && !l);
    label.textContent = l ? l.dataset.cursor : '';
  });
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' }));
  });
}

/* ───────── menu ───────── */
const menuBtn = $('[data-menu-toggle]');
const menuTl = gsap.timeline({ paused: true })
  .to('.menu__scrim', { opacity: 1, duration: 0.4, ease: 'power2.out' })
  .to('.menu__panel', { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 0.7, ease: 'expo.out' }, 0)
  .from('.menu__list a', { yPercent: 100, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'expo.out' }, 0.12)
  .from('.menu__head, .menu__foot', { opacity: 0, duration: 0.4 }, 0.3);
function openMenu() {
  document.documentElement.classList.add('menu-open');
  $('[data-menu-label]').textContent = 'Close';
  menuBtn.setAttribute('aria-expanded', 'true');
  $('#menu').setAttribute('aria-hidden', 'false');
  lenis.stop();
  menuTl.timeScale(1).play();
}
function closeMenu(then) {
  if (!document.documentElement.classList.contains('menu-open')) return then?.();
  menuBtn.setAttribute('aria-expanded', 'false');
  $('[data-menu-label]').textContent = 'Menu';
  $('#menu').setAttribute('aria-hidden', 'true');
  menuTl.timeScale(2).reverse().then(() => {
    document.documentElement.classList.remove('menu-open');
    lenis.start();
    then?.();
  });
}
menuBtn.addEventListener('click', () => (document.documentElement.classList.contains('menu-open') ? closeMenu() : openMenu()));
$$('[data-menu-link]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); closeMenu(() => scrollToHash(a.getAttribute('href'))); }));
$('[data-menu-close]').addEventListener('click', () => closeMenu());

/* ───────── header: transparent at the top, solid once you scroll ───────── */
const nav = $('.nav');
lenis.on('scroll', ({ scroll }) => nav.classList.toggle('is-scrolled', scroll > 24));

/* ───────── floating back-to-top ───────── */
(function toTop() {
  const btn = $('[data-totop]');
  const ring = $('.totop__progress circle');
  lenis.on('scroll', ({ scroll, limit }) => {
    btn.classList.toggle('is-on', scroll > innerHeight * 0.9);
    ring.style.setProperty('--off', String(1 - (limit ? scroll / limit : 0)));
  });
  btn.addEventListener('click', () => {
    gsap.fromTo(btn, { y: 0 }, { y: -40, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' });
    smoothTo(0, 1.8);
  });
})();

/* ───────── theme ───────── */
let metaTheme = $('#theme-meta');
function currentTheme() {
  return document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
function syncMeta() {
  const c = currentTheme() === 'dark' ? '#16121E' : '#FFF8F1';
  // Replace the tag rather than editing it: iOS standalone apps pick up a new element more reliably.
  const fresh = metaTheme.cloneNode();
  fresh.setAttribute('content', c);
  metaTheme.replaceWith(fresh);
  metaTheme = fresh;
}
syncMeta();
// Follow the system appearance live while the visitor hasn't picked a theme.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (document.documentElement.dataset.theme) return;
  syncMeta();
  scene?.setDark(currentTheme() === 'dark');
});
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch {}
  syncMeta();
  scene?.setDark(next === 'dark');
  gsap.fromTo('[data-theme-toggle] svg', { rotate: -120, scale: 0.4 }, { rotate: 0, scale: 1, duration: 0.8, ease: 'back.out(2)' });
}));

/* ───────── clock ───────── */
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit' });
const tick = () => $$('[data-clock]').forEach((c) => (c.textContent = `KUL ${fmt.format(new Date())}`));
tick();
setInterval(tick, 15000);

/* ───────── PWA ───────── */
registerSW({ immediate: true });
let deferredPrompt = null;
const installBtn = $('[data-install]');
addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});
addEventListener('appinstalled', () => say('Installed — find me on your home screen ✦'));

addEventListener('load', () => ScrollTrigger.refresh());
