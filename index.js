const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// ============================================================
//  CONFIGURAÇÕES DO BOT — edite aqui à vontade
// ============================================================

const NOME_EMPRESA = "Minha Empresa";

// Mensagem de boas-vindas (enviada quando alguém manda a 1ª mensagem)
const MSG_BOAS_VINDAS = `Olá! 👋 Seja bem-vindo(a) à *${NOME_EMPRESA}*!

Como posso te ajudar hoje?

*1* — Agendamento
*2* — Convênios que atendemos
*3* — Endereço e horários
*4* — Falar com um atendente
*0* — Voltar ao menu`;

// Respostas de cada opção do menu principal
const MENU = {
  "1": `*📋 Nossos Serviços:*

• Serviço A — descrição rápida
• Serviço B — descrição rápida  
• Serviço C — descrição rápida

Digite *0* para voltar ao menu principal.`,

  "2": `*💰 Tabela de Preços:*

• Serviço A — R$ 00,00
• Serviço B — R$ 00,00
• Serviço C — R$ 00,00

Preços podem variar. Para um orçamento personalizado, digite *4*.

Digite *0* para voltar ao menu.`,

  "3": `*📍 Onde estamos:*

🗺️ Endereço: Rua Exemplo, 123 — Bairro, Cidade
🕐 Horário: Seg–Sex, 9h às 18h
📞 Telefone: (00) 00000-0000

Digite *0* para voltar ao menu.`,

  "4": `*📞 Atendimento Humano*

Você será redirecionado(a) para um de nossos atendentes.
Aguarde um momento — em breve alguém entrará em contato! 🙂

Se preferir, ligue: (00) 00000-0000`,

  "0": null, // "0" reenvia o menu de boas-vindas (tratado abaixo)
};

// Mensagem para opção não reconhecida
const MSG_OPCAO_INVALIDA = `Não entendi essa opção. 😅

Por favor, escolha um número do menu:\n\n${MSG_BOAS_VINDAS}`;

// ============================================================
//  LÓGICA DO BOT — não precisa mexer aqui
// ============================================================

// Guarda o estado de cada usuário (para saber se já foi cumprimentado)
const usuarios = new Map();

const client = new Client({
  authStrategy: new LocalAuth(), // salva a sessão localmente (não precisa escanear QR toda vez)
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Mostra o QR Code no terminal para conectar
client.on("qr", (qr) => {
  console.log("\n📱 Escaneie o QR Code abaixo com o WhatsApp:\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log(`\n✅ Bot conectado! ${NOME_EMPRESA} está online.\n`);
});

client.on("auth_failure", () => {
  console.error("❌ Falha na autenticação. Delete a pasta .wwebjs_auth e tente novamente.");
});

client.on("message", async (msg) => {
  // Ignora grupos, status e mensagens do próprio bot
  if (msg.isGroupMsg || msg.from === "status@broadcast") return;

  const numero = msg.from;
  const texto = msg.body.trim();

  console.log(`[${new Date().toLocaleTimeString()}] ${numero}: ${texto}`);

  // Se o usuário ainda não interagiu, envia boas-vindas
  if (!usuarios.has(numero)) {
    usuarios.set(numero, true);
    await msg.reply(MSG_BOAS_VINDAS);
    return;
  }

  // Responde "0" reenviando o menu
  if (texto === "0") {
    await msg.reply(MSG_BOAS_VINDAS);
    return;
  }

  // Verifica se a opção existe no menu
  if (MENU[texto] !== undefined) {
    await msg.reply(MENU[texto]);
    return;
  }

  // Opção não reconhecida
  await msg.reply(MSG_OPCAO_INVALIDA);
});

// Inicia o bot
client.initialize();
