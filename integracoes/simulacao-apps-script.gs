/**
 * Ravena Solar — recebe as simulações do site.
 *
 * Cada envio:
 *   1. vira uma linha na aba "Simulações" da planilha onde este script está;
 *   2. salva a conta anexada (se houver) na pasta "Simulações · contas de luz" do Drive;
 *   3. manda um e-mail para a equipe com os dados e o link do anexo.
 *
 * Como instalar: veja integracoes/LEIA-ME.md
 */

// E-mail que recebe o aviso de cada simulação.
// Vazio = e-mail da conta Google que publicou o script.
// Vários e-mails: separe por vírgula.
const EMAIL_EQUIPE = '';

const ABA = 'Simulações';
const PASTA = 'Simulações · contas de luz';
const CONTA_MINIMA = 450;          // mesma regra do site: conta acima de R$ 450
const ARQUIVO_MAX = 10 * 1024 * 1024;
const CABECALHO = ['Data', 'Nome', 'WhatsApp', 'Cidade', 'Conta média (R$)', 'Conta anexada', 'Status'];

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);

    // campo invisível no formulário: robôs preenchem, pessoas não
    if (d.site) return resposta({ ok: true });

    const nome = texto(d.nome, 120);
    const whatsapp = String(d.whatsapp || '').replace(/\D/g, '').slice(0, 13);
    const cidade = texto(d.cidade, 80);
    const conta = Number(d.conta);

    if (nome.length < 2 || whatsapp.length < 10 || cidade.length < 2 || !isFinite(conta)) {
      return resposta({ ok: false, erro: 'dados-invalidos' });
    }
    if (conta <= CONTA_MINIMA) {
      return resposta({ ok: false, erro: 'conta-abaixo-do-minimo' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const link = salvarAnexo(d.arquivo, nome);
      const aba = obterAba();
      aba.appendRow([new Date(), celula(nome), formatarWhats(whatsapp), celula(cidade), conta, link, 'Novo']);
      avisarEquipe({ nome, whatsapp, cidade, conta, link });
    } finally {
      lock.releaseLock();
    }

    return resposta({ ok: true });
  } catch (err) {
    console.error(err);
    return resposta({ ok: false, erro: 'falha-interna' });
  }
}

// abrir a URL do script no navegador só confirma que ele está no ar
function doGet() {
  return resposta({ ok: true, servico: 'simulacoes-ravena-solar' });
}

/* ---------------- auxiliares ---------------- */

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    aba.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
    aba.getRange('E:E').setNumberFormat('"R$" #,##0.00');
  }
  return aba;
}

function salvarAnexo(arquivo, nome) {
  if (!arquivo || !arquivo.base64) return '';
  const tipo = String(arquivo.tipo || '');
  if (!(tipo.indexOf('image/') === 0 || tipo === 'application/pdf')) return '';

  const bytes = Utilities.base64Decode(arquivo.base64);
  if (bytes.length > ARQUIVO_MAX) return '';

  const data = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd HHmm');
  const nomeArquivo = `${data} · ${nome} · ${texto(arquivo.nome, 80) || 'conta'}`;
  const blob = Utilities.newBlob(bytes, tipo, nomeArquivo);
  return obterPasta().createFile(blob).getUrl();
}

function obterPasta() {
  const pastas = DriveApp.getFoldersByName(PASTA);
  return pastas.hasNext() ? pastas.next() : DriveApp.createFolder(PASTA);
}

function avisarEquipe(s) {
  const para = EMAIL_EQUIPE || Session.getEffectiveUser().getEmail();
  const valor = s.conta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const linhas = [
    `Nome: ${s.nome}`,
    `WhatsApp: ${formatarWhats(s.whatsapp)}  ·  https://wa.me/55${s.whatsapp}`,
    `Cidade: ${s.cidade}`,
    `Conta média: R$ ${valor}`,
    `Conta anexada: ${s.link || 'não enviou'}`,
    '',
    'Prometido no site: contato pelo WhatsApp no mesmo dia útil.',
    `Planilha: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}`,
  ];
  MailApp.sendEmail({
    to: para,
    subject: `Nova simulação: ${s.nome} · ${s.cidade} · R$ ${valor}`,
    body: linhas.join('\n'),
  });
}

function texto(v, max) {
  return String(v || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

// impede que um texto começando com = + - @ vire fórmula na planilha
function celula(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function formatarWhats(d) {
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
