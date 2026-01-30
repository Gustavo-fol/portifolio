export async function run(print, scanf) {

    function respostabot(mensagem) {
        return "BOT: resposta";
    }

    print("Seja bem-vindo ao nosso chatbot de dúvidas!");
    print("Para sair, digite 'x'");
    print("-".repeat(40));

    let mensagens = [];
    let duvidas = [];

    while (true) {
        print("Você:");
        let duvida = await scanf();

        if (!duvida || duvida.trim() === "") {
            print("BOT: Por favor, digite uma dúvida válida.");
            continue;
        }

        duvida = duvida.trim();

        if (duvida.toLowerCase() === "x") {
            break;
        }

        let resposta = respostabot(duvida);

        print(`BOT: ${resposta}`);

        mensagens.push({ user: duvida, bot: resposta });
        duvidas.push(duvida);
    }

    print("-".repeat(40));
    print("Histórico de conversa:");

    for (let msg of mensagens) {
        print("Usuário: " + msg.user);
        print("BOT: " + msg.bot);
        print("-".repeat(20));
    }

    let repetidas = new Set(
        duvidas.filter(d => duvidas.filter(x => x === d).length > 1)
    );

    if (repetidas.size > 0) {
        print("Dúvidas repetidas detectadas: " + [...repetidas].join(", "));
    } else {
        print("Nenhuma dúvida foi repetida.");
    }

    print("Saindo...");
}
