#include <stdio.h>
#include <stdlib.h>
#include <string.h> 
#include <time.h>

//funções
//matriz, verificar_vitoria, verificar_empate 
// Inicializa a matriz vazia
void inicializar_matriz(char m[3][3]) {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            m[i][j] = ' ';
}
S

// 
void matriz(char m[3][3]) {
    printf("\n   1   2   3\n");
    for (int i = 0; i < 3; i++) {
        printf("%d ", i + 1);
        for (int j = 0; j < 3; j++) {
            printf("[%c] ", m[i][j]);
        }
        printf("\n");
    }
}

int verificar_vitoria(char m[3][3], char simbolo) {
    // Verifica linhas
    for (int i = 0; i < 3; i++) {
        if (m[i][0] == simbolo && m[i][1] == simbolo && m[i][2] == simbolo) {
            return 1;
        }
    }
    // Verifica colunas
    for (int j = 0; j < 3; j++) {
        if (m[0][j] == simbolo && m[1][j] == simbolo && m[2][j] == simbolo) {
            return 1;
        }
    }
    // Verifica diagonais
    if (m[0][0] == simbolo && m[1][1] == simbolo && m[2][2] == simbolo) {
        return 1;
    }
    if (m[0][2] == simbolo && m[1][1] == simbolo && m[2][0] == simbolo) {
        return 1;
    }
    return 0;
}

int verificar_empate(char m[3][3]) {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (m[i][j] == ' ') {
                return 0; 
            }
        }
    }
    return 1; 
}

//cores
#define RESET    "\033[0m"
#define VERMELHO "\033[1;31m"
#define AZUL     "\033[1;34m"
#define VERDE    "\033[1;32m"

// Limpa tela
void limpar() {
    #ifdef _WIN32 
        system("cls");
    #else 
        system("clear");
    #endif
}

// sorteio
int sortei(char opcao){
    if(opcao=='S' || opcao=='s'){
        srand(time(NULL));
        return rand()%2; // Retorna 0 ou 1
    }
    return 0; 
}

//deseja jogar
int deseja_jogar(char resposta[10]){
    return (strcmp(resposta, "s") == 0 || strcmp(resposta, "S") == 0 ||
            strcmp(resposta, "sim") == 0 || strcmp(resposta, "Sim") == 0);
}

// pvp
void pvp(char m[3][3]) {
    int jogador, linha, coluna;
    char opicao;

    inicializar_matriz(m);

    printf("%sDeseja sortear quem começa? (S|N): %s",AZUL,RESET);
    scanf(" %c", &opicao);

    if (sortei(opicao))
        jogador = 2; 
    else
        jogador = 1;

    while (1) {
        limpar();
        matriz(m);
        printf("%sModo: Jogador vs Jogador\n%s",AZUL,RESET);
        printf("%sJogador %d (%c), sua vez.%s\n",AZUL,jogador,(jogador == 1) ? 'X' : 'O',RESET);

        printf("%sDigite a posição da linha (1 a 3) ou 0 para sair:%s\n",AZUL,RESET);
        scanf("%d", &linha);
        if (linha == 0) {
            printf("%s Saindo...\n%s",VERDE,RESET);
            break;
        }

        printf("%sDigite a posição da coluna (1 a 3) ou 0 para sair:%s\n",AZUL,RESET);
        scanf("%d", &coluna);
        if (coluna == 0) {
            printf("%sSaindo...\n%s",VERDE,RESET);
            break;
        }

        if (linha < 1 || linha > 3 || coluna < 1 || coluna > 3) {
            printf("%sPosição inválida. Tente novamente.%s\n",VERMELHO,RESET);
            getchar();
            continue;
        }

        if (m[linha - 1][coluna - 1] != ' ') {
            printf("%sPosição já ocupada. Tente novamente.%s\n",VERMELHO,RESET);
            getchar();
            continue;
        }

        char simbolo = (jogador == 1) ? 'X' : 'O';
        m[linha - 1][coluna - 1] = simbolo;

        if (verificar_vitoria(m, simbolo)) {
            limpar();
            matriz(m);
            printf("%sParabéns! O jogador %d venceu!%s\n",VERDE,jogador,RESET);
            break;
        }

        if (verificar_empate(m)) {
            limpar();
            matriz(m);
            printf("%sO jogo terminou em empate!%s\n",VERDE,RESET);
            break;
        }

        jogador = (jogador == 1) ? 2 : 1;
    }
}
//pc aleatorio
void pc_aleatorio(char m[3][3])
{
    int linha, coluna;
    srand(time(NULL));
    linha = rand() % 3;
    coluna = rand() % 3;

    // enquanto a posição sorteada já estiver ocupada, sorteia de novo
    while (m[linha][coluna] != ' ') {
        linha = rand() % 3;
        coluna = rand() % 3;
    }

    printf("\n PC jogou em (%d,%d)\n", linha + 1, coluna + 1);
    m[linha][coluna] = 'O';
    
}
// 2️⃣ PC Médio (bloqueio + vitória)
void pc_medio(char m[3][3]) {
    int i, j;
    // Vitória imediata
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='O';
                if(verificar_vitoria(m,'O')){ printf("\n PC jogou em (%d,%d) e venceu!\n",i,j); return; }
                m[i][j]=' ';
            }
        }
    }
    // Bloqueio jogador
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='X';
                if(verificar_vitoria(m,'X')){
                     m[i][j]='O'; printf("\n PC jogou em (%d,%d) para bloquear!\n",i+1,j+1);
                      return; }
                m[i][j]=' ';
            }
        }
    }
    // Aleatório
    pc_aleatorio(m);
}

// 3️⃣ PC Inteligente (estratégia)
void pc_inteligente(char m[3][3]) {
    int i,j;
    // Vitória imediata
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='O';
                if(verificar_vitoria(m,'O')){ printf("\n PC jogou em (%d,%d) e venceu!\n",i+1,j+1); 
                return; }
                m[i][j]=' ';
            }
        }
    }
    // Bloqueio jogador
    for(i=0;i<3;i++){
        for(j=0;j<3;j++){
            if(m[i][j]==' '){ m[i][j]='X';
                if(verificar_vitoria(m,'X')){ m[i][j]='O'; printf("\n PC jogou em (%d,%d) para bloquear!\n",i,j); return; }
                m[i][j]=' ';
            }
        }
    }
    // Centro
    if(m[1][1]==' '){ m[1][1]='O'; printf("\n PC jogou no centro (1,1)\n"); return; }
    // Cantos
    int cantos[4][2]={{0,0},{0,2},{2,0},{2,2}};
    for(i=0;i<4;i++){
        int l=cantos[i][0], c=cantos[i][1];
        if(m[l][c]==' '){ m[l][c]='O'; printf("\nPC jogou no canto (%d,%d)\n",l,c); return; }
    }
    // Laterais
    int laterais[4][2]={{0,1},{1,0},{1,2},{2,1}};
    for(i=0;i<4;i++){
        int l=laterais[i][0], c=laterais[i][1];
        if(m[l][c]==' '){ m[l][c]='O'; printf("\n PC jogou na lateral (%d,%d)\n",l,c); return; }
    }
}


//===================pvc=========================
int jogada_humana(char m[3][3], char simbolo) {
    int linha, coluna;

    printf("Linha (1-3) ou 0 p/ sair: ");
    scanf("%d", &linha);
    if (linha == 0) return 0;

    printf("Coluna (1-3) ou 0 p/ sair: ");
    scanf("%d", &coluna);
    if (coluna == 0) return 0;

    if (linha < 1 || linha > 3 || coluna < 1 || coluna > 3 || m[linha-1][coluna-1] != ' ') {
        printf("Posição inválida ou ocupada! Tente novamente.\n");
        return jogada_humana(m, simbolo);
    }

    m[linha-1][coluna-1] = simbolo;
    return 1;
}

void pvc(char m[3][3]) 
{
    printf("%sModo: Jogador vs Computador\n%s",AZUL,RESET);
    int jogador;
    int dificuldade;
    char opicao;
    inicializar_matriz(m);

    printf("\nEscolha o nivel do PC:\n1 - Aleatorio\n2 - Medio\n3 - Inteligente\nEscolha: "); 
    scanf("%d",&dificuldade);

    switch(dificuldade){
        case 1:
            printf("\n%sNivel Aleatorio selecionado.%s\n",AZUL,RESET); 
            break;
        case 2: 
            printf("\n%sNivel Medio selecionado.%s\n",AZUL,RESET); 
            break;
        case 3: 
            printf("\n%sNivel Inteligente selecionado.%s\n",AZUL,RESET); 
            break;
        default: 
            printf("\n%sNivel invalido! Nivel Aleatorio selecionado.%s\n",VERMELHO,RESET);
            dificuldade=1; 
            break;
    }
    limpar();
    printf("%sDeseja sortear quem começa? (S|N): %s",AZUL,RESET);
    scanf(" %c", &opicao);

    if (sortei(opicao))
        jogador = 2; 
    else
        jogador = 1;
    jogador = sortei(opicao) ? 2 : 1;

    while (1) {
        limpar();
        matriz(m);

        if (jogador == 1) {
            printf("Sua vez (X).\n");
            if (!jogada_humana(m, 'X')) break;
        } else {
            if (dificuldade == 1) pc_aleatorio(m);
            else if (dificuldade == 2) pc_medio(m);
            else if (dificuldade == 3) pc_inteligente(m);
        }

        if (verificar_vitoria(m, (jogador==1)?'X':'O')) {
            limpar(); matriz(m);
            if (jogador==1) printf("%sVocê venceu!%s\n",VERDE,RESET);
            else printf("%sO computador venceu!%s\n",VERMELHO,RESET);
            break;
        }
        if (verificar_empate(m)) {
            limpar(); matriz(m);
            printf("%sEmpate!%s\n",VERDE,RESET);
            break;
        }

        jogador = (jogador == 1) ? 2 : 1;
    }

}

int main() {
    char m[3][3];
    char jogar[10];
    int modo;
    limpar();
    printf("===== JOGO DA VELHA =====\n");
    printf("\n");

    do {
        printf("%sDeseja jogar? (S|N): %s",AZUL,RESET);
        scanf(" %9s", jogar);

        if (!deseja_jogar(jogar)) {
            printf("%sSaindo do jogo...\n%s\n",VERDE,RESET);
            return 0;
        }

        limpar();
        printf("===== JOGO DA VELHA =====\n");
        printf("%s1 - Jogar contra jogador\n",AZUL);
        printf("2 - Jogar contra o computador\n");
        printf("3 - Sair%s\n",RESET);
        scanf("%d", &modo);

        switch (modo) {
            case 1:
                pvp(m);
                break;
            case 2:
                pvc(m);
                break;
            case 3:
                printf("%s \nSaindo do jogo... Ate logo!\n %s",VERDE,RESET);
                break;
            default:
                printf("\n%sOpcao invalida! Tente novamente.%s\n",VERMELHO,RESET);
                getchar(); getchar();
        }
    } while (modo != 3);

    return 0;
}