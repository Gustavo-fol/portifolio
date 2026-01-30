// ========================= JOGO DA VELHA JS =========================

// Cores
const RESET = "\x1b[0m";
const VERMELHO = "\x1b[31m";
const AZUL = "\x1b[34m";
const VERDE = "\x1b[32m";

// Elementos do terminal
const overlay = document.getElementById("terminal-overlay");
const terminalBody = document.getElementById("terminal-body");
const input = document.getElementById("terminal-input");

// ------------------------- UTILITÁRIOS -------------------------
function print(text = "") {
    terminalBody.textContent += text + "\n";
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function limpar() {
    terminalBody.textContent = "";
}

function sortei(opcao) {
    if(opcao.toLowerCase() === "s") return Math.random() < 0.5 ? 1 : 2;
    return 1;
}

function deseja_jogar(resposta) {
    resposta = resposta.toLowerCase();
    return resposta === "s" || resposta === "sim";
}

// SCANF improvisado
function scanf(promptText = "") {
    return new Promise((resolve) => {
        if (promptText) print(promptText); 
        input.value = "";
        input.focus();
        const handler = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const value = input.value;
                input.value = "";
                input.removeEventListener("keydown", handler);
                print(value); 
                resolve(value);
            }
        };
        input.addEventListener("keydown", handler);
    });
}

// ------------------------- TABULEIRO -------------------------
function inicializar_matriz(m) {
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            m[i][j] = ' ';
}

function matriz(m) {
    print("\n   1   2   3");
    for (let i = 0; i < 3; i++) {
        let linha = (i+1) + " ";
        for (let j = 0; j < 3; j++) {
            linha += `[${m[i][j]}] `;
        }
        print(linha);
    }
}

function verificar_vitoria(m, simbolo) {
    for (let i=0;i<3;i++) if (m[i][0]==simbolo && m[i][1]==simbolo && m[i][2]==simbolo) return true;
    for (let j=0;j<3;j++) if (m[0][j]==simbolo && m[1][j]==simbolo && m[2][j]==simbolo) return true;
    if (m[0][0]==simbolo && m[1][1]==simbolo && m[2][2]==simbolo) return true;
    if (m[0][2]==simbolo && m[1][1]==simbolo && m[2][0]==simbolo) return true;
    return false;
}

function verificar_empate(m) {
    for (let i=0;i<3;i++) for (let j=0;j<3;j++) if (m[i][j] === ' ') return false;
    return true;
}

// ------------------------- PvP -------------------------
async function pvp(m) {
    let jogador, linha, coluna;
    let opcao;
    inicializar_matriz(m);
    opcao = await scanf(`${AZUL}Deseja sortear quem começa? (S|N): ${RESET}`);
    jogador = sortei(opcao);

    while (true) {
        limpar();
        matriz(m);
        print(`${AZUL}Modo: Jogador vs Jogador${RESET}`);
        print(`${AZUL}Jogador ${jogador} (${jogador==1?'X':'O'}), sua vez.${RESET}`);

        linha = parseInt(await scanf(`${AZUL}Digite a posição da linha (1 a 3) ou 0 para sair:${RESET}`));
        if (linha === 0) { print(`${VERDE}Saindo...${RESET}`); break; }

        coluna = parseInt(await scanf(`${AZUL}Digite a posição da coluna (1 a 3) ou 0 para sair:${RESET}`));
        if (coluna === 0) { print(`${VERDE}Saindo...${RESET}`); break; }

        if (linha < 1 || linha > 3 || coluna < 1 || coluna > 3 || m[linha-1][coluna-1] !== ' ') {
            print(`${VERMELHO}Posição inválida ou ocupada. Tente novamente.${RESET}`);
            continue;
        }

        m[linha-1][coluna-1] = jogador==1?'X':'O';

        if (verificar_vitoria(m, jogador==1?'X':'O')) {
            limpar(); matriz(m);
            print(`${VERDE}Parabéns! O jogador ${jogador} venceu!${RESET}`);
            break;
        }

        if (verificar_empate(m)) {
            limpar(); matriz(m);
            print(`${VERDE}O jogo terminou em empate!${RESET}`);
            break;
        }

        jogador = jogador==1?2:1;
    }
}

// ------------------------- PvC -------------------------
function pc_aleatorio(m) {
    let linha, coluna;
    do { linha = Math.floor(Math.random()*3); coluna = Math.floor(Math.random()*3); }
    while (m[linha][coluna]!==' ');
    print(`\nPC jogou em (${linha+1},${coluna+1})`);
    m[linha][coluna] = 'O';
}

function pc_medio(m) {
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='O'; 
                if(verificar_vitoria(m,'O')) { print(`\nPC jogou em (${i+1},${j+1}) e venceu!`); return; }
                m[i][j]=' ';
            }
        }
    }
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='X'; 
                if(verificar_vitoria(m,'X')) { m[i][j]='O'; print(`\nPC jogou em (${i+1},${j+1}) para bloquear!`); return; }
                m[i][j]=' ';
            }
        }
    }
    pc_aleatorio(m);
}

function pc_inteligente(m) {
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='O'; 
                if(verificar_vitoria(m,'O')) { print(`\nPC jogou em (${i+1},${j+1}) e venceu!`); return; }
                m[i][j]=' ';
            }
        }
    }
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='X'; 
                if(verificar_vitoria(m,'X')) { m[i][j]='O'; print(`\nPC jogou em (${i+1},${j+1}) para bloquear!`); return; }
                m[i][j]=' ';
            }
        }
    }
    if(m[1][1]==' ') { m[1][1]='O'; print("\nPC jogou no centro"); return; }
    const cantos=[[0,0],[0,2],[2,0],[2,2]];
    for(const [l,c] of cantos) if(m[l][c]==' ') { m[l][c]='O'; print(`\nPC jogou no canto (${l+1},${c+1})`); return; }
    const laterais=[[0,1],[1,0],[1,2],[2,1]];
    for(const [l,c] of laterais) if(m[l][c]==' ') { m[l][c]='O'; print(`\nPC jogou na lateral (${l+1},${c+1})`); return; }
}

async function jogada_humana(m, simbolo) {
    const linha = parseInt(await scanf("Linha (1-3) ou 0 p/ sair:"));
    if(linha===0) return false;
    const coluna = parseInt(await scanf("Coluna (1-3) ou 0 p/ sair:"));
    if(coluna===0) return false;
    if(linha<1||linha>3||coluna<1||coluna>3||m[linha-1][coluna-1]!==' ') {
        print("Posição inválida ou ocupada! Tente novamente.");
        return await jogada_humana(m, simbolo);
    }
    m[linha-1][coluna-1] = simbolo;
    return true;
}

async function pvc(m) {
    print(`${AZUL}Modo: Jogador vs Computador${RESET}`);
    inicializar_matriz(m);
    let dificuldade = parseInt(await scanf("Escolha o nível do PC:\n1 - Aleatorio\n2 - Medio\n3 - Inteligente"));
    if (![1,2,3].includes(dificuldade)) {
        print(`${VERMELHO}Nivel invalido! Nivel Aleatorio selecionado.${RESET}`);
        dificuldade = 1;
    }
    let opcao = await scanf(`${AZUL}Deseja sortear quem começa? (S|N): ${RESET}`);
    let jogador = sortei(opcao);

    while(true){
        limpar();
        matriz(m);

        if(jogador===1){
            print("Sua vez (X).");
            if(!await jogada_humana(m,'X')) break;
        } else {
            if(dificuldade===1) pc_aleatorio(m);
            else if(dificuldade===2) pc_medio(m);
            else pc_inteligente(m);
        }

        if(verificar_vitoria(m,jogador===1?'X':'O')){
            limpar(); matriz(m);
            if(jogador===1) print(`${VERDE}Você venceu!${RESET}`);
            else print(`${VERMELHO}O computador venceu!${RESET}`);
            break;
        }
        if(verificar_empate(m)){ limpar(); matriz(m); print(`${VERDE}Empate!${RESET}`); break; }

        jogador = jogador===1?2:1;
    }
}

// ------------------------- MENU PRINCIPAL -------------------------
export async function run(print) {
    const m = Array.from({length:3},()=>Array(3).fill(' '));
    let jogar = "s";
    let modo = 1;

    while(deseja_jogar(jogar) && modo!==3){
        limpar();
        jogar = await scanf(`${AZUL}Deseja jogar? (S|N): ${RESET}`);
        if(!deseja_jogar(jogar)) { print(`${VERDE}Saindo do jogo...${RESET}`); return; }

        limpar();
        print("===== JOGO DA VELHA =====");
        print(`${AZUL}1 - Jogar contra jogador\n2 - Jogar contra o computador\n3 - Sair${RESET}`);
        modo = parseInt(await scanf("Escolha uma opção:"));

        switch(modo){
            case 1: await pvp(m); break;
            case 2: await pvc(m); break;
            case 3: print(`${VERDE}Saindo do jogo... Até logo!${RESET}`); break;
            default: print(`${VERMELHO}Opção inválida! Tente novamente.${RESET}`); break;
        }
    }
}
