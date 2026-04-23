export async function run(print, scanf) {
    const MAX = 20;
    let t;
    let matriz = [];

    // --- Inicialização da matriz ---
    function inicializarMatriz() {
        matriz = [];
        for (let i = 1; i <= t; i++) {
            matriz[i] = [];
            for (let j = 1; j <= t; j++) {
                matriz[i][j] = 0;
            }
        }
    }

    // --- Mostrar matriz ---
    function mostrarMatriz() {
        for (let i = 1; i <= t; i++) {
            let linha = "";
            for (let j = 1; j <= t; j++) {
                linha += matriz[i][j] + " ";
            }
            print(linha);
        }
    }

    // --- Verificar se pode colocar ---
    function podeColocar(linha, coluna) {
        // mesma coluna
        for (let i = 1; i < linha; i++) {
            if (matriz[i][coluna] === 1) return false;
        }

        // diagonal principal
        for (let i = linha - 1, j = coluna - 1; i >= 1 && j >= 1; i--, j--) {
            if (matriz[i][j] === 1) return false;
        }

        // diagonal secundária
        for (let i = linha - 1, j = coluna + 1; i >= 1 && j <= t; i--, j++) {
            if (matriz[i][j] === 1) return false;
        }

        return true;
    }

    // --- Backtracking ---
    function resolver(linha) {
        if (linha > t) return true;

        for (let col = 1; col <= t; col++) {
            if (podeColocar(linha, col)) {
                matriz[linha][col] = 1;
                if (resolver(linha + 1)) return true;
                matriz[linha][col] = 0;
            }
        }
        return false;
    }

    // --- Programa principal ---
    print(`Digite o tamanho da matriz (até ${MAX}): `);
    t = parseInt(await scanf());

    if (t > MAX || t <= 0) {
        print("Tamanho inválido!");
        return;
    }

    print("\nEscolha o modo:");
    print("1 - Manual (você escolhe as posições)");
    print("2 - Automático (backtracking)");
    print("Opção: ");
    const modo = parseInt(await scanf());

    inicializarMatriz();

    if (modo === 1) {
        let continuar;
        do {
            mostrarMatriz();

            print(`\nEscolha uma posição:`);
            print(`Linha (1 a ${t}): `);
            const linha = parseInt(await scanf());
            print(`Coluna (1 a ${t}): `);
            const coluna = parseInt(await scanf());

            if (linha < 1 || linha > t || coluna < 1 || coluna > t) {
                print("Posição inválida!");
            } else if (!podeColocar(linha, coluna)) {
                print("Não pode colocar nessa posição (conflito).");
            } else {
                matriz[linha][coluna] = 1;
            }

            print("\nDeseja continuar (s/n)? ");
            continuar = (await scanf()).toLowerCase();

        } while (continuar === "s");

        print("\nMatriz final:");
        mostrarMatriz();

    } else if (modo === 2) {
        if (resolver(1)) {
            print("\nSolução encontrada:");
            mostrarMatriz();
        } else {
            print(`Não existe solução para t = ${t}.`);
        }
    } else {
        print("Opção inválida!");
    }
}
