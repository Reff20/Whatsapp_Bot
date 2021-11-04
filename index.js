const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

const SESSION_FILE_PATH = "./session.js";

const country_code = "55"
const number = "11997182966"
const message = "Teste funcional!"
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client  = new Client({
    session:sessionData,
})

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Está funcional...");
  let chatId = country_code+number+"@c.us"

  client.sendMessage(chatId, message).then(response => {
      if(response.id.fromMe){
          console.log("A msg foi enviada!");
      }
  })
});

client.on('authenticated', session =>{
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err =>{
        if(err) console.error(err);
    })
})

client.on('auth_failure', msg => {
    console.log("Houve o seguinte erro de autenticação => ", msg);
})