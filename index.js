const fs = require("fs");
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");

const SESSION_FILE_PATH = "./session.json";

const message = "Teste funcional!"
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
})

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Está funcional...");
});

client.on('authenticated', session => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
    if (err) console.error(err);
  })
})

client.on('auth_failure', msg => {
  console.log("Houve o seguinte erro de autenticação => ", msg);
})

client.on('message', msg => {
  const backToMenu = (props) => {
    if (props.body.includes("Olá") || props.body.includes("pedido") || props.body.includes("Oi") || props.body.includes("olá") || props.body.includes("oi")) {
      client.sendMessage(props.from, `Olá! Gostaria de ver nosso cardápio?
        *1* - Hamburger;
        *2* - Outros;
        *9* - Falar com antendente;
        *0* - Sair;`)
      continueMenu();
    }
  }
  backToMenu(msg);
})

const continueMenu = () => {
  client.on('message', msg => {
    if (msg.body.includes("1")) {
      client.sendMessage(msg.from, `Você selecionou o menu de *hamburgers*`)
    } else if (msg.body.includes("2")) {
      client.sendMessage(msg.from, `Você selecionou o menu de *outros*`)
    } else if (msg.body.includes("9")) {
      client.sendMessage(msg.from, `Gostaria de falar com um atendente?
        *S* - Sim;
        *N* - Não;`)
      if (msg.body.includes("s") || msg.body.includes("S")) {
        client.sendMessage(msg.from, `Aguarde um momento...`)
      } else if (msg.body.includes("n") || msg.body.includes("N")) {
        client.sendMessage(msg.from, `Gostaria de voltar ao menu principal?
          *S* - Sim;
          *N* - Não;`)
        if (msg.body.includes("s") || msg.body.includes("S")) {
          backToMenu();
        } else if (msg.body.includes("n") || msg.body.includes("N")) {
          client.sendMessage(msg.from, `Tudo bem. Até mais.`)
        } else {
          client.sendMessage(msg.from, `Não entendi... Estarei te redirecionando a um atendente.`)
        }
      } else {
        client.sendMessage(msg.from, `Não entendi... Estarei te redirecionando a um atendente.`)
      }
    } else if (msg.body.includes("0")) {
      client.sendMessage(msg.from, `Tudo bem. Até mais!`)
    }
  })
}