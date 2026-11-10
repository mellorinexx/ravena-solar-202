/* =========================================================
   Seções depois da hero
   - revelação ao rolar (.reveal → .is-visible)
   - formulário de simulação com regra de qualificação
   ========================================================= */
(function () {
  document.documentElement.classList.add('js');

  /* ---------- contagem de valores ([data-count]) ----------
     Sobe de 0 até o valor quando o bloco aparece na tela.
     Opções: data-prefix ("R$ "), data-decimals (4,8 → 1),
     data-delay e data-duration em ms. O cofrinho usa o mesmo tempo
     das três moedas (styles.css: .coin-drop).
     Sem animação se o sistema pedir menos movimento. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function formatCount(el, n) {
    const dec = Number(el.dataset.decimals || 0);
    const prefix = (el.dataset.prefix || '').replace(' ', ' ');
    return prefix + n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  const counters = reduceMotion ? [] : document.querySelectorAll('[data-count]');
  counters.forEach((el) => {
    const final = formatCount(el, Number(el.dataset.count));
    // leitor de tela ouve só o valor final, nunca a contagem
    if (!el.hasAttribute('aria-hidden')) {
      const sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = final;
      el.after(sr);
      el.setAttribute('aria-hidden', 'true');
    }
    // largura do valor final reservada desde o início: o texto não "pula"
    el.style.display = 'inline-block';
    el.style.minWidth = final.length + 'ch';
    el.textContent = formatCount(el, 0);
  });

  function runCount(el) {
    const target = Number(el.dataset.count);
    const delay = Number(el.dataset.delay || 0);
    const duration = Number(el.dataset.duration || 1600);
    let start = null;
    const step = (t) => {
      if (start === null) start = t + delay;
      const p = Math.min(Math.max((t - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - p, 2);   // desacelera no fim, sem chegar cedo demais
      el.textContent = formatCount(el, target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function show(el) {
    el.classList.add('is-visible');
    if (!reduceMotion) el.querySelectorAll('[data-count]').forEach(runCount);
  }

  /* ---------- revelação ao rolar ---------- */
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          show(e.target);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach(show);
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

  /* ---------- lista de cidades no estilo do site ----------
     Troca a lista nativa do <datalist> (preta, fora da paleta) por uma lista
     própria. O campo continua aceitando texto livre (outras cidades até 80 km). */
  (function cityCombo() {
    const input = f.cidade;
    const dl = document.getElementById('cidades');
    if (!input || !dl) return;
    const cities = Array.from(dl.options, (o) => o.value);
    const norm = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    const wrap = document.createElement('div');
    wrap.className = 'combo';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    const list = document.createElement('ul');
    list.className = 'combo-list';
    list.id = 'cidades-lista';
    list.setAttribute('role', 'listbox');
    list.hidden = true;
    wrap.appendChild(list);

    input.removeAttribute('list');
    dl.remove();
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-expanded', 'false');

    let items = [];
    let active = -1;

    function setActive(i) {
      active = i;
      items.forEach((li, k) => li.classList.toggle('is-active', k === i));
      if (i >= 0) {
        input.setAttribute('aria-activedescendant', items[i].id);
        items[i].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }
    function close() {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      setActive(-1);
    }
    function choose(city) {
      input.value = city;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      close();
    }
    function open(filter) {
      const q = norm(filter.trim());
      const found = cities.filter((c) => !q || norm(c).includes(q));
      list.replaceChildren();
      items = found.map((c, k) => {
        const li = document.createElement('li');
        li.id = 'cidade-op-' + k;
        li.setAttribute('role', 'option');
        li.textContent = c;
        li.addEventListener('mousedown', (e) => { e.preventDefault(); choose(c); });
        list.appendChild(li);
        return li;
      });
      if (!items.length) { close(); return; }
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      setActive(-1);
    }

    input.addEventListener('focus', () => open(''));
    input.addEventListener('click', () => { if (list.hidden) open(''); });
    input.addEventListener('input', () => open(input.value));
    input.addEventListener('blur', close);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (list.hidden) open(input.value);
        if (!items.length) return;
        const d = e.key === 'ArrowDown' ? 1 : -1;
        setActive((active + d + items.length) % items.length);
      } else if (e.key === 'Enter' && !list.hidden && active >= 0) {
        e.preventDefault();
        choose(items[active].textContent);
      } else if (e.key === 'Escape' && !list.hidden) {
        e.preventDefault();
        close();
      }
    });
  })();

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

  /* O formulário ainda não envia para lugar nenhum: a Ravena Solar não tem
     e-mail próprio ainda. Por enquanto só mostra a mensagem de enviado;
     o envio será ligado aqui quando o e-mail existir. */
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();

/* =========================================================
   Mapa "Onde atendemos": cidade selecionada no mapa ou na lista
   ========================================================= */
(function () {
  const area = document.getElementById('area');
  if (!area) return;
  const status = document.getElementById('area-status');
  const items = area.querySelectorAll('.area-item');
  const sede = '<strong>Sorocaba</strong> · sede da Ravena Solar';
  let current = null;

  function select(n) {
    current = current === n ? null : n;
    area.querySelectorAll('.area-city, .area-pin').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.city === current);
    });
    items.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.city === current)));
    const btn = current && area.querySelector('.area-item[data-city="' + current + '"]');
    if (!btn) { status.innerHTML = sede; return; }
    const name = btn.lastChild.textContent.trim();
    status.innerHTML = current === '1'
      ? sede
      : '<strong>' + name + '</strong> · ' + btn.dataset.km + '&nbsp;km da sede em Sorocaba';
  }

  items.forEach((b) => b.addEventListener('click', () => select(b.dataset.city)));
  area.querySelectorAll('.area-city, .area-pin').forEach((el) => {
    el.addEventListener('click', () => select(el.dataset.city));
  });
})();

/* =========================================================
   Garantia: a barra de idades (5, 10, 25 anos) troca o personagem,
   o texto e o marcador. Abas acessíveis: setas, Home e End mudam
   de idade; só a fase visível fica animada (styles.css).
   ========================================================= */
(function () {
  const life = document.getElementById('life');
  if (!life) return;
  const tabs = Array.from(life.querySelectorAll('[role="tab"]'));
  const rail = life.querySelector('.life-rail');
  const svg = document.getElementById('life-svg');
  const figs = life.querySelectorAll('.life-fig');
  const panels = life.querySelectorAll('.life-panel');
  const labels = {
    5: 'Criança de 5 anos brincando com um cata-vento em frente à casa com painéis solares',
    10: 'O mesmo filho aos 10 anos, chutando uma bola em frente à casa com painéis solares',
    25: 'O mesmo filho aos 25 anos, de terno e com uma maleta, saindo para trabalhar',
  };

  function select(index, focus) {
    const tab = tabs[index];
    const age = tab.dataset.age;
    tabs.forEach((t, i) => {
      t.setAttribute('aria-selected', String(i === index));
      t.tabIndex = i === index ? 0 : -1;
    });
    figs.forEach((f) => f.classList.toggle('is-active', f.dataset.age === age));
    panels.forEach((p) => {
      const on = p.id === tab.getAttribute('aria-controls');
      p.classList.toggle('is-active', on);
      p.tabIndex = on ? 0 : -1;
    });
    rail.style.setProperty('--i', index);
    svg.setAttribute('aria-label', labels[age]);
    if (focus) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, false));
    tab.addEventListener('keydown', (ev) => {
      let next = null;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      else if (ev.key === 'Home') next = 0;
      else if (ev.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      ev.preventDefault();
      select(next, true);
    });
  });

  // as animações só rodam com o palco na tela
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => life.classList.toggle('is-live', e.isIntersecting));
    }, { threshold: 0.05 }).observe(life);
  } else {
    life.classList.add('is-live');
  }
})();

/* =========================================================
   Sistema: quando o telhado entra na tela, os painéis são instalados
   (styles.css, .is-built) e a potência conta de 5 até 8 kWp; no fim
   o 5 sai de dentro do 8 e o número vira a faixa '5 a 8 kWp'.
   Roda uma vez só. Sem JS ou com menos movimento, tudo já aparece pronto.
   ========================================================= */
(function () {
  const roof = document.getElementById('roof');
  const kwp = document.getElementById('kwp');
  const num = document.getElementById('kwp-num');
  if (!roof || !kwp || !num) return;
  const section = roof.closest('.system');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    section.classList.add('is-built');
    kwp.classList.add('is-range');
    return;
  }

  const PANELS_DONE = 1900;   // último painel assentado (styles.css: rf-install)
  const STEP = 300;           // intervalo entre 5 → 6 → 7 → 8
  num.textContent = '5';

  function build() {
    section.classList.add('is-built');
    setTimeout(() => {
      kwp.classList.add('is-counting');   // a barra enche junto com a contagem
      [6, 7, 8].forEach((n, i) => {
        setTimeout(() => {
          num.textContent = n;
          num.classList.remove('is-tick');
          void num.offsetWidth;            // reinicia a animação do dígito
          num.classList.add('is-tick');
        }, STEP * (i + 1));
      });
      setTimeout(() => kwp.classList.add('is-range'), STEP * 3 + 550);
    }, PANELS_DONE);
  }

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    build();
  }, { threshold: 0.4 });
  io.observe(roof);
})();
