---
name: verificar-hero-responsiva
description: Verifica a responsividade da Hero Page da Ravena Solar em laptop (1366×768), tablet (768×1024) e celular (390×844) e entrega um relatório por dispositivo. Obrigatória após QUALQUER alteração na hero (index.html, styles.css ou script.js na seção .hero, no sol, na casa, no céu ou nas animações). Use também quando o usuário pedir para testar, conferir ou validar o layout da hero em diferentes telas.
---

# Verificação responsiva da Hero Page

Esta verificação é **obrigatória** depois de qualquer alteração que afete a hero (`.hero` em `index.html`, `styles.css` ou `script.js`). **A tarefa não está concluída enquanto as três resoluções não tiverem sido verificadas e o relatório não tiver sido apresentado.** Não pule resolução, não substitua por "deve funcionar" e não declare conclusão com base apenas na leitura do código.

## Resoluções

| Dispositivo | Largura × altura |
|---|---|
| Laptop | 1366 × 768 |
| Tablet | 768 × 1024 |
| Celular | 390 × 844 |

## O que verificar em cada resolução

0. **Regra principal, sem exceção:** ao abrir o site, **sem rolar**, a hero inteira cabe na primeira tela (abaixo do cabeçalho): o céu com o sol, a casa completa (telhado, paredes, janelas, chão), o título inteiro, a frase de apoio, o botão e a nota. Se o visitante precisa descer para ler o texto, ver a casa inteira ou chegar ao botão, a resolução **reprova**. Isso não é aviso: é problema.
1. A hero inteira está visível, ocupa a largura toda e segue o layout certo para a largura:
   - **≥ 900 px (laptop):** título grande alinhado à esquerda na coluna esquerda; casa à direita, com margem até a borda direita (≥ 16 px), sem invadir a coluna do texto. A casa fica no centro vertical da área útil.
   - **< 900 px (tablet e celular):** texto em cima, centralizado; casa embaixo, centralizada. O conjunto texto + casa fica no centro vertical da área útil, nunca encostado embaixo nem cortado.
2. Textos, imagens e elementos gráficos (casa, telhado, painéis, janelas, sol, chão) estão posicionados corretamente.
3. Nada está cortado, sobreposto ou fora da área visível.
4. O conteúdo mantém proporções e espaçamentos adequados.
5. A ilustração e as animações continuam funcionando (sol cruzando o céu, céu escurecendo, estrelas, luzes das janelas, reflexo nos painéis, raios girando).

## Procedimento

### 1. Subir o site

Use `preview_start` com `{name: "site"}` (definido em `.claude/launch.json`, porta 5173). Nunca suba servidor pelo Bash.

### 2. Para cada resolução, na ordem laptop → tablet → celular

1. `resize_window` com `width` e `height` exatos da tabela (não use `preset`: o preset de tablet/laptop não bate com os valores acima).
2. Recarregue a página (`navigate` na mesma URL). Reload é necessário porque a hero calcula geometria no carregamento e porque larguras < 768 ativam emulação de celular.
3. Rode o script de medição: leia [hero-check.js](hero-check.js) e cole o conteúdo inteiro em `javascript_tool` (`action: "javascript_exec"`). Ele mede centralização, limites, cortes, sobreposições, tamanhos de fonte, regras do `DESIGN.md` e confirma que a animação está rodando (compara duas amostras com 1,5 s de intervalo). Guarde o JSON retornado.
4. Tire uma captura com `computer {action: "screenshot"}` com a página no topo. **Olhe a imagem**: o script não enxerga tudo (por exemplo, telhado desalinhado com a parede, sol cortado de forma estranha, espaçamento desproporcional). A captura é **sem rolar**: se algo da hero (casa, texto, botão) não aparece nela, a resolução reprova; não role para "compensar".
5. Para conferir a animação visualmente, tire uma segunda captura ~6 s depois e compare com a primeira: o sol deve ter mudado de posição e o céu de tom.
6. Verifique `read_console_messages` com `onlyErrors: true`; erro de JavaScript na hero reprova a resolução.

### 3. Ao terminar

Volte ao tamanho normal com `resize_window` `{preset: "desktop"}`.

### 4. Casos extras (rápidos, só se a alteração envolver animação ou tamanho de elementos)

- Larguras de transição: 900 px (troca entre lado a lado e empilhado: rode em 899 e 900) e 700 px (regras de celular `max-width: 699px`). Rode o script nelas se mexeu nesses breakpoints.
- `prefers-reduced-motion`: a cena deve ficar estática, de dia, sem erro. O script reporta `animacao.reduzirMovimento`.

## Critérios de aprovação

Uma resolução é **APROVADA** só se `problemas` vier vazio **e** a captura de tela não mostrar nada fora do esperado. Os `avisos` do script exigem julgamento visual: registre-os no relatório com a decisão tomada.

Referências para o julgamento visual:

- **Primeira tela:** altura da hero ≤ altura útil (tela − cabeçalho); base da casa, do botão e da nota acima da borda inferior da tela. Na captura, a casa e o botão aparecem inteiros sem rolar. Confirme com a captura **sem rolar a página**.
- **Posição e centralização:** a hero ocupa a largura toda (folgas esquerda e direita = 0 ±2 px). Lado a lado (≥ 900 px): texto à esquerda com `text-align: left`, casa à direita com margem ≥ 16 px até a borda e sem sobrepor o texto. Empilhado (< 900 px): texto e casa no eixo central (±2 px), texto com `text-align: center` e acima da casa. Na vertical, o centro do conteúdo (lado a lado: a casa; empilhado: texto + casa) fica a no máximo 20% da altura útil do centro da área útil, com folga mínima de 8 px embaixo e céu suficiente (≥ 60 px) acima do telhado para o sol.
- **Texto:** título, frase de apoio, botão e nota em ordem vertical, sem tocar na casa nem nas janelas. No laptop o título é grande e preenche a coluna esquerda.
- **Botão principal (CTA):** altura ≥ 44 px; no celular ocupa a largura do bloco; **sempre visível na primeira dobra**.
- **Casa:** ilustração em SVG (`.house`), redesenhada a partir da referência, nunca imagem anexada. Proporção preservada: o telhado fica dentro do desenho e encaixa nas paredes sem fresta.
- **Sol:** cruza o céu da esquerda para a direita, acima do texto, passa **atrás** da casa e nunca por cima do texto.
- **Janelas:** fazem parte da casa, acendem à noite e nunca sobrepõem o texto.
- **Design:** texto em `#123A55`, fonte Helvetica Neue/Helvetica/Arial, títulos em negrito 700, laranja só como destaque (nada de laranja forte em fundo ou texto). Veja `DESIGN.md`.

## Relatório (obrigatório, após cada alteração)

Apresente ao usuário, em português, neste formato:

```
## Relatório de responsividade da Hero — <resumo da alteração>

| Dispositivo | Resolução | Status |
|---|---|---|
| Laptop  | 1366 × 768 | ✅ Dentro das proporções / ❌ Fora das proporções |
| Tablet  | 768 × 1024 | ✅ / ❌ |
| Celular | 390 × 844  | ✅ / ❌ |

### Laptop (1366 × 768)
- Centralização: ok / <medida e desvio>
- Posicionamento e proporções: ok / <detalhe>
- Cortes ou sobreposições: nenhum / <elemento e onde>
- Ilustração e animações: ok / <o que parou>
- Avisos: <se houver, e a decisão>

(repetir para Tablet e Celular)

### Correções necessárias
(só se houver ❌) Para cada problema: elemento, resolução, valor medido × esperado,
e a correção exata (arquivo, seletor e propriedade, ex.: "styles.css `.wall` margin: 0 6% → 0 4% abaixo de 520px").
```

Regras do relatório:

- Informe valores medidos (px), não só "ok".
- Se houver ❌, **não** diga que a tarefa foi concluída. Aplique a correção (se estiver dentro do que o usuário pediu) e **rode a verificação de novo nas três resoluções**, porque uma correção para um tamanho pode quebrar outro.
- Se algo não pôde ser verificado (servidor não subiu, ferramenta indisponível), diga isso explicitamente e marque a resolução como **não verificada**, nunca como aprovada.
- Alterações visuais seguem o `DESIGN.md`. Nada é publicado sem aprovação da dona do projeto (deploy automático da Vercel a cada push na `main`).
