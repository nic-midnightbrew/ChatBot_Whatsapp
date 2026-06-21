# 🤖 WhatsApp Bot — Menu Interativo

Bot simples sem IA com menu de números para WhatsApp.

---

## 📦 Instalação

Você precisa ter o **Node.js** instalado (versão 18 ou superior).
Baixe em: https://nodejs.org

```bash
# 1. Instale as dependências
npm install

# 2. Rode o bot
npm start
```

---

## 📱 Como conectar ao WhatsApp

1. Rode `npm start`
2. Um **QR Code** vai aparecer no terminal
3. Abra o WhatsApp no celular
4. Vá em **Configurações → Dispositivos Vinculados → Vincular um dispositivo**
5. Escaneie o QR Code
6. Pronto! O bot está ativo ✅

> A sessão fica salva na pasta `.wwebjs_auth`.
> Na próxima vez que rodar, não precisará escanear de novo.

---

## ✏️ Como personalizar as mensagens

Abra o arquivo `index.js` e edite a seção **CONFIGURAÇÕES DO BOT** no topo:

```js
const NOME_EMPRESA = "Minha Empresa";        // nome da empresa

const MSG_BOAS_VINDAS = `...`;               // menu principal

const MENU = {
  "1": `Texto da opção 1...`,
  "2": `Texto da opção 2...`,
  // adicione quantas opções quiser
};
```

Para **adicionar uma nova opção** (ex: opção 5):
1. Adicione `*5* — Descrição` na `MSG_BOAS_VINDAS`
2. Adicione `"5": "Resposta aqui"` no objeto `MENU`

---

## 🌐 Como deixar o bot rodando 24/7 (produção)

### Opção 1 — VPS (recomendado)
Alugue um servidor na **Hostinger**, **DigitalOcean** ou **AWS Lightsail** (a partir de ~R$20/mês) e rode o bot lá com PM2:

```bash
npm install -g pm2
pm2 start index.js --name whatsapp-bot
pm2 startup   # faz o bot reiniciar automaticamente se o servidor reiniciar
pm2 save
```

### Opção 2 — PC local
Deixe o computador ligado com o bot rodando.
Use `npm start` ou PM2 localmente.

---

## ⚠️ Avisos importantes

- Esta lib (`whatsapp-web.js`) é **não oficial** e simula o WhatsApp Web
- Existe risco de ban da conta se o uso for muito agressivo
- Para uso comercial sério, considere a **API oficial do WhatsApp Business**
  (via Twilio, Zenvia, Gupshup — geralmente pago)
- Para testes e uso interno, essa abordagem funciona bem

---

## 🛠️ Requisitos

- Node.js 18+
- Google Chrome ou Chromium instalado no sistema (o Puppeteer usa ele)
  - No Ubuntu/Debian: `sudo apt install chromium-browser`
  - No Windows/Mac: geralmente já instala automaticamente
