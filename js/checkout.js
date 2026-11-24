
const formularioCheckout = document.getElementById("form-checkout");
const tipoEntrega = document.getElementById("tipo-entrega");
const campoEndereco = document.getElementById("campo-endereco");
const enderecoCliente = document.getElementById("endereco-cliente");

const areaCarrinho = document.getElementById("area-carrinho");
const checkout = document.getElementById("checkout");
const botaoVoltarCarrinho = document.getElementById("botao-voltar-carrinho");


// MOSTRAR OU ESCONDER ENDEREÇO
tipoEntrega.addEventListener("change", () => {
    const entregaSelecionada = tipoEntrega.value === "Entrega";

    campoEndereco.style.display = entregaSelecionada ? "block" : "none";
    enderecoCliente.required = entregaSelecionada;

    if (!entregaSelecionada) {
        enderecoCliente.value = "";
    }
});


// VOLTAR PARA O CARRINHO
botaoVoltarCarrinho.addEventListener("click", () => {
    checkout.style.display = "none";
    areaCarrinho.style.display = "block";
});


// FINALIZAR PEDIDO
formularioCheckout.addEventListener("submit", evento => {
    evento.preventDefault();

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const nome = document.getElementById("nome-cliente").value.trim();
    const tipo = tipoEntrega.value;
    const endereco = enderecoCliente.value.trim();

    const observacao = document
        .getElementById("observacao-cliente")
        .value.trim();

    if (!nome || !tipo) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    if (tipo === "Entrega" && !endereco) {
        alert("Informe seu endereço de entrega.");
        return;
    }

    if (typeof enviarPedidoWhatsApp !== "function") {
        alert("Não foi possível iniciar o pedido. Tente novamente.");
        return;
    }

    enviarPedidoWhatsApp({
        nome,
        tipo,
        endereco,
        observacao
    });
});
