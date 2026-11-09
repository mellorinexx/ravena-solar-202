/* =========================================================
   Hero — ciclo do dia
   O sol cruza o céu da esquerda para a direita e o fundo
   escurece gradualmente até a noite; depois amanhece de novo.
   ========================================================= */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const sun = hero.querySelector('.sun');
  const starsBox = hero.querySelector('.stars');
  const glint = hero.querySelector('.glint');
  const house = hero.querySelector('.house');

  /* ---------- tempos (ms) ---------- */
  const TRAVEL = 18000; // sol atravessando o céu
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
  for (let i = 0; i < 46; i++) {
    const s = document.createElement('span');
    s.className = 'star' + (rand() > 0.82 ? ' is-big' : '');
    s.style.left = (rand() * 100).toFixed(2) + '%';
    s.style.top = (rand() * 100).toFixed(2) + '%';
    s.style.animationDelay = (-rand() * 3.2).toFixed(2) + 's';
    starsBox.appendChild(s);
  }

  /* ---------- geometria: tudo relativo à largura da casa ---------- */
  // o sol é filho de .house: nasce atrás da parede esquerda, passa por trás do
  // telhado (aparecendo acima da cumeeira, como na referência) e se põe à direita
  let W = 0, sunSize = 0;
  function measure() {
    W = house.offsetWidth;
    sunSize = sun.offsetWidth;
  }
  measure();
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(house);
  else window.addEventListener('resize', measure);

  /* ---------- desenho de um quadro ---------- */
  const style = hero.style;
  function render(p, sky, starOp, sunOp) {
    style.setProperty('--sky-top', rgb(sky.top));
    style.setProperty('--sky-bottom', rgb(sky.bottom));
    style.setProperty('--sunp', p.toFixed(4));
    style.setProperty('--stars', starOp.toFixed(3));
    style.setProperty('--lights', smoothstep(0.72, 0.92, p).toFixed(3));
    style.setProperty('--sun-core', rgb(mixRGB(SUN_DAY, SUN_DUSK, smoothstep(0.55, 0.9, p))));

    // trajetória em arco por trás da casa: esquerda → direita
    const x = mix(0.10, 0.90, p) * W - sunSize / 2;
    // sobe rápido por trás da casa e corre num arco alto e achatado, com o
    // miolo parcialmente escondido pelo telhado (como na referência)
    const k = smooth(Math.min(1, Math.sin(Math.PI * p) * 2));
    const y = (0.21 - 0.24 * k) * W - sunSize / 2;
    sun.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    sun.style.opacity = sunOp.toFixed(3);

    // reflexo nos painéis acompanha o sol
    glint.setAttribute('x', mix(60, 900, p).toFixed(1));
    glint.style.opacity = (1 - smoothstep(0.55, 0.8, p)).toFixed(3);
  }

  function frameAt(time) {
    const t = time % CYCLE;
    if (t < TRAVEL) {
      const p = t / TRAVEL;
      const sunOp = smoothstep(0, 0.04, p) * (1 - smoothstep(0.93, 1, p));
      render(p, skyAt(p), smoothstep(0.74, 0.96, p), sunOp);
    } else if (t < TRAVEL + NIGHT) {
      render(1, skyAt(1), 1, 0);
    } else {
      // amanhecer: noite → manhã, sol reaparece à esquerda
      const q = smooth((t - TRAVEL - NIGHT) / DAWN);
      const n = skyAt(1), d = skyAt(0);
      const sky = { top: mixRGB(n.top, d.top, q), bottom: mixRGB(n.bottom, d.bottom, q) };
      render(0, sky, 1 - q, 0);
      style.setProperty('--lights', (1 - q).toFixed(3));
      glint.style.opacity = q.toFixed(3);
    }
  }

  /* ---------- movimento reduzido: cena estática de dia ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) {
    render(0.32, skyAt(0.32), 0, 1);
    return;
  }

  /* ---------- loop (pausa fora da tela) ---------- */
  let elapsed = 0, last = null, running = true, raf = 0;
  function tick(now) {
    if (last !== null) elapsed += Math.min(now - last, 50);
    last = now;
    frameAt(elapsed);
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!raf) { last = null; raf = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { running = e.isIntersecting; running ? start() : stop(); }).observe(hero);
  }
  frameAt(0);
  start();
})();
