/* =========================================================
   Hero — ciclo do dia
   O sol cruza o céu em arco, por cima do texto, da esquerda
   para a direita; o fundo escurece até a noite e depois
   amanhece de novo.
   ========================================================= */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const sun = hero.querySelector('.sun');
  const copy = hero.querySelector('.hero-copy');
  const starsBox = hero.querySelector('.stars');
  const glint = hero.querySelector('.glint');

  /* ---------- tempos (ms) ---------- */
  const TRAVEL = 16000; // sol atravessando o céu
  const NIGHT = 3500;   // noite parada
  const DAWN = 3000;    // amanhecer (volta ao dia)
  const CYCLE = TRAVEL + NIGHT + DAWN;

  /* ---------- cores-chave ao longo do dia (p = 0 → 1) ---------- */
  const KEYS = [
    { p: 0.00, top: '#FEF7EE', bottom: '#FEF7EE' },
    { p: 0.40, top: '#FDEDD8', bottom: '#FEF7EE' },
    { p: 0.68, top: '#8A99A3', bottom: '#FBDDB8' },
    { p: 0.86, top: '#1B4462', bottom: '#557085' },
    { p: 1.00, top: '#0B2638', bottom: '#123A55' },
  ];

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  KEYS.forEach((k) => { k.topRGB = hex(k.top); k.bottomRGB = hex(k.bottom); });

  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const smooth = (x) => x * x * (3 - 2 * x);
  const smoothstep = (a, b, x) => smooth(clamp01((x - a) / (b - a)));
  const mix = (a, b, t) => a + (b - a) * t;
  const mixRGB = (a, b, t) => a.map((v, i) => mix(v, b[i], t));
  const rgb = (c) => `rgb(${c.map(Math.round).join(',')})`;

  function skyAt(p) {
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    const t = smooth(clamp01((p - a.p) / (b.p - a.p)));
    return {
      top: mixRGB(a.topRGB, b.topRGB, t),
      bottom: mixRGB(a.bottomRGB, b.bottomRGB, t),
    };
  }

  const SUN_DAY = hex('#F2A03D');
  const SUN_DUSK = hex('#E8721C');

  /* ---------- estrelas ---------- */
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('span');
    s.className = 'star' + (rand() > 0.82 ? ' is-big' : '');
    s.style.left = (rand() * 100).toFixed(2) + '%';
    s.style.top = (rand() * 100).toFixed(2) + '%';
    s.style.animationDelay = (-rand() * 3.2).toFixed(2) + 's';
    starsBox.appendChild(s);
  }

  /* ---------- geometria: arco relativo à hero e ao texto ---------- */
  // o sol nasce na borda esquerda, sobe acima do título e se põe na borda
  // direita passando atrás da casa; nunca desce até a altura do texto
  let W = 0, S = 0, yBase = 0, yPeak = 0;
  function measure() {
    W = hero.clientWidth;
    S = sun.offsetWidth;
    const copyTop = copy.offsetTop;
    yBase = Math.max(S * 0.6, copyTop - S * 0.55);    // centro do sol no nascer/pôr
    yPeak = Math.min(yBase, S * 0.5);                 // centro do sol no meio-dia
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    ro.observe(copy);
  }

  /* ---------- desenho de um quadro ---------- */
  const style = hero.style;
  function render(p, sky, starOp, sunOp, night) {
    style.setProperty('--sky-top', rgb(sky.top));
    style.setProperty('--sky-bottom', rgb(sky.bottom));
    style.setProperty('--stars', starOp.toFixed(3));
    style.setProperty('--panel', (0.92 * night).toFixed(3));
    style.setProperty('--lights', night.toFixed(3));
    style.setProperty('--sun-core', rgb(mixRGB(SUN_DAY, SUN_DUSK, smoothstep(0.55, 0.9, p))));

    const cx = mix(-0.04, 1.04, p) * W;
    const cy = mix(yBase, yPeak, Math.sin(Math.PI * p));
    sun.style.transform = `translate3d(${(cx - S / 2).toFixed(1)}px, ${(cy - S / 2).toFixed(1)}px, 0)`;
    sun.style.opacity = sunOp.toFixed(3);
  }

  /* reflexo que varre os painéis solares durante o dia */
  const GLINT = 6000;
  function glintAt(time, day) {
    if (!glint) return;
    const g = (time % GLINT) / GLINT;
    glint.setAttribute('x', (-200 + g * 1500).toFixed(0));
    glint.setAttribute('opacity', (0.22 * day).toFixed(3));
  }

  function frameAt(time) {
    const t = time % CYCLE;
    glintAt(time, t < TRAVEL ? 1 - smoothstep(0.55, 0.8, t / TRAVEL) : 0);
    if (t < TRAVEL) {
      const p = t / TRAVEL;
      const sunOp = smoothstep(0, 0.06, p) * (1 - smoothstep(0.9, 1, p));
      render(p, skyAt(p), smoothstep(0.74, 0.96, p), sunOp, smoothstep(0.55, 0.85, p));
    } else if (t < TRAVEL + NIGHT) {
      render(1, skyAt(1), 1, 0, 1);
    } else {
      // amanhecer: noite → manhã; o sol volta a nascer à esquerda
      const q = smooth((t - TRAVEL - NIGHT) / DAWN);
      const n = skyAt(1), d = skyAt(0);
      const sky = { top: mixRGB(n.top, d.top, q), bottom: mixRGB(n.bottom, d.bottom, q) };
      render(0, sky, 1 - q, 0, 1 - q);
    }
  }

  /* ---------- movimento reduzido: cena estática de dia ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) {
    render(0.5, skyAt(0.3), 0, 1, 0);
    return;
  }

  /* ---------- loop (pausa fora da tela) ---------- */
  let elapsed = 0, last = null, raf = 0;
  function tick(now) {
    if (last !== null) elapsed += Math.min(now - last, 50);
    last = now;
    frameAt(elapsed);
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf) { last = null; raf = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }).observe(hero);
  }
  frameAt(0);
  start();
})();
