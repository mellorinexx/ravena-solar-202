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

/* =========================================================
   Seções depois da hero
   - revelação ao rolar (.reveal → .is-visible)
   - formulário de simulação com regra de qualificação
   ========================================================= */
(function () {
  document.documentElement.classList.add('js');

  /* ---------- revelação ao rolar ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- simulação ---------- */
  const form = document.getElementById('sim-form');
  if (!form) return;

  const MIN_BILL = 450;               // critério atual: conta acima de R$ 450
  const MAX_FILE = 10 * 1024 * 1024;  // 10 MB

  const f = {
    nome: form.elements.nome,
    whats: form.elements.whatsapp,
    cidade: form.elements.cidade,
    conta: form.elements.conta,
    arquivo: form.elements.arquivo,
  };
  const submit = document.getElementById('sim-submit');
  const qualify = document.getElementById('qualify-msg');
  const fileText = document.getElementById('file-text');
  const success = document.getElementById('sim-success');
  const FILE_DEFAULT = fileText.textContent;

  const digits = (s) => s.replace(/\D/g, '');

  // "1.234,56" / "1234,5" / "780" → número
  function parseMoney(s) {
    const clean = s.replace(/[^\d,.]/g, '');
    if (!clean) return NaN;
    const normalized = clean.includes(',')
      ? clean.replace(/\./g, '').replace(',', '.')
      : clean.replace(/\.(?=\d{3}(\D|$))/g, '');
    return parseFloat(normalized);
  }

  function setError(input, id, msg) {
    document.getElementById(id).textContent = msg || '';
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-errormessage', id);
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-errormessage');
    }
    return !msg;
  }

  /* máscara do WhatsApp: (15) 99999-9999 */
  f.whats.addEventListener('input', () => {
    const d = digits(f.whats.value).slice(0, 11);
    let out = d;
    if (d.length > 2) out = `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 7) out = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
    f.whats.value = out;
  });

  /* regra de qualificação: avaliada enquanto a pessoa digita */
  function checkBill() {
    const v = parseMoney(f.conta.value);
    const below = !isNaN(v) && v <= MIN_BILL;
    qualify.hidden = !below;
    submit.disabled = below;
    return { value: v, qualified: !isNaN(v) && v > MIN_BILL };
  }
  f.conta.addEventListener('input', () => {
    f.conta.value = f.conta.value.replace(/[^\d,.]/g, '');
    setError(f.conta, 'e-conta', '');
    checkBill();
  });

  f.arquivo.addEventListener('change', () => {
    const file = f.arquivo.files[0];
    if (!file) { fileText.textContent = FILE_DEFAULT; setError(f.arquivo, 'e-arquivo', ''); return; }
    const okType = file.type.startsWith('image/') || file.type === 'application/pdf';
    if (!okType || file.size > MAX_FILE) {
      f.arquivo.value = '';
      fileText.textContent = FILE_DEFAULT;
      setError(f.arquivo, 'e-arquivo', !okType ? 'Envie uma foto ou um arquivo PDF.' : 'O arquivo precisa ter até 10 MB.');
      return;
    }
    setError(f.arquivo, 'e-arquivo', '');
    fileText.textContent = file.name;
  });

  // limpa o erro do campo assim que a pessoa corrige
  [['nome', 'e-nome'], ['whats', 'e-whats'], ['cidade', 'e-cidade']].forEach(([k, id]) => {
    f[k].addEventListener('input', () => setError(f[k], id, ''));
  });

  function validate() {
    const bill = checkBill();
    const okNome = setError(f.nome, 'e-nome', f.nome.value.trim().length < 2 ? 'Informe o seu nome.' : '');
    const nWhats = digits(f.whats.value).length;
    const okWhats = setError(f.whats, 'e-whats', nWhats < 10 ? 'Informe um WhatsApp com DDD.' : '');
    const okCidade = setError(f.cidade, 'e-cidade', f.cidade.value.trim().length < 2 ? 'Informe a sua cidade.' : '');
    const okConta = setError(f.conta, 'e-conta', isNaN(bill.value) ? 'Informe o valor médio da sua conta de luz.' : '');
    const first = [[okNome, f.nome], [okWhats, f.whats], [okCidade, f.cidade], [okConta, f.conta]].find(([ok]) => !ok);
    if (first) first[1].focus();
    return okNome && okWhats && okCidade && okConta && bill.qualified;
  }

  const sendError = document.getElementById('e-envio');
  const submitLabel = submit.firstChild.textContent;

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    sendError.textContent = '';
    if (!validate()) return;

    submit.disabled = true;
    submit.firstChild.textContent = 'Enviando… ';
    try {
      await sendLead();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch (err) {
      console.error(err);
      sendError.textContent = 'Não foi possível enviar agora. Confira sua conexão e tente de novo.';
      submit.disabled = false;
    } finally {
      submit.firstChild.textContent = submitLabel;
    }
  });

  /* ---------- envio: Google Apps Script → planilha + e-mail ----------
     A URL fica no atributo data-endpoint do <form> (index.html).
     Instalação: integracoes/LEIA-ME.md */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1]);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  }

  async function sendLead() {
    const endpoint = form.dataset.endpoint;
    if (!endpoint) throw new Error('Envio não configurado: preencha data-endpoint no formulário.');

    const file = f.arquivo.files[0];
    const payload = {
      nome: f.nome.value.trim(),
      whatsapp: digits(f.whats.value),
      cidade: f.cidade.value.trim(),
      conta: parseMoney(f.conta.value),
      site: form.elements.site.value,   // campo-armadilha contra robôs
      arquivo: file ? { nome: file.name, tipo: file.type, base64: await fileToBase64(file) } : null,
    };

    // text/plain evita o preflight de CORS, que o Apps Script não responde
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    const out = await res.json();
    if (!out.ok) throw new Error('Apps Script recusou: ' + out.erro);
  }
})();
