

document.addEventListener('DOMContentLoaded', () => {
    // Menu
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.navegacao ul');
    if (toggle && menu) {
        toggle.addEventListener('click', () => menu.classList.toggle('active'));
    }

    // Tempo da apresentação antes de iniciar a matrix (ms)
    const presentationDuration = 3000;
    setTimeout(() => {
        // chamamos com opções maiores por padrão
        startLargeMatrixEffect({
            desiredColumns: 140, // número alvo de colunas (ajuste aqui)
            minFont: 10,
            maxFont: 30,
            minSpeed: 3,   // queda mais rápida (s)
            maxSpeed: 9,
            minUpdateInterval: 25 // troca de conteúdo mais frequente (ms)
        });
    }, presentationDuration);
});

/* startLargeMatrixEffect(options)
   - desiredColumns: quantas colunas queremos (será adaptado conforme a tela)
   - minUpdateInterval: valor mínimo (mais rápido = números mudam com mais frequência)
*/
function startLargeMatrixEffect(options = {}) {
    const {
        desiredColumns = 140,
        minFont = 10,
        maxFont = 30,
        minSpeed = 3,
        maxSpeed = 9,
        minUpdateInterval = 25
    } = options;

    const matrix = document.querySelector('.matrix');
    if (!matrix) return;

    matrix.innerHTML = '';

    // largura da viewport (px) e densidade adaptativa
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    // adapta columns conforme a largura da tela:
    // em telas grandes permite atingir desiredColumns, em telas pequenas reduz.
    const baseColumns = Math.floor(vw / 8); // 1 coluna a cada ~8px de largura (ajustável)
    const columns = Math.max(30, Math.min(desiredColumns, baseColumns));

    // performance: em mobile reduzimos ainda mais para evitar muitos timers
    const isMobile = vw <= 768;
    const finalColumns = isMobile ? Math.max(20, Math.floor(columns * 0.5)) : columns;

    for (let i = 0; i < finalColumns; i++) {
        const drop = document.createElement('div');
        drop.classList.add('drop');

        // distribuição horizontal mais uniforme
        const leftPercent = (i / finalColumns) * 100 + (Math.random() * (100 / finalColumns));
        drop.style.left = `${leftPercent}vw`;

        // variação de fonte
        const fontSize = Math.floor(minFont + Math.random() * (maxFont - minFont));
        drop.style.fontSize = `${fontSize}px`;

        // duração de queda (s)
        const duration = (minSpeed + Math.random() * (maxSpeed - minSpeed)).toFixed(2);
        drop.style.animationDuration = `${duration}s`;

        // delay inicial para variar o início das colunas
        const delay = (Math.random() * 4).toFixed(2);
        drop.style.animationDelay = `${delay}s`;

        // cria uma sequência de números (len proporcional ao viewport / fontSize)
        const len = Math.max(6, Math.floor((vw / 100) * (fontSize / 12)));
        drop.textContent = makeNumberString(len);

        matrix.appendChild(drop);

        // atualiza o conteúdo frequentemente - intervalo adaptado por fontSize e opções
        // quanto maior a fonte, mais lento; quanto menor, mais rápido (visualmente agradável)
        const adaptiveInterval = Math.max(minUpdateInterval, 200 - fontSize * 6);
        // em mobile aumentamos um pouco o intervalo para economizar CPU
        const finalInterval = isMobile ? Math.max(40, adaptiveInterval) : adaptiveInterval;

        // armazena o interval id caso queira limpar futuramente (não necessário aqui)
        setInterval(() => {
            const newLen = Math.max(6, Math.floor(6 + Math.random() * 30));
            drop.textContent = makeNumberString(newLen);
        }, finalInterval);
    }

    // opcional: recria a matrix se redimensionar muito (comentado para evitar trabalho desnecessário)
    let resizeTimeout = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // se quiser recriar ao redimensionar, descomente:
            // startLargeMatrixEffect(options);
            // por enquanto só evita recriar automaticamente para não sobrecarregar.
        }, 250);
    });
}

/* Gera string de dígitos */
function makeNumberString(n) {
    let s = '';
    for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
    return s;
}

