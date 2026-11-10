# Design – Ravena Solar

## Paleta de cores

As cores vêm diretamente do logotipo da Ravena Solar.

| Cor | Hex | Origem no logo | Papel |
|---|---|---|---|
| 🔵 Azul-marinho | `#123A55` | Painel solar e a palavra "RAVENA" | Cor principal do texto |
| 🟠 Laranja-dourado | `#F2A03D` | Sol (círculo e raios) | Destaque / atenção |
| 🟠 Laranja queimado | `#E8721C` | A palavra "SOLAR" | Destaque / atenção |

### Azul-marinho `#123A55` — texto

- É a cor de **todo o texto**: títulos, parágrafos, legendas, rótulos e links.
- Não usar preto puro nem cinzas no lugar dele.

**Permitido:**
- **Texto em tons de branco** (`#fff`) pode ser usado como contraste (ex.: números das cidades `.area-num` e texto dos pinos do mapa). É o único caso de texto fora do azul-marinho.
- **Opacidade no azul-marinho:** o texto pode usar o azul-marinho com opacidade de até `.45` (ex.: placeholder dos campos).
- **Elementos visuais ilustrativos** (casa, bonecos e similares) podem sair da paleta. A interface (textos, botões, cards, formulários, fundos) não pode: segue sempre a paleta.

### Laranjas `#F2A03D` e `#E8721C` — destaque

Os laranjas existem para **chamar a atenção**. Por isso, devem aparecer pouco e sempre com um propósito.

**Usar em:**
- CTA principal (botão de ação mais importante da página);
- Marcadores de tópicos e ícones;
- Pequenos elementos e detalhes decorativos;
- Marcações e realces (sublinhados, selos, indicadores);
- Gráficos, para destacar o dado mais importante.

**Não usar em:**
- Cores de fundo (seções, cards, banners);
- Cor de texto.

**Exceção que já existe no site:** o "!" dos erros de formulário (`.field-error::before`) é um caractere de texto em laranja queimado `#E8721C`. Conta como ícone de atenção, não como texto de conteúdo; a mensagem de erro em si continua em azul-marinho.

### Tons claros de laranja — fundo

Versões bem claras do laranja **podem** ser usadas como plano de fundo, desde que o texto sobre elas continue em azul-marinho `#123A55`. Use apenas os tons abaixo:

| Tom | Hex | Uso sugerido | Contraste com `#123A55` |
|---|---|---|---|
| Laranja 50 | `#FEF7EE` | Fundo de seções inteiras | 11,2:1 |
| Laranja 100 | `#FDEDD8` | Cards, caixas de destaque, faixas | 10,4:1 |
| Laranja 200 | `#FBDDB8` | Áreas pequenas: selos, tags, hover | 9,2:1 |

Todos passam com folga no nível AAA de acessibilidade (WCAG, mínimo 7:1). Não criar tons intermediários mais escuros que o Laranja 200 para fundo: a partir daí o laranja passa a competir com os elementos de destaque.

**Branco `#fff` também é permitido como fundo** no mapa, no minimapa e nas ilustrações (como a da garantia), para dar contraste de superfície.

## Tipografia

### Fonte

Todo o site usa a mesma família tipográfica:

```css
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
```

O navegador tenta as fontes nessa ordem: se a Helvetica Neue não estiver instalada, usa a Helvetica, depois a Arial e, por último, a fonte sem serifa padrão do sistema. Não usar outras famílias tipográficas.

### Peso (negrito)

**Usar negrito (`font-weight: 700`) em:**
- Todos os títulos (`h1` a `h6`);
- Texto principal da hero (a frase de maior destaque no topo da página);
- Números de destaque;
- Rótulos de formulário;
- Itens de elementos que precisem de ênfase e sejam curtos.

Nunca em frases corridas.

O texto corrido (parágrafos, legendas, listas) fica no peso normal (`font-weight: 400`).

A cor do texto continua sendo o azul-marinho `#123A55`, inclusive nos títulos e na hero.

## Espaçamento entre seções

Cada tópico (seção) da página usa um espaço vertical fixo, sempre o mesmo, para a página ficar compacta e com ritmo regular. Os valores ficam em variáveis no `:root` de `styles.css`; não usar outros números nas seções.

| Token | Laptop (≥ 900 px) | Tablet (700–899 px) | Celular (< 700 px) | Uso |
|---|---|---|---|---|
| `--space-section` | **56 px** | 48 px | 40 px | Respiro em cima e embaixo de cada seção (`.section`) |
| `--space-band` | **40 px** | 36 px | 32 px | Faixas de destaque, como "A Ravena Solar em números" (`.stats`) |
| `--space-head` | **32 px** | 28 px | 24 px | Entre o cabeçalho da seção (rótulo, título, texto de apoio) e o conteúdo |

Regras:
- A distância entre o conteúdo de duas seções vizinhas é a soma dos respiros das duas (ex.: seção + seção = 112 px; seção + faixa = 96 px no laptop). Não somar margens extras por cima disso.
- Dentro de uma seção, os blocos (cartões, gráficos, listas) ficam a no máximo `--space-head` um do outro.
- A hero não segue essa tabela: ela ocupa a primeira tela inteira.

**Exceções permitidas no site:**

Exceções são permitidas quando usadas para ajustar o enquadramento no celular, tablet ou laptop, mas nunca deve existir exceção sem validação antes.

Exemplos:
- **Colunas empilhadas:** o `gap` de `.case-grid`, `.system-grid` e `.life-grid` passa de `--space-head` quando as colunas empilham: cerca de 38 px no tablet (contra 28 px) e 32 px no celular (contra 24 px).
- **Margens soltas fora dos tokens:** `.checklist` com 28 px, `.sim-head .checklist` com 18 px, `.system-flow` com 8 px e `.case-bills` com 24 px. São ajustes finos de composição interna do bloco, não espaço entre seções.
