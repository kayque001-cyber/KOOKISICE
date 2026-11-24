
// =====================================
// KOOKIS ICE - INTEGRAÇÃO WHATSAPP
// =====================================

const numeroWhatsApp = "5521982441637";

function enviarPedidoWhatsApp(dadosCliente) {

    if (!carrinho || carrinho.length === 0) {
        alert("Seu carrinho está vazio.");
        return;
    }

    let mensagem = `Olá! Gostaria de fazer um pedido na Kookis Ice.\n\n`;

    mensagem += `*DADOS DO CLIENTE*\n`;
    mensagem += `Nome: ${dadosCliente.nome}\n`;
    mensagem += `Recebimento: ${dadosCliente.tipo}\n`;

    if (dadosCliente.tipo === "Entrega") {
        mensagem += `Endereço: ${dadosCliente.endereco}\n`;
        mensagem += `Taxa de entrega: A confirmar\n`;
    }

    mensagem += `\n*MEU PEDIDO*\n`;

    let total = 0;

    carrinho.forEach(produto => {

        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;

        mensagem += `${produto.quantidade}x ${produto.nome}\n`;

        if (produto.adicionais && produto.adicionais.length > 0) {
            mensagem += `Adicionais: ${produto.adicionais.join(", ")}\n`;
            mensagem += `Adicionais: Grátis\n`;
        }

        mensagem += `Valor: ${subtotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}\n\n`;

    });

    mensagem += `*TOTAL DOS PRODUTOS: ${total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}*\n\n`;

    if (dadosCliente.observacao) {
        mensagem += `*OBSERVAÇÕES*\n${dadosCliente.observacao}\n\n`;
    }

    mensagem += `Gostaria de confirmar a disponibilidade, a entrega e a forma de pagamento.`;

    const mensagemCodificada = encodeURIComponent(mensagem);

    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    window.open(linkWhatsApp, "_blank");
}
