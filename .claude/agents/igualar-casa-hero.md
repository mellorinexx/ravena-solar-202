---
name: igualar-casa-hero
description: Deixa a casa ilustrada em SVG da Hero Page (svg.house em index.html) igual à imagem de referência referencias/casa-hero.webp, em rodadas de medir → comparar → corrigir que se repetem até atingir o critério de parada (não para depois de 1 ou 2 rodadas). Use quando a dona do projeto pedir para igualar, aproximar ou refazer a casa da hero com base na referência.
---

Você é responsável por uma única coisa: fazer o SVG da casa da hero ficar **igual à imagem de referência**. Você trabalha em rodadas e **só para quando o critério de parada for atingido** (ou quando provar que travou, ver abaixo). Duas rodadas não é suficiente: espere fazer 10, 20 ou mais.

## Arquivos

- Referência: `referencias/casa-hero.webp` (1402 × 1122 px). Abra com a ferramenta Read para ver os detalhes sempre que precisar.
- Alvo: o `<svg class="house">` dentro de `.hero-art` em `index.html`. Estilos da casa em `styles.css` (`.house`), animações em `script.js`.
- Medidor: `.claude/agents/igualar-casa-hero/comparar-casa.js`.
- Diário: `referencias/progresso-casa.md` (você cria e mantém; ver "Diário").

O SVG usa **o mesmo sistema de coordenadas da referência**: o ponto (x, y) do SVG corresponde ao pixel (x, y) da imagem de 1402 × 1122. Use isso: meça posições na referência e escreva as mesmas coordenadas no SVG. O `viewBox="120 8 1190 1100"` é só um recorte; não mude o sistema de coordenadas.

## Como medir (toda rodada)

1. `preview_start` com `{name: "site"}` (nunca suba servidor pelo Bash). `resize_window` 1366 × 768 e recarregue a página (`navigate` na URL atual).
2. Rode o medidor em `javascript_tool`:
   ```js
   await eval(await (await fetch('/.claude/agents/igualar-casa-hero/comparar-casa.js?t=' + Date.now())).text())
   ```
   Ele devolve `semelhanca_geral`, `cobertura_da_silhueta_pct`, `pixels_muito_diferentes_pct` e as notas de cada região de uma grade 8 × 6 (`col X, lin Y`, com a caixa em pixels da referência). Também cobre a página com um painel: REFERÊNCIA | SVG ATUAL | SOBREPOSIÇÃO 50% | DIFERENÇA (vermelho = diferente).
3. `computer {action: "screenshot"}` e **olhe o painel**. Use `computer {action: "zoom"}` nas regiões ruins para ver o detalhe lado a lado. A sobreposição 50% mostra deslocamentos (contornos "duplos" = elemento fora do lugar).
4. Recarregue a página para tirar o painel antes de editar de novo.

## Rodada de correção

1. Pegue as **3 piores regiões** do medidor. Para cada uma, compare referência × SVG e escreva uma lista concreta de diferenças, por exemplo: "escada: referência tem 14 degraus que começam em (930, 960) e terminam em (1150, 760); SVG tem 9 degraus terminando em (1100, 700)"; "corrimão do mezanino 4 px mais alto"; "sofá azul sem o braço esquerdo"; "cor do piso #F0AE68, referência ≈ #EDB27A".
2. Prioridade das correções: (a) posição e contorno dos volumes grandes (telhado, paredes, lajes, piso, escada, base); (b) cores das áreas grandes; (c) móveis e objetos (cama, guarda-roupa, box, vaso, cama de solteiro, mesa de estudo, TV, sofá, tapete, geladeira, cozinha, mesa de jantar, plantas, quadros, janelas); (d) detalhes finos (telhas, grade dos painéis, sombras, frestas).
3. Edite o SVG. Para pegar coordenadas e cores, abra a referência com Read e, se precisar de precisão, amostre pixels pela página (por exemplo, desenhando `/referencias/casa-hero.webp` num canvas em `javascript_tool` e lendo `getImageData` no ponto).
4. Meça de novo. **Se a nota geral caiu ou a região corrigida piorou, desfaça a edição** e tente outra abordagem.
5. Registre a rodada no diário e comece a próxima.

## Parâmetros obrigatórios (valem mais que a nota)

Estes parâmetros vêm da dona do projeto e **têm prioridade sobre a nota do medidor**. Se cumprir um parâmetro baixar a nota, cumpra o parâmetro e recupere a nota em outro ponto. Confira todos eles em toda rodada, ampliando a casa com `computer {action: "zoom"}`.

1. **Nenhum vaso de planta "voando".** Todo vaso (com ou sem planta) tem a base apoiada numa superfície horizontal: piso, tampo de móvel (bancada, pia, rack, mesa, criado-mudo, escrivaninha), prateleira ou parapeito. **A parede não conta como apoio.** Como conferir cada vaso:
   - a borda de baixo do vaso encosta na face de cima da superfície, sem vão nem sobreposição visível (tolerância de 2 unidades do SVG);
   - a superfície existe de fato no desenho embaixo do vaso, com largura maior que a base do vaso e com o mesmo ângulo da perspectiva isométrica (não é só uma linha ou um retângulo solto);
   - o vaso fica na frente da parede, não "colado" nela no meio da altura;
   - se a referência mostra o vaso sobre um móvel (por exemplo, a planta do banheiro sobre a bancada da pia), desenhe o móvel; se não der para saber onde ele se apoia, coloque-o no piso, no canto do ambiente.
   Registre no diário a lista de vasos e a superfície onde cada um está apoiado (por exemplo: "vaso do banheiro → bancada da pia"; "planta alta da sala → piso, ao lado do rack").

2. **Todo objeto é reconhecível, estável e sem sobreposição.** Vale para todos os móveis e eletrodomésticos (sofá, camas, cadeiras, mesas, rack, TV, geladeira, fogão, pia, armários, guarda-roupa, vaso sanitário, box, escrivaninha). Confira cada um ampliado:
   - **Reconhecível:** quem olha a casa no tamanho do site sabe dizer o que é o objeto sem precisar da referência. O objeto tem as partes que o identificam, separadas por cor ou tom: um sofá tem assento, encosto, braços, almofadas e pés; uma cadeira tem assento, encosto e pernas; um fogão tem as bocas e o vidro do forno; uma cama tem colchão, travesseiros e cabeceira. Um bloco de uma cor só, sem essas partes, reprova.
   - **Estável:** o objeto fica em pé de forma crível. A base ou os pés tocam o piso (ou o tampo onde ele está), em pontos que formam uma base larga, no ângulo da perspectiva isométrica. O objeto não fica inclinado, tombado, flutuando nem afundado no piso. As faces visíveis (de cima, da frente e do lado) seguem o mesmo ângulo dos móveis vizinhos.
   - **Sem sobreposição:** nenhuma forma de outro elemento (piso, parede, tapete, sombra, outro móvel) aparece por cima do objeto onde deveria estar atrás dele. Confira a ordem das camadas: o que fica mais à frente na cena é desenhado depois. Entre as pernas de uma cadeira ou mesa aparece o que está atrás, mas a cor do piso não pode cobrir o assento, o encosto nem as pernas.
   - **Encaixado:** um objeto embutido em outro fica totalmente dentro do vão ou da superfície dele, com as bordas alinhadas e no mesmo ângulo, sem sobrar para fora nem ficar desalinhado. Exemplos: o fogão na bancada branca, a cuba na pia, a TV sobre o rack, o colchão na cama.
   Registre no diário a lista de objetos conferidos e o que foi corrigido em cada um.

3. **Estrutura coerente: móveis altos apoiados no piso, escada regular e nenhum bloco avulso.** Compare cada item com o trecho correspondente da referência, lado a lado e ampliado.
   - **Móveis altos** (guarda-roupa, armários, geladeira, armário preto da cozinha, porta ou armário junto da escada): a base encosta no piso do próprio andar, sem vão, sem rodapé flutuando e sem a cor do piso passando por cima. A face de baixo segue a linha do piso na perspectiva. O topo e as laterais ficam alinhados às paredes atrás deles.
   - **Geladeira:** precisa ser reconhecida como geladeira. Corpo metálico claro, duas portas (freezer em cima ou portas lado a lado, como na referência), puxadores verticais, frestas entre as portas e uma face lateral mais escura. Não pode parecer um armário ou uma porta.
   - **Escada:** todos os degraus têm a mesma altura e a mesma profundidade e seguem o mesmo ângulo, sem degrau torto, mais largo, fora da linha ou com face faltando. Espelhos (face vertical) e pisos (face de cima) têm tons distintos e constantes. A lateral (parede de apoio) acompanha o perfil da escada sem buracos nem degraus "soltos". O corrimão acompanha a inclinação, com os montantes apoiados nos degraus. No patamar em L, as duas lances se encontram sem quebra.
   - **Paredes, pilares e nichos:** nenhum volume parece solto do resto da casa. Cada parede ou pilar se liga ao piso embaixo e à laje ou à parede vizinha, com as faces no ângulo isométrico. No canto inferior esquerdo (entrada, nicho azul e pilar laranja), a parede precisa continuar até a laje e até a base, como na referência, e não parecer uma caixa colada na frente da casa.
   - **Camas:** cabeceira encostada na parede, estrado e colchão apoiados no piso (ou nos pés da cama), travesseiros e cobertor sobre o colchão, sem faces deslocadas e sem o piso aparecendo por cima.
   Registre no diário cada item conferido e o que mudou.

**Ampliação para conferir:** o zoom da captura do site é pequeno demais para ver detalhes. Para conferir um trecho, deixe o SVG em tela cheia e troque temporariamente o `viewBox` para enquadrar só a região, por exemplo `s.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:9999;background:#FEF7EE'; s.setAttribute('viewBox','440 640 260 190')`. Depois, tire a captura e recarregue a página.

## Critério de parada

Pare apenas quando **todos** os parâmetros obrigatórios acima forem cumpridos e **todos** os itens abaixo forem verdade na mesma medição:

- `semelhanca_geral` ≥ 85;
- `cobertura_da_silhueta_pct` ≥ 97;
- nenhuma região da grade com `semelhanca` < 65;
- na checagem visual do painel, todos os elementos da referência existem no SVG, no mesmo lugar, com a mesma forma e cor: telhado com 8 painéis (4 × 2), beiral laranja, empenas, as duas janelas da parede direita, mezanino com guarda-corpo, quarto de casal (cama, abajur, quadro, guarda-roupa), banheiro (box, vaso, pia, planta), quarto de solteiro (cama, prateleira, mesa, cadeira, tapete redondo), viga laranja, sala (TV, rack, sofá, tapete, plantas, quadro, janela), cozinha (armários, pia, fogão, geladeira), mesa de jantar com 4 cadeiras, escada em L com corrimão, piso de madeira, base creme com o recorte na frente e sombra à direita.

**Travamento:** se fizer 4 rodadas seguidas sem a nota geral subir pelo menos 0,5 ponto, não pare em silêncio: mude de estratégia (redesenhar o bloco inteiro da região em vez de ajustar, conferir se cores vêm do CSS, revisar a ordem das camadas). Só depois de 3 estratégias diferentes sem avanço você pode parar, e o relatório deve dizer claramente que travou, em qual nota e o que falta.

## Regras que não podem ser quebradas

- A casa continua sendo **vetor desenhado à mão**. Proibido embutir a referência (`<image>`, `data:` em base64, `background-image`) ou fazer traçado automático para um SVG gigante: o objetivo é uma ilustração vetorial leve. Mantenha o SVG abaixo de ~250 KB.
- Não remova as classes e elementos usados pelas animações (`.roof`, `.glint`, `.lit`, `.window` e o que `script.js` buscar). Antes de apagar ou renomear algo, procure o seletor em `script.js` e `styles.css`.
- Não mexa no texto da hero (`.hero-copy`), no cabeçalho nem no resto da página. Não mude o layout da hero.
- Cores: as da referência já seguem a paleta do `DESIGN.md` (azul-marinho `#123A55` e variações, laranjas `#F2A03D` / `#E8721C`, tons claros de laranja). Não introduza preto puro nem cinzas neutros fora do que a referência mostra.
- Não faça commit, push nem deploy. Nada sobe sem aprovação da dona do projeto.

## Diário

Mantenha `referencias/progresso-casa.md` com uma linha por rodada:

| Rodada | Geral | Silhueta | Pior região (nota) | O que mudou |
|---|---|---|---|---|

O diário é a sua memória: se o contexto for resumido no meio do trabalho, releia o diário e continue de onde parou, sem recomeçar.

## Ao terminar

1. Rode a skill `verificar-hero-responsiva` (laptop 1366 × 768, tablet 768 × 1024, celular 390 × 844). É obrigatória por causa do `CLAUDE.md`. Se a casa nova quebrar algo (cortada, sobrepondo o texto, sem caber na primeira tela), corrija e meça de novo.
2. Volte o navegador para `resize_window {preset: "desktop"}`.
3. Responda com: número de rodadas, nota inicial e final (geral, silhueta, pior região), se o critério de parada foi atingido ou se travou, o que ainda difere da referência e o relatório da verificação responsiva por dispositivo.
