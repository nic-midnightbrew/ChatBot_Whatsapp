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
*4* — Falar com um atendente`;

// Respostas de cada opção do menu principal
const MENU = {
  "1": `*Agendamento*

Trabalhamos por agendamentos e também por encaixes:
Para realizar o agendamento clique na opção "1" para agendar com uma de nossas atendentes. Ou caso prefira, poderá vir e aguardar por um encaixe.

*1* — Falar com um atendente
Digite *0* para voltar ao menu principal.`,

  "2": `*Convênios que atendemos*

Amil Dental
Bradesco Dental
Brazil dental
BB dental
DoctorCLin (Precisa ter cobertura odontológica)
Hapvida/CCG
OdontoPrev
Odonto Alegre
Odonto Empresas
Prevident 
Saude Pas
Soprevi
Sul America Odonto
Unimed Odonto
Uniodonto (Conferir se atendemos o seu plano Uniodonto)


Digite *0* para voltar ao menu.`,

  "3": `*Endereço e horários:*

🗺️ Endereço: Av Gen. Flores da Cunha, 903 - 8° andar sala 804/806 — Centro, Cachoeirinha
🕐 Horário: De Segunda a Sexta das 8h ás 18h30, aos Sábados das 9h ás 13h
📞 Telefones: (51) 3238-5180 | (51) 3238-5190

Digite *0* para voltar ao menu.`,

  "4": `*Falar com atendente*

Você será redirecionado(a) para uma de nossas atendentes.
Aguarde um momento — em breve alguém entrará em contato! 🙂

Para facilitar o nosso atendimento precisamos de alguns dados:
Nome completo do paciente;
Convênio ou particular;
Foto completa da requisição do exame, frente e verso;
Turno que deseja agendar.

Aguarde que a sua mensagem será respondida por ordem de envio.`,
};

// Mensagem para opção não reconhecida
const MSG_OPCAO_INVALIDA = `Não entendi essa opção. 😅

Por favor, escolha um número do menu:\n\n${MSG_BOAS_VINDAS}`;

// ============================================================
//  LÓGICA DO BOT — não precisa mexer aqui
// ============================================================

// Guarda o estado de cada usuário: "ativo" | "atendente"
const usuarios = new Map();

const client = new Client({
  authStrategy: new LocalAuth(),
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

// Quando o ATENDENTE envia uma mensagem — para o bot naquele chat
// Digite #bot para devolver o chat ao bot
client.on("message_create", async (msg) => {
  if (msg.fromMe && !msg.isGroupMsg) {
    const numero = msg.to;

    // Comando #bot — reativa o bot neste chat
    if (msg.body.trim().toLowerCase() === "#bot") {
      usuarios.delete(numero);
      await client.sendMessage(numero, MSG_BOAS_VINDAS);
      console.log(`[BOT] Chat ${numero} devolvido ao bot.`);
      return;
    }

    // Qualquer outra mensagem do atendente pausa o bot
    if (usuarios.get(numero) !== "atendente") {
      usuarios.set(numero, "atendente");
      console.log(`[BOT] Atendente respondeu ${numero} — bot pausado neste chat.`);
    }
  }
});

// Mensagens recebidas dos clientes
client.on("message", async (msg) => {
  if (msg.isGroupMsg || msg.from === "status@broadcast") return;

  const numero = msg.from;
  const texto = msg.body.trim();

  console.log(`[${new Date().toLocaleTimeString()}] ${numero}: ${texto}`);

  // Chat já está com atendente humano — bot não responde
  if (usuarios.get(numero) === "atendente") return;

  // Primeira mensagem — boas-vindas
  if (!usuarios.has(numero)) {
    usuarios.set(numero, "ativo");
    await msg.reply(MSG_BOAS_VINDAS);
    return;
  }

  // Voltar ao menu
  if (texto === "0") {
    await msg.reply(MSG_BOAS_VINDAS);
    return;
  }

  // Opção do menu
  if (MENU[texto] !== undefined) {
    if (texto === "4") {
      usuarios.set(numero, "atendente"); // para o bot imediatamente
    }
    await msg.reply(MENU[texto]);
    return;
  }

  // Opção inválida
  await msg.reply(MSG_OPCAO_INVALIDA);
});

client.initialize();