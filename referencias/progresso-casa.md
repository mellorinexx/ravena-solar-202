# Progresso: casa da hero × referência

Medidor: `.claude/agents/igualar-casa-hero/comparar-casa.js` (laptop 1366 × 768).
Cópia do SVG original (antes da rodada 1): scratchpad `index.orig.html`.

| Rodada | Geral | Silhueta | Pior região (nota) | O que mudou |
|---|---|---|---|---|
| 0 | 63,8 | 85,3 | col 6, lin 3 (16,4) | Ponto de partida (SVG existente) |
| 1 | 68,4 | 89,9 | col 6, lin 3 (25,5) | Cores das áreas grandes amostradas da referência (telhado, painéis, laranjas, piso, base, paredes internas, torre) e sombra cinza à direita da torre |
| 2 | 70,5 | 90,2 | col 6, lin 3 (25,5) | Telhado refeito com coordenadas medidas: contorno, telhas, 8 painéis 4 × 2 com células 6 × 4, beirais laranja e faces internas das empenas |
| 3 | 73,0 | 91,0 | col 6, lin 4 (28,0) | Andar de cima redesenhado: paredes com gradiente, quarto de casal (cama cinza, travesseiros, manta azul, criados, abajur, quadro, guarda-roupa), banheiro escuro com box, vaso e pia, quarto de solteiro (cama, prateleira, mesa, cadeira, tapete) |
| 4 | 74,5 | 92,2 | col 6, lin 4 (25,7) | Laje do mezanino medida (frisos, face frontal e lateral, borda clara), guarda-corpo com montantes nas posições da referência, caixa azul à esquerda |
| 5 | 76,1 | 94,7 | col 6, lin 4 (37,9) | Escada em L refeita por gerador: 9 degraus no lance de cima (piso + espelho), longarina laranja, parede azul, patamar, 7 degraus no lance de baixo, lateral branca, corrimão e montantes medidos; torre descida até a base |
| 6 | 76,6 | 97,5 | col 6, lin 4 (25,0) | Térreo refeito: paredes com gradiente, janela, quadro, nicho, TV com rack de madeira, plantas, sofá azul com chaise cinza, tapete, coluna laranja/azul/branca com vaso; cozinha piorou (armário preto removido por engano) |
| 7 | 77,6 | 97,5 | col 6, lin 3 (43,7) | Cozinha corrigida: armário alto azul e faixa da coifa, armário preto, bancada branca com pia e cooktop, forno, parede de azulejo; cadeiras e mesa nas posições medidas |
| 8 | 77,9 | 98,2 | col 6, lin 3 (39,2) | Cama de solteiro remedida (cabeceira, travesseiros, manta caindo pelas laterais), porta de armário branca, parede do quarto 3 sem fresta, parede azul da escada alinhada ao piso |
| 9 | 78,0 | 98,6 | col 5, lin 5 (48,7) | Escada: degraus de cima estendidos até o patamar, painel laranja de fundo, corrimão começando em (924,459); lateral da cama em azul |
| 10 | 78,6 | 98,6 | col 6, lin 5 (49,2) | Cores da cozinha amostradas: parede marrom-acinzentada ao lado da porta, revestimento bege, armários cinza-azulados mais escuros, faixa da coifa reposicionada |
| 11 | 79,0 | 98,6 | col 6, lin 3 (49,4) | Sofá redesenhado (contorno medido, azul bem escuro, chaise cinza), lateral da bancada em sombra, faixa clara sob a escada, parede da cozinha estendida até a escada |
| 12 | 79,0 | 98,6 | col 5, lin 5 (52,3) | Manta da cama de solteiro subida para a posição medida, lençol lateral direito |
| 13 | 81,8 | 99,3 | col 5, lin 5 (58,5) | Estratégia nova: cor de cada forma recalculada pela mediana dos pixels da referência que ela cobre (155 formas) |
| 14 | 83,2 | 99,3 | col 3, lin 5 (63,7) | Segunda passada de cores (22 formas) e degradês lineares ajustados por mínimos quadrados em 42 formas grandes (paredes, piso, base, escada, sofá) |
| 15 | 83,3 | 99,3 | col 3, lin 5 (63,7) | Mais 18 degradês (degraus, banheiro, criado-mudo, coluna) |
| 16 | 83,7 | 99,3 | col 3, lin 3 (64,4) | Rack e TV remedidos, chaise cinza, mesa de jantar com o tampo na orientação certa, cadeiras com encosto largo, plantas com folhas finas (sala, cozinha, mesa, coluna) |
| 17 | 83,7 | 99,3 | col 3, lin 3 (64,3) | Cama de casal remedida (cabeceira até o chão, colchão, manta no pé, laterais) + cores reamostradas de 15 formas movidas |
| 18 | 83,8 | 99,3 | col 5, lin 5 (65,8) | Cores reamostradas da cama nova; todas as regiões ≥ 65 |
| 19 | 84,4 | 99,2 | col 5, lin 5 (65,8) | Painéis: frestas brancas mais finas (frame 3 px como na referência); contorno escuro do telhado deslocado para dentro e afinado (estava vazando para o fundo) |
| 20 | 84,5 | 99,2 | col 5, lin 5 (65,8) | Divisões dos painéis nas posições medidas (colunas desiguais 0,248/0,45/0,705, linha a 0,52) |
| 21 | 84,6 | 99,2 | col 6, lin 3 (66,3) | Sombra sob a mesa de jantar, folhas maiores nas plantas da sala |
| 22 | 85,0 | 99,3 | col 3, lin 3 (66,6) | Face lateral direita da torre (faixa mais escura), borda do piso do quarto 3 e parede azul da escada no recorte medido (a regeneração da escada tinha voltado a forma antiga) |
| 23 | 85,0 | 99,3 | col 3, lin 3 (66,6) | Sofá com braço, encosto, almofadas e pés (contorno igual, detalhes internos) |
| 24 | 85,1 | 99,3 | col 3, lin 3 (66,8) | Cores reamostradas do sofá e da parede azul; degradês em travesseiro, TV, cadeiras de trás e borda do piso |
| 25 | 85,1 | 99,3 | col 3, lin 3 (66,8) | Cores reamostradas (painel, empena, coluna branca, armário preto); limpeza de degradês/clipPaths órfãos (SVG 56 KB). **Critério de parada atingido.** Verificação responsiva: laptop, tablet e celular aprovados |
| 26 | 85,1 | 99,3 | col 3, lin 3 (66,8) | Parâmetro 1 (nenhum vaso voando): vaso do banheiro descido para o tampo da bancada da pia (face de cima desenhada em perspectiva, cuba e torneira à esquerda, gabinete de madeira embaixo); planta alta da sala com vaso branco no piso ao lado do rack (recorte de piso no canto 501–645, base em y = 770); vaso da entrada sobre piso do nicho (triângulo de piso no eixo isométrico, sombra), base em y = 820; vaso da escrivaninha subido 5 un. para ficar sobre o tampo (antes invadia a face da frente) |
| 27 | 85,1 | 99,3 | col 3, lin 5 (66,1) | Parâmetro 2, térreo. **Sofá** refeito por gerador isométrico (eixos 1/-0,56 e 1/0,457, alinhado ao tapete e ao rack): encosto voltado para o observador com debrum e costuras, dois braços (esq. 52, dir. 72), 3 almofadas de assento em tons alternados, 3 almofadas de encosto, almofada solta, 3 pés curtos no tapete, sombra; pufe cinza como caixa isométrica na frente do assento (substitui o polígono torto). **Cadeiras** de jantar refeitas por gerador no ângulo da mesa (1/-0,52 e 1/0,33): 2 da frente e 1 da cabeceira de costas para o observador (encosto, assento, 4 pernas até o piso), 2 de trás em madeira (encosto e montantes acima do tampo); ordem: pernas de trás → assento → pernas da frente → encosto. O assento cor de madeira (#945B33) que cobria o encosto da cadeira junto à escada foi eliminado. **Cozinha**: cooktop recalculado por interpolação bilinear dentro do tampo da bancada (moldura, vidro, 4 bocas), cuba dupla recolocada dentro do tampo (antes passava da borda de trás), torneira apoiada no tampo, forno com painel, 5 botões, puxador, vidro e reflexo alinhados à face do gabinete. Posições e cores ajustadas por busca local contra a referência |
| 28 | 85,1 | 99,3 | col 3, lin 5 (66,5) | Conferência dos demais objetos: **vaso sanitário** (era um bloco bege) refeito com caixa acoplada, botão, bacia oval, assento, tampa e pedestal no piso; **cadeira da escrivaninha** com ordem de camadas corrigida (o assento cobria o encosto) e pernas no tapete redondo; pufe ajustado. Medição final: geral 85,1, silhueta 99,3, pior região 66,5 |
| 29 | 84,3 | 99,4 | col 6, lin 4 (61,6) | Parâmetro 3, primeira passada: guarda-roupa com base no piso, linha parede/piso do quarto de casal medida, geladeira inox redesenhada, porta junto da escada no piso, escada regenerada (degraus iguais, tons fixos, lateral serrilhada, montantes nos degraus), entrada refeita em isométrico. Nota caiu (cores planas na escada, montantes fora do lugar) |
| 30 | 84,7 | 99,3 | col 6, lin 4 (68,7) | Montantes recolocados nas posições da referência, apoiados nos pisos; degradê horizontal único para pisos/espelhos do lance de baixo; caixa azul da laje com topo e face lateral medidos; entrada com o nicho rente ao pilar e o peitoril projetado à frente |
| 31 | 84,9 | 99,4 | col 3, lin 5 (66,5) | Pé da escada: o "degrau 8" virou o piso onde o último espelho se apoia (como na referência); piso do quarto de solteiro subido até a cabeceira; sombra sob a cama de solteiro em degradê; cores da geladeira, armário preto, porta e entrada pela mediana da referência |
| 32 | 85,1 | 99,4 | col 3, lin 5 (66,5) | Refino de cor por mediana em 12 formas (sofá, cadeiras, criado-mudo, pé da cama de casal, vaso do banheiro, peitoril da entrada), recusando as que apagavam partes que identificam objetos (vaso sanitário, forno, frisos da geladeira, colchão). **Critério de parada mantido; parâmetros 1, 2 e 3 cumpridos** |

## Vasos e superfície de apoio (rodada 26)

| Vaso | Apoio | Base do vaso × superfície |
|---|---|---|
| Banheiro (andar de cima) | Tampo da bancada da pia, gabinete de madeira embaixo | base y = 384 em x 745–757; tampo de y 380 (fundo) a 387 (frente) |
| Prateleira do quarto de solteiro | Prateleira de madeira | base y = 340 em x 1058–1076; face de cima de y 333 a 343 |
| Escrivaninha do quarto de solteiro | Tampo da escrivaninha | base y = 426 em x 1059–1073; tampo de y 416 a 428 |
| Entrada (nicho azul) | Piso do nicho | base y = 820 em x 240–266; piso de y 815/802 (fundo) a 827/835 (frente) |
| Sala, ao lado do rack (vaso escuro) | Piso | base y = 861; parede termina em y 847–857 nesse trecho |
| Sala, planta alta (vaso branco) | Piso, ao lado do rack | base y = 770 em x 526–546; piso de y 748–757 para baixo |
| Mesa de jantar | Tampo da mesa | base y = 796 em x 799–812; tampo de y 770 a 816 |


## Objetos conferidos (parâmetro 2, rodadas 27–28)

| Objeto | Resultado | O que mudou |
|---|---|---|
| Sofá azul-marinho (sala) | Corrigido | Bloco inclinado → sofá isométrico com assento, encosto, 2 braços, almofadas separadas por tom, pés no tapete; faces de cima, frente e lado em tons diferentes |
| Pufe cinza (sala) | Corrigido | Polígono torto → caixa isométrica apoiada no tapete |
| Cadeiras da mesa de jantar (5) | Corrigido | Assento cor de piso por cima do encosto (cadeira junto à escada) eliminado; todas redesenhadas com pernas até o piso e camadas na ordem certa |
| Fogão / cooktop | Corrigido | Bocas dentro do tampo, bordas no ângulo da bancada |
| Forno | Corrigido | Painel, botões, puxador e vidro alinhados à face do gabinete |
| Pia da cozinha (cuba e torneira) | Corrigido | Cuba saía pela borda de trás; agora dentro do tampo, torneira apoiada |
| Vaso sanitário | Corrigido | Bloco bege → caixa acoplada, bacia, assento, tampa, pedestal |
| Cadeira da escrivaninha | Corrigido | Assento cobria o encosto; agora encosto na frente, pernas no tapete |
| Mesa de jantar | Aprovado | Tampo, faces e 3 pernas visíveis no piso |
| Rack e TV | Aprovado | TV apoiada dentro do tampo do rack |
| Geladeira e armário preto | Aprovado | Duas portas, puxadores, base no piso |
| Armários da cozinha (baixos e altos) | Aprovado | Portas separadas por frisos |
| Cama de casal, criados-mudos, abajur | Aprovado | Cabeceira, travesseiros, colchão, manta |
| Guarda-roupa | Aprovado | Duas portas, puxadores, base no piso |
| Box e gabinete da pia do banheiro | Aprovado | Vidro com perfis; gabinete com gavetas, cuba e torneira no tampo |
| Cama de solteiro | Aprovado | Cabeceira, travesseiro branco e laranja, colchão, manta, pés |
| Escrivaninha | Aprovado | Tampo, gaveteiro à direita, perna à esquerda no tapete |

## Estrutura conferida (parâmetro 3, rodadas 29–32)

| Item | Resultado | O que mudou |
|---|---|---|
| Guarda-roupa (quarto de casal) | Corrigido | A base ficava 2–4 un. acima da linha parede/piso (faixa de parede aparecendo). Linha parede/piso do quarto remedida na referência: (300,436)–(620,392) em vez de (300,470)–(620,408). Guarda-roupa refeito em isométrico: lateral (502–536), frente (536–598) com base de (536,424) a (598,402), 7 un. à frente da parede, rodapé escuro, sombra no piso, tampo, 2 portas e 2 gavetas |
| Geladeira (cozinha) | Corrigido | Era um bloco bege. Agora inox: frente clara (647–688) com freezer em cima e geladeira embaixo separados por fresta, 2 puxadores verticais, lateral mais escura (688–700), rodapé; base de (647,761) a (688,776) sobre o piso. Recorte de piso refeito sob a geladeira e o armário (a parede antes descia por baixo deles) e quina parede/piso medida em (575,739)–(645,761) |
| Armário preto (cozinha) | Corrigido | Base horizontal (não seguia a perspectiva) e parede aparecendo embaixo. Agora no mesmo plano da lateral da geladeira, base de (700,773) a (740,763) sobre o piso, puxador e fresta |
| Porta escura junto da escada | Corrigido | Base 12 un. abaixo da referência e faixa de parede sob ela. Agora (966–1011, base 800–810) com batente, folha, maçaneta de alavanca, sombra e piso por baixo; painel de luz acima alinhado ao batente |
| Escada, lance de cima | Corrigido | 11 degraus gerados com o mesmo passo (15, 20): piso 4,5 un. + espelho 15,5 un.; piso #C27D47 e espelho #B0703E em todos (antes cada espelho tinha um degradê diferente); longarina laranja seguindo o serrilhado |
| Escada, lance de baixo | Corrigido | 7 degraus com passo (−19,5, 29,5), pisos e espelhos com o mesmo degradê horizontal em todos; o último degrau era um quadrilátero torto: agora o último espelho apoia num piso no pé da escada (como na referência). Lateral branca refeita com o serrilhado do perfil (antes era uma faixa reta que deixava "dentes" soltos) |
| Patamar | Corrigido | O piso do 1º degrau de baixo invadia o último espelho de cima. Patamar único ligando a chegada do lance de cima (y = 765,5) à frente do lance de baixo, com face lateral na cor da longarina |
| Corrimão e montantes | Corrigido | Montantes com espaçamento regular (18,5 un. no lance de baixo), cada base sobre um piso de degrau; removido o toco solto em (1046, 646–660); montante do pé sobre o piso da escada |
| Entrada (nicho azul, pilar laranja, parede creme) | Corrigido | Bloco plano com bordas em ângulos diferentes → conjunto isométrico: pilar, nicho e parede creme no mesmo plano subindo até a caixa azul da laje; peitoril laranja projetado à frente com topo, frente e face lateral; caixa azul da laje com topo e face lateral medidos (antes era um paralelogramo plano); vaso continua no piso do nicho (topo do peitoril, base y = 829) |
| Cama de casal | Corrigido | Cabeceira descia só até 404 na ponta direita (vão sobre o piso); agora até 414, encostada na parede e no piso da nova linha parede/piso. Pé da cama em cinza como a manta dobrada da referência, faixa branca do colchão mantida |
| Cama de solteiro | Corrigido | O piso do quarto começava em y ≈ 470 e a cabeceira terminava em 440 (cabeceira "flutuando"). Piso do quarto subido para (843,430)–(986,440)–(1106,466); cabeceira até 442; o painel marrom sob a cama virou sombra em degradê no piso entre os pés |
| Mezanino, torre, paredes internas, colunas | Aprovado | Ligados ao piso e à laje; montante do mezanino sobre a caixa azul (base y = 505) |

Vasos (parâmetro 1) depois das mudanças: entrada → topo do peitoril (base y = 829, topo de 822,9 a 834,1 em x = 253); banheiro → bancada da pia (cor do vaso mudou para #C2A591, posição igual); demais sem mudança.
