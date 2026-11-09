## Projeto

Ravena Solar: empresa especializada na venda de sistemas fotovoltaicos conectados à rede para residências. O intuito é apresentar os benefícios financeiros da energia solar, transmitir confiança e desmistificar as inseguranças dos clientes. Uma simulação é feita para direcionar os clientes até um atendimento especializado do time.

**Público:** proprietários de imóveis em Sorocaba e região, com contas de luz acima de R$ 450 por mês.

**Tom:** direto, técnico e específico, com foco em números e transparência.

**Deploy:** automático na Vercel a cada push na `main`. Nada sobe sem a aprovação da dona do projeto.

## Design

Toda alteração visual segue as regras de design do projeto:

@DESIGN.md

## Hero Page: verificação responsiva obrigatória

Toda alteração na Hero Page (`.hero` em `index.html`, `styles.css` ou `script.js`) exige rodar a skill `verificar-hero-responsiva` em laptop (1366 × 768), tablet (768 × 1024) e celular (390 × 844), e apresentar o relatório por dispositivo. A tarefa só termina depois das três resoluções verificadas.
