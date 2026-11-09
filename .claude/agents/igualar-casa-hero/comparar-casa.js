// Compara a casa SVG da hero (svg.house) com a referência referencias/casa-hero.webp.
// Uso: colar o arquivo inteiro no javascript_tool da página do site (preview "site").
// Retorna JSON com a nota geral, as notas por região e as piores regiões, e desenha
// um painel por cima da página (referência | SVG | mapa de diferenças) para a captura.
// Para tirar o painel: recarregar a página.
(async () => {
  const W = 1402, H = 1122;          // tamanho da referência = sistema de coordenadas do SVG
  const S = 0.5;                     // compara em meia resolução (menos ruído de antialias)
  const w = Math.round(W * S), h = Math.round(H * S);
  const GRID_X = 8, GRID_Y = 6;

  const svgEl = document.querySelector('svg.house');
  if (!svgEl) return { erro: 'svg.house não encontrado' };

  // Congela animações CSS no início para comparar um estado estável (dia).
  document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = 0; } catch (e) {} });

  const loadImg = src => new Promise((ok, err) => {
    const i = new Image(); i.onload = () => ok(i); i.onerror = () => err(new Error('falha ao carregar ' + src)); i.src = src;
  });

  // Clona o SVG copiando os estilos calculados (fill/stroke/opacity vêm às vezes do CSS).
  const clone = svgEl.cloneNode(true);
  const props = ['fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'stroke-opacity', 'display', 'visibility', 'transform'];
  const src = [svgEl, ...svgEl.querySelectorAll('*')], dst = [clone, ...clone.querySelectorAll('*')];
  src.forEach((el, i) => {
    const cs = getComputedStyle(el);
    props.forEach(p => { const v = cs.getPropertyValue(p); if (v && p !== 'transform') dst[i].style.setProperty(p, v); });
  });
  clone.setAttribute('viewBox', `0 0 ${W} ${H}`);
  clone.setAttribute('width', W); clone.setAttribute('height', H);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));

  const [ref, mine] = await Promise.all([loadImg('/referencias/casa-hero.webp?t=' + Date.now()), loadImg(svgUrl)]);

  const mk = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const cRef = mk(), cSvg = mk(), cDiff = mk();
  const xRef = cRef.getContext('2d', { willReadFrequently: true });
  xRef.drawImage(ref, 0, 0, w, h);
  const bg = xRef.getImageData(2, 2, 1, 1).data; // cor do fundo creme da referência
  const xSvg = cSvg.getContext('2d', { willReadFrequently: true });
  xSvg.fillStyle = `rgb(${bg[0]},${bg[1]},${bg[2]})`; xSvg.fillRect(0, 0, w, h);
  xSvg.drawImage(mine, 0, 0, w, h);

  const a = xRef.getImageData(0, 0, w, h).data, b = xSvg.getImageData(0, 0, w, h).data;
  const xDiff = cDiff.getContext('2d'); const dImg = xDiff.createImageData(w, h);
  const cellSum = new Float64Array(GRID_X * GRID_Y), cellN = new Float64Array(GRID_X * GRID_Y);
  let total = 0, n = 0, bad = 0, refInk = 0, hit = 0;
  const isBg = (d, i) => Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]) < 30;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const dr = a[i] - b[i], dg = a[i + 1] - b[i + 1], db = a[i + 2] - b[i + 2];
    const d = Math.sqrt(dr * dr + dg * dg + db * db) / 441.7; // 0 = igual, 1 = oposto
    total += d; n++; if (d > 0.25) bad++;
    const ra = !isBg(a, i), rb = !isBg(b, i); if (ra) { refInk++; if (rb) hit++; }
    const c = Math.floor(x / w * GRID_X) + GRID_X * Math.floor(y / h * GRID_Y);
    cellSum[c] += d; cellN[c]++;
    const v = d < 0.12 ? 0 : Math.min(255, d * 2 * 255); // ignora ruído leve de textura/antialias
    dImg.data[i] = 255; dImg.data[i + 1] = 255 - v; dImg.data[i + 2] = 255 - v; dImg.data[i + 3] = 255;
  }
  xDiff.putImageData(dImg, 0, 0);

  const pct = v => Math.round(v * 1000) / 10;
  const cells = [];
  for (let gy = 0; gy < GRID_Y; gy++) for (let gx = 0; gx < GRID_X; gx++) {
    const c = gx + GRID_X * gy;
    cells.push({
      regiao: `col ${gx + 1}, lin ${gy + 1}`,
      caixa_ref_px: { x: Math.round(gx * W / GRID_X), y: Math.round(gy * H / GRID_Y), w: Math.round(W / GRID_X), h: Math.round(H / GRID_Y) },
      semelhanca: pct(1 - (cellSum[c] / cellN[c]) * 3) // escala x3: diferenças pequenas já derrubam a nota
    });
  }
  const sorted = [...cells].sort((p, q) => p.semelhanca - q.semelhanca);

  // Painel visual para a captura de tela.
  document.getElementById('cmp-painel')?.remove();
  const p = document.createElement('div'); p.id = 'cmp-painel';
  p.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#fff;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4px;padding:4px';
  const lab = (cv, t) => { const d = document.createElement('div'); d.style.cssText = 'position:relative;min-height:0;display:flex;align-items:center;justify-content:center;border:1px solid #ccc';
    cv.style.cssText = 'max-width:100%;max-height:100%'; const s = document.createElement('span'); s.textContent = t;
    s.style.cssText = 'position:absolute;top:2px;left:4px;font:12px sans-serif;background:#fff;padding:1px 4px'; d.append(cv, s); return d; };
  const cOver = mk(); const xo = cOver.getContext('2d'); xo.drawImage(cRef, 0, 0); xo.globalAlpha = 0.5; xo.drawImage(cSvg, 0, 0);
  // grade com o número da região
  [cDiff, cOver].forEach(cv => { const x = cv.getContext('2d'); x.globalAlpha = 1; x.strokeStyle = 'rgba(0,0,0,.25)'; x.font = '11px sans-serif'; x.fillStyle = '#000';
    for (let gy = 0; gy < GRID_Y; gy++) for (let gx = 0; gx < GRID_X; gx++) { const cx = gx * w / GRID_X, cy = gy * h / GRID_Y;
      x.strokeRect(cx, cy, w / GRID_X, h / GRID_Y); x.fillText(`${gx + 1},${gy + 1}`, cx + 3, cy + 12); } });
  p.append(lab(cRef, 'REFERÊNCIA'), lab(cSvg, 'SVG ATUAL'), lab(cOver, 'SOBREPOSIÇÃO 50%'), lab(cDiff, 'DIFERENÇA (vermelho = diferente)'));
  document.body.append(p);

  return {
    semelhanca_geral: pct(1 - (total / n) * 3),
    pixels_muito_diferentes_pct: pct(bad / n),
    cobertura_da_silhueta_pct: pct(hit / Math.max(1, refInk)),
    piores_regioes: sorted.slice(0, 8),
    todas_regioes: cells
  };
})();
