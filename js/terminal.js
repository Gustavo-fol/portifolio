import { run as jogoVelha } from "./jogos/jogoVelha.js";
import { run as nRainhas } from "./jogos/nRainhas.js";
import { run as rpg } from "./jogos/rpg.js"
import { run as chatbot_ia } from "./ia/chatbot_ia.js"

const overlay = document.getElementById("terminal-overlay");
const closeBtn = document.getElementById("close-terminal");
const terminalBody = document.getElementById("terminal-body");
const input = document.getElementById("terminal-input");

/* REGISTRO DOS PROJETOS */
const projects = {
    jogoVelha,
    nRainhas,
    rpg,
    chatbot: chatbot_ia
};

/* PRINT */
function print(text = "") {
    terminalBody.textContent += text + "\n";
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

/* =========================
   SCANF (ENTRADA DO USUÁRIO)
========================= */
let waitingResolve = null;

function scanf() {
    return new Promise(resolve => {
        waitingResolve = resolve;
    });
}

/* INPUT DO TERMINAL */
input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const value = input.value;
        input.value = "";

        print("> " + value);

        if (waitingResolve) {
            waitingResolve(value);
            waitingResolve = null;
        }
    }
});

/* ABRIR TERMINAL */
window.openTerminal = function (project) {
    overlay.classList.add("active");
    terminalBody.textContent = "";

    if (projects[project]) {
        projects[project](print, scanf);
    } else {
        print("Projeto não encontrado.");
    }

    input.focus();
};

/* FECHAR NO X */
closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
});

/* FECHAR CLICANDO FORA */
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.classList.remove("active");
    }
});
/* =========================
   CLEAR TERMINAL (C -> JS)
========================= */
export function clearTerminal() {
    const terminalBody = document.getElementById("terminal-body");
    if (terminalBody) {
        terminalBody.textContent = "";
    }
}


/* =========================
   CARREGAR CÓDIGO DE ARQUIVO TXT
========================= */
function carregarCodigo(idElemento, caminhoArquivo) {
    const elemento = document.getElementById(idElemento);

    fetch(caminhoArquivo)
        .then(res => {
            if (!res.ok) throw new Error("Erro ao carregar arquivo");
            return res.text();
        })
        .then(texto => {
            elemento.textContent = texto;
        })
        .catch(() => {
            elemento.textContent = "Erro ao carregar o código.";
        });
}

carregarCodigo("codigo-jogoVelha", "js/codes/jogovelha.txt");
carregarCodigo("codigo-nrainhas", "js/codes/nrainhas.txt");
carregarCodigo("codigo-rpg", "js/codes/rpg.txt");
carregarCodigo("codigo-chatbot", "js/codes/chatbot_ia.txt");
