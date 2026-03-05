import { clearTerminal } from "../terminal.js";
export async function run(print, scanf) { 
// =================== CONSTANTES ===================
const MAX_NOME = 50;
const NUM_MONSTRO = 10;
const CHANCE_CRITICO = 0.10;
const MULT_CRITICO = 1.50;
const CHANCE_FUGA = 0.50;
const DANO_FUGA_FALHA = 0.10;
const CURA_POCAO = 0.20;
const PODER_ESCALONAMENTO = 5.0;
const NIVEL_ESCALONAMENTO = 8;
const MAX_POCOES = 3;

let teto_dano = 0;

// =================== ENUMS ===================
const CLASSE = {
    GUERREIRO: 0,
    ESTUDIOSO: 1,
    LADINO: 2
};

const REGIAO = {
    FLORESTA: 0,
    MONTANHAS: 1,
    ABISMO: 2
};

// =================== CATÁLOGO DE MONSTROS ===================
const catalogo_monstro = [
    { nivel: 1, nome: "Rastejante das Sombras",
        hp: 40.0, poder: 10.0, variacao: 3 },
    { nivel: 2, nome: "Lobo das Brumas", 
        hp: 55.0, poder: 18.0, variacao: 4 },
    { nivel: 3, nome: "Goblin Saqueador",
        hp: 70.0, poder: 26.0, variacao: 5 },
    { nivel: 4, nome: "Arqueiro Espectral"
        , hp: 80.0, poder: 34.0, variacao: 6 },
    { nivel: 5, nome: "Guardião de Pedra",
        hp: 95.0, poder: 42.0, variacao: 7 },
    { nivel: 6, nome: "Feiticeiro Caído", 
        hp: 110.0, poder: 50.0, variacao: 8 },
    { nivel: 7, nome: "Górgona Crepuscular",
        hp: 125.0, poder: 60.0, variacao: 9 },
    { nivel: 8, nome: "Quimera Rubra",
        hp: 140.0, poder: 72.0, variacao: 10 },
    { nivel: 9, nome: "Titã do Trovão",
        hp: 160.0, poder: 85.0, variacao: 12 },
    { nivel: 10, nome: "Dragão Abissal", 
        hp: 200.0, poder: 100.0, variacao: 15 }
];

// =================== FUNÇÕES AUXILIARES ===================
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initializeHero(nome, classe) {
    const heroi = {
        nome,
        classe,
        hp: 0,
        poder: 0,
        vitorias: 0,
        derrotas: 0,
        pocoes: MAX_POCOES,
        maiorNivelDerrotado: 0,
        escalonamentoAtivo: 0,
        chanceFuga: CHANCE_FUGA
    };

    if (classe === CLASSE.GUERREIRO) {
        heroi.hp = 120.0;
        heroi.poder = 0.0;
    } else if (classe === CLASSE.ESTUDIOSO) {
        heroi.hp = 100.0;
        heroi.poder = 10.0;
    } else if (classe === CLASSE.LADINO) {
        heroi.hp = 100.0;
        heroi.poder = 0.0;
        heroi.chanceFuga *= 1.2;
    }

    return heroi;
}

async function escolherClasse() {
    let opcao;
    do {
        print("\nEscolha a classe do herói:");
        print("1. Guerreiro (HP: 120, Poder: 0)");
        print("2. Estudioso (HP: 100, Poder: 10)");
        print("3. Ladino (HP: 100, Poder: 0, +20% fuga)");
        print("Digite o número:");
        opcao = parseInt(await scanf());
    } while (opcao < 1 || opcao > 3);
    return opcao - 1;
}

async function escolherRegiao() {
    let opcao;
    do {
        print("\nEscolha a região da batalha:");
        print("1. Floresta Sombria (monstros -10% HP e -10% poder)");
        print("2. Montanhas Rubras (monstros normais)");
        print("3. Abismo Ecoante (monstros +15% HP e +15% poder)");
        print("Digite o número:");
        opcao = parseInt(await scanf());
    } while (opcao < 1 || opcao > 3);
    return opcao - 1;
}

function generateMonster(nivel, escalonamentoAtivo, regiao) {
    const base = catalogo_monstro[nivel - 1];
    let poderBase = base.poder;

    if (escalonamentoAtivo && nivel >= NIVEL_ESCALONAMENTO) {
        poderBase += PODER_ESCALONAMENTO;
    }

    const poderAleatorio = randint(-base.variacao, base.variacao);

    let monstro = {
        nivel,
        nome: base.nome,
        hp: base.hp,
        poder: poderBase + poderAleatorio
    };

    if (monstro.poder < 0) monstro.poder = 0;

    if (regiao === REGIAO.FLORESTA) {
        monstro.hp *= 0.90;
        monstro.poder *= 0.90;
    } else if (regiao === REGIAO.ABISMO) {
        monstro.hp *= 1.15;
        monstro.poder *= 1.15;
    }

    return monstro;
}

function mostrarStatus(heroi) {
    print("\n--- Status do Herói ---");
    print("Nome: " + heroi.nome);
    print("HP: " + heroi.hp.toFixed(2));
    print("Poder: " + heroi.poder.toFixed(2));
    print("Vitórias: " + heroi.vitorias);
    print("Derrotas: " + heroi.derrotas);
    print("Poções restantes: " + heroi.pocoes);
    print("Maior nível derrotado: " + 
        heroi.maiorNivelDerrotado);
    print("Escalonamento ativo: " + 
        (heroi.escalonamentoAtivo ? "Sim" : "Não"));
}

function combate(heroi, monstro) {
    print("\n--- Combate ---");
    print(`Herói: Poder ${heroi.poder.toFixed(2)},
         HP ${heroi.hp.toFixed(2)}`);
    print(`Monstro (${monstro.nome} Nível ${monstro.nivel}): 
        Poder ${monstro.poder.toFixed(2)},
            HP ${monstro.hp.toFixed(2)}`);

    const diff = Math.abs(heroi.poder - monstro.poder);
    const maxPoder = Math.max(heroi.poder, monstro.poder);
    let perc = maxPoder === 0 ? 0 : diff / maxPoder;

    if (perc > teto_dano) perc = teto_dano;

    const critico = Math.random() < CHANCE_CRITICO;
    if (critico) {
        perc *= MULT_CRITICO;
        print("Golpe crítico!");
    }

    if (heroi.poder > monstro.poder) {
        monstro.hp -= monstro.hp * perc;
        heroi.vitorias++;

        if (monstro.nivel > heroi.maiorNivelDerrotado)
            heroi.maiorNivelDerrotado = monstro.nivel;

        if (monstro.nivel >= NIVEL_ESCALONAMENTO)
            heroi.escalonamentoAtivo = 1;

        print("Herói venceu!");
    } else {
        heroi.hp -= heroi.hp * perc;
        heroi.derrotas++;
        print("Monstro venceu!");
    }

    const ganho = 1.5 * diff;
    heroi.poder += ganho;
    print(`Ganho de poder: ${ganho.toFixed(2)}`);
}

function relatorioFinal(heroi) {
    print("\n--- Relatório Final ---");
    print("Nome: " + heroi.nome);
    print("Classe: " +
        (heroi.classe === CLASSE.GUERREIRO ? "Guerreiro" :
        heroi.classe === CLASSE.ESTUDIOSO ? "Estudioso" : "Ladino")
    );
    print("Vitórias: " + heroi.vitorias);
    print("Derrotas: " + heroi.derrotas);
    print("Maior nível derrotado: " + heroi.maiorNivelDerrotado);
    print("Poder final: " + heroi.poder.toFixed(2));
    print("HP final: " + heroi.hp.toFixed(2));
}

// =================== PROGRAMA PRINCIPAL ===================
async function main() {
    print("Bem-vindo a Eldoria!");
    print("Digite o teto de dano (0.10 a 0.50):");
    teto_dano = parseFloat(await scanf());
    if (teto_dano < 0.10) teto_dano = 0.0;
    if (teto_dano > 0.50) teto_dano = 0.80;
    clearTerminal();
    print("Digite o nome do herói:");
    const nome = await scanf();

    const classe = await escolherClasse();
    const regiao = await escolherRegiao();

    const heroi = initializeHero(nome, classe);

    while (heroi.hp > 0) {
        clearTerminal();
        mostrarStatus(heroi);

        print("\nEscolha o nível do monstro (1-10) ou 0 para sair:");
        const nivel = parseInt(await scanf());
        if (nivel === 0) break;
        if (nivel < 1 || nivel > 10) {
            print("Nível inválido!");
            continue;
        }

        print("Tentar fugir? (s/n):");
        const tentarFugir = (await scanf()).toLowerCase();
        if (tentarFugir === "s") {
            if (Math.random() < heroi.chanceFuga) {
                print("Fuga bem-sucedida!");
                continue;
            } else {
                const dano = heroi.hp * DANO_FUGA_FALHA;
                heroi.hp -= dano;
                print(`Fuga falhou! Perdeu ${dano.toFixed(2)} HP.`);
            }
        }

        const monstro = generateMonster
            (nivel, heroi.escalonamentoAtivo, regiao);
        combate(heroi, monstro);

        if (heroi.pocoes > 0) {
            print("Usar poção? (s/n):");
            const usar = (await scanf()).toLowerCase();
            if (usar === "s") {
                heroi.hp += heroi.hp * CURA_POCAO;
                if (heroi.hp > 120.0) heroi.hp = 120.0;
                heroi.pocoes--;
                print(`Poção usada! HP agora: ${heroi.hp.toFixed(2)}`);
            }
        }
    }

    if (heroi.hp <= 0) {
        print("\nGame Over! Seu HP chegou a zero.");
    }

    relatorioFinal(heroi);
    print("\nDesenvolvido por [Regelvis Gustavo \t RA: 230027389]");
}

// Executa o jogo
await main();
}

