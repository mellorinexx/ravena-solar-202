# Simulações do site → planilha + e-mail

O formulário de simulação envia os dados para um **Google Apps Script**. Cada envio:

1. vira uma linha na aba **Simulações** de uma planilha Google (data, nome, WhatsApp, cidade, conta média, link da conta anexada, status);
2. salva a conta anexada (foto ou PDF) na pasta **Simulações · contas de luz** do Google Drive;
3. manda um e-mail para a equipe com os dados e um link direto para o WhatsApp do cliente.

O script também confere a regra dos R$ 450: uma conta de R$ 450 ou menos é recusada mesmo se alguém burlar o site.

Não há custo: tudo roda na conta Google da Ravena Solar. O limite diário de e-mails do Apps Script é de 100 por dia em contas gratuitas e 1.500 em contas Google Workspace.

## Instalação (uma vez, cerca de 10 minutos)

1. Com a conta Google da empresa, crie uma planilha nova em [sheets.new](https://sheets.new) e dê um nome a ela (ex.: *Simulações · site*).
2. Na planilha, abra **Extensões → Apps Script**.
3. Apague o conteúdo do arquivo `Código.gs` e cole todo o conteúdo de [`simulacao-apps-script.gs`](simulacao-apps-script.gs).
4. *(Opcional)* Na linha `const EMAIL_EQUIPE = '';`, coloque o e-mail que deve receber os avisos. Para mais de um, separe com vírgula. Se ficar vazio, o aviso vai para a própria conta Google que publicar o script.
5. Salve (ícone de disquete).
6. Clique em **Implantar → Nova implantação**:
   - em *Selecione o tipo*, escolha **App da Web**;
   - **Executar como:** *Eu*;
   - **Quem pode acessar:** *Qualquer pessoa*;
   - clique em **Implantar** e autorize o acesso quando o Google pedir (planilha, Drive e envio de e-mail).
7. Copie a **URL do app da Web** (termina em `/exec`).
8. Em `index.html`, cole a URL no formulário:

   ```html
   <form class="sim-form" id="sim-form" novalidate data-endpoint="https://script.google.com/macros/s/.../exec">
   ```

9. Faça uma simulação de teste no site e confira a linha na planilha e o e-mail.

## Se precisar alterar o script depois

Depois de editar o código no Apps Script, vá em **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar**. Assim a URL continua a mesma e não é preciso mexer no site.

## Enquanto a URL não estiver configurada

O formulário valida os campos normalmente, mas ao enviar mostra *"Não foi possível enviar agora"*. Ele não exibe a mensagem de sucesso, para que nenhum cliente ache que foi atendido sem ter sido.
