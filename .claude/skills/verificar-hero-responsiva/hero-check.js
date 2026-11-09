/* Verificação responsiva da Hero — Ravena Solar
 * Colar inteiro em javascript_tool (action: javascript_exec) com a aba já
 * redimensionada e recarregada na resolução a testar.
 * Devolve um objeto JSON: { viewport, medidas, problemas[], avisos[], animacao }.
 * "problemas" = reprova a resolução. "avisos" = olhar na captura de tela.
 */
(async () => {
  const T = 2;                       // tolerância em px
  const q = (s, r = document) => r.querySelector(s);
  const hero = q('.hero');
  const problemas = [], avisos = [];
  if (!hero) return { erro: 'Elemento .hero não encontrado' };

  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const R = (el) => el.getBoundingClientRect();
  const r1 = (n) => Math.round(n * 10) / 10;
  const visivel = (el) => {
    const cs = getComputedStyle(el), r = R(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };

  window.scrollTo(0, 0);
  const header = q('.site-header');
  const headerH = header ? R(header).height : 0;
  const h = R(hero);

  /* ---------- 1. Hero inteira, visível e centralizada ---------- */
  const folgaEsq = h.left, folgaDir = vw - h.right;
  if (document.documentElement.scrollWidth > vw + 1)
    problemas.push(`Rolagem horizontal na página: scrollWidth ${document.documentElement.scrollWidth}px > viewport ${vw}px.`);
  if (Math.abs(folgaEsq - folgaDir) > T || h.width < vw - T)
    problemas.push(`Hero não ocupa a largura toda / descentralizada (esq ${r1(folgaEsq)}px, dir ${r1(folgaDir)}px, largura ${r1(h.width)}px de ${vw}px).`);

  const alturaUtil = vh - headerH;
  // REGRA: a hero inteira (casa + texto + botão) cabe na primeira tela, sem rolar.
  if (h.height > alturaUtil + T)
    problemas.push(`Hero (${r1(h.height)}px) é mais alta que a tela útil (${r1(alturaUtil)}px): o visitante precisa rolar para ver tudo. A hero deve caber na primeira tela.`);
  if (h.bottom > vh + T)
    problemas.push(`Base da hero em ${r1(h.bottom)}px, abaixo da tela (${vh}px): parte da hero fica fora da primeira dobra.`);
  if (h.height < alturaUtil - T)
    problemas.push(`Hero (${r1(h.height)}px) não preenche a tela útil (${r1(alturaUtil)}px): sobra faixa embaixo.`);

  /* ---------- 2. Posição e limites dos elementos ---------- */
  const casa = q('.house'), telhado = q('.roof'), parede = q('.wall'), copy = q('.hero-copy');
  const alvos = {
    casa, telhado, parede, copy,
    h1: q('.hero h1'), lead: q('.hero-lead'), cta: q('.btn-primary'), nota: q('.hero-note'),
  };
  const medidas = {};
  for (const [nome, el] of Object.entries(alvos)) {
    if (!el) { problemas.push(`Elemento ausente: ${nome}.`); continue; }
    const r = R(el);
    medidas[nome] = { x: r1(r.left), y: r1(r.top), w: r1(r.width), h: r1(r.height) };
    if (r.left < -T || r.right > vw + T)
      problemas.push(`${nome} fora da área visível na horizontal (${r1(r.left)} → ${r1(r.right)} de ${vw}px).`);
    if (r.left < h.left - T || r.right > h.right + T || r.bottom > h.bottom + T)
      problemas.push(`${nome} extrapola os limites da hero (cortado pelo overflow:hidden).`);
  }

  const centroX = (el) => R(el).left + R(el).width / 2;
  if (casa && Math.abs(centroX(casa) - (h.left + h.width / 2)) > T)
    problemas.push(`Casa descentralizada em ${r1(centroX(casa) - (h.left + h.width / 2))}px em relação à hero.`);
  if (copy && parede && Math.abs(centroX(copy) - centroX(parede)) > T)
    problemas.push(`Bloco de texto descentralizado em ${r1(centroX(copy) - centroX(parede))}px em relação à parede.`);
  if (telhado && casa && Math.abs(R(telhado).width - R(casa).width) > T)
    problemas.push('Telhado não acompanha a largura da casa (proporção do SVG quebrada).');

  /* textos centralizados: cada linha de texto deve estar alinhada ao centro */
  for (const nome of ['h1', 'lead', 'nota']) {
    const el = alvos[nome];
    if (el && getComputedStyle(el).textAlign !== 'center')
      problemas.push(`${nome} não está com text-align:center.`);
  }

  /* ---------- 3. Cortes e sobreposições ---------- */
  for (const nome of ['h1', 'lead', 'cta', 'nota']) {
    const el = alvos[nome];
    if (el && el.scrollWidth > el.clientWidth + 1)
      problemas.push(`Texto de ${nome} estourando o próprio container (scrollWidth ${el.scrollWidth} > ${el.clientWidth}).`);
  }
  if (parede && copy && (R(copy).right > R(parede).right - 4 || R(copy).left < R(parede).left + 4))
    problemas.push('Bloco de texto encosta/ultrapassa a borda da parede.');

  // ordem vertical sem sobreposição: h1 → lead → cta → nota
  const ordem = ['h1', 'lead', 'cta', 'nota'].map((n) => alvos[n]).filter(Boolean);
  for (let i = 0; i < ordem.length - 1; i++)
    if (R(ordem[i]).bottom > R(ordem[i + 1]).top + 1)
      problemas.push(`Sobreposição vertical entre ${['h1', 'lead', 'cta', 'nota'][i]} e ${['h1', 'lead', 'cta', 'nota'][i + 1]}.`);

  // janelas (só visíveis em telas largas) não podem tocar o texto
  const janelas = [...document.querySelectorAll('.window')].filter(visivel);
  janelas.forEach((j) => {
    const a = R(j);
    for (const nome of ['h1', 'lead', 'cta', 'nota']) {
      const b = R(alvos[nome]);
      // usa cada linha real de texto (getClientRects), não o retângulo do bloco
      const range = document.createRange(); range.selectNodeContents(alvos[nome]);
      const linhas = [...range.getClientRects()].filter((t) => t.width > 0 && t.height > 0);
      if (linhas.some((t) => a.left < t.right && a.right > t.left && a.top < t.bottom && a.bottom > t.top))
        problemas.push(`Janela sobrepõe o texto (${nome}).`);
    }
  });
  medidas.janelasVisiveis = janelas.length;

  // CTA: tamanho de toque e posição na primeira dobra
  if (alvos.cta) {
    const c = R(alvos.cta);
    if (c.height < 44) problemas.push(`CTA com altura ${r1(c.height)}px (< 44px, alvo de toque pequeno).`);
    if (c.bottom > vh) problemas.push(`CTA abaixo da primeira dobra (base em ${r1(c.bottom)}px, tela ${vh}px): o botão principal exige rolagem.`);
  }

  // texto inteiro e casa inteira dentro da primeira tela
  for (const nome of ['casa', 'parede', 'h1', 'lead', 'nota']) {
    const el = alvos[nome];
    if (!el) continue;
    const r = R(el);
    if (r.bottom > vh + T)
      problemas.push(`${nome} cortado pela borda inferior da tela (base em ${r1(r.bottom)}px, tela ${vh}px): não dá para ler/ver tudo sem rolar.`);
    if (r.top < headerH - T)
      problemas.push(`${nome} escondido atrás do cabeçalho fixo (topo em ${r1(r.top)}px, cabeçalho até ${r1(headerH)}px).`);
  }

  // centralização vertical: a casa fica no centro da área útil (entre cabeçalho e base da tela)
  if (casa) {
    const c = R(casa);
    const centroCasa = c.top + c.height / 2;
    const centroUtil = headerH + alturaUtil / 2;
    const desvio = centroCasa - centroUtil;
    medidas.centroVertical = { desvioPx: r1(desvio), limitePx: r1(alturaUtil * 0.2) };
    if (Math.abs(desvio) > alturaUtil * 0.2)
      problemas.push(`Casa descentralizada na vertical: centro ${r1(Math.abs(desvio))}px ${desvio > 0 ? 'abaixo' : 'acima'} do centro da área útil (limite ${r1(alturaUtil * 0.2)}px).`);
    // respiro mínimo entre a casa e a base da tela (chão) e sobra de céu para o sol
    const folgaBase = vh - c.bottom, folgaTopo = c.top - headerH;
    medidas.folgas = { topoCeuPx: r1(folgaTopo), baseChaoPx: r1(folgaBase) };
    if (folgaBase < 8) problemas.push(`Casa colada/cortada na base da tela (folga ${r1(folgaBase)}px).`);
    if (folgaTopo < 60) problemas.push(`Pouco céu acima do telhado (${r1(folgaTopo)}px): o sol não tem espaço para cruzar.`);
  }

  // texto mínimo legível
  for (const nome of ['h1', 'lead', 'nota']) {
    const fs = parseFloat(getComputedStyle(alvos[nome]).fontSize);
    medidas[nome].fonte = r1(fs);
    if (fs < 14) problemas.push(`${nome} com fonte ${r1(fs)}px (< 14px).`);
  }

  /* ---------- 4. Regras do DESIGN.md ---------- */
  const navy = 'rgb(18, 58, 85)';
  for (const nome of ['h1', 'lead', 'nota']) {
    if (getComputedStyle(alvos[nome]).color !== navy)
      problemas.push(`${nome} fora do azul-marinho #123A55 (${getComputedStyle(alvos[nome]).color}).`);
  }
  const fam = getComputedStyle(alvos.h1).fontFamily;
  if (!/Helvetica Neue/.test(fam)) problemas.push(`Família tipográfica fora do padrão: ${fam}.`);
  const peso = getComputedStyle(alvos.h1).fontWeight;
  if (peso !== '700') avisos.push(`h1 com font-weight ${peso}; DESIGN.md pede 700.`);

  /* ---------- 5. Ilustração e animação ---------- */
  const sol = q('.sun'), brilho = q('.glint');
  const animacao = { reduzirMovimento: matchMedia('(prefers-reduced-motion: reduce)').matches };
  const snap = () => ({
    sol: sol ? getComputedStyle(sol).transform : null,
    solOp: sol ? getComputedStyle(sol).opacity : null,
    ceu: getComputedStyle(hero).getPropertyValue('--sky-top').trim(),
    brilhoX: brilho ? brilho.getAttribute('x') : null,
    raios: getComputedStyle(q('.sun-rays')).transform,
  });
  const a = snap();
  // espera por quadros (rAF), não por setTimeout: em aba sem foco o setTimeout
  // pode vencer sem que o navegador tenha renderizado nenhum quadro
  const t0 = performance.now();
  await Promise.race([
    new Promise((r) => { const f = () => (performance.now() - t0 > 1500 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }),
    new Promise((r) => setTimeout(r, 4000)),   // painel oculto: rAF não roda; não travar
  ]);
  animacao.painelOculto = document.hidden || performance.now() - t0 > 3500;
  if (animacao.painelOculto)
    avisos.push('Painel do navegador oculto/sem renderização: animação NÃO pôde ser verificada. Mostrar o painel e rodar de novo.');
  const b = snap();
  animacao.antes = a; animacao.depois = b;
  animacao.solSeMexe = a.sol !== b.sol;
  animacao.ceuMuda = a.ceu !== b.ceu;
  animacao.brilhoSeMexe = a.brilhoX !== b.brilhoX;
  animacao.raiosGiram = a.raios !== b.raios;
  animacao.estrelas = document.querySelectorAll('.star').length;

  const medirAnim = !animacao.reduzirMovimento && !animacao.painelOculto;
  if (medirAnim && !animacao.solSeMexe)
    problemas.push('Animação do sol parada (transform não mudou em 1,5 s). Verificar script.js / IntersectionObserver.');
  if (medirAnim && !animacao.raiosGiram)
    problemas.push('Raios do sol não estão girando.');

  if (sol) {
    const s = R(sol);
    animacao.solNaTela = s.right > h.left && s.left < h.right && s.bottom > h.top && s.top < h.bottom;
    if (getComputedStyle(sol).opacity > 0.05 && !animacao.solNaTela)
      problemas.push('Sol visível porém fora da área da hero.');
    // sol não pode passar por cima do texto (deve ficar atrás da casa)
    const z = (el) => parseInt(getComputedStyle(el).zIndex) || 0;
    if (parseFloat(getComputedStyle(sol).opacity) > 0.05 && alvos.copy) {
      const c = R(alvos.copy), sr = R(sol);
      const cx = sr.left + sr.width / 2, cy = sr.top + sr.height / 2;
      const topo = document.elementFromPoint(
        Math.min(Math.max(cx, 0), vw - 1), Math.min(Math.max(cy, 0), vh - 1));
      if (topo && topo.closest('.sun') && cx > c.left && cx < c.right && cy > c.top && cy < c.bottom)
        problemas.push('Sol aparece por cima do texto da hero.');
    }
  }

  /* ---------- Resultado ---------- */
  return {
    viewport: `${vw}×${vh}`,
    dpr: devicePixelRatio,
    hero: { x: r1(h.left), y: r1(h.top), w: r1(h.width), h: r1(h.height), folgaEsq: r1(folgaEsq), folgaDir: r1(folgaDir) },
    medidas,
    animacao,
    avisos,
    problemas,
    aprovado: problemas.length === 0,
  };
})()
