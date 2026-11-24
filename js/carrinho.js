
let carrinho = [];

const adicionaisAcai = [
    "Leite em pó",
    "Granola",
    "Amendoim",
    "Paçoca",
    "Leite condensado",
    "Confete",
    "Morango",
    "Banana"
];

const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");

const painelCarrinho = document.getElementById("painel-carrinho");
const fundoCarrinho = document.getElementById("fundo-carrinho");

const botaoAbrirCarrinho = document.getElementById("botao-abrir-carrinho");
const botaoFecharCarrinho = document.getElementById("botao-fechar-carrinho");
const botaoLimparCarrinho = document.getElementById("botao-limpar-carrinho");
const botaoFinalizar = document.getElementById("botao-finalizar");

const avisoCarrinho = document.getElementById("aviso-carrinho");


// FORMATAR VALORES
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// GERAR IDENTIFICADOR DO ITEM
function gerarChave(id, adicionais = []) {
    const lista = [...adicionais].sort();
    return `${id}::${lista.join("|")}`;
}


// ABRIR CARRINHO
function abrirCarrinho() {
    painelCarrinho.classList.add("ativo");
    fundoCarrinho.classList.add("ativo");

    document.body.classList.add("carrinho-aberto");

    painelCarrinho.removeAttribute("inert");
    painelCarrinho.setAttribute("aria-hidden", "false");

    fundoCarrinho.setAttribute("aria-hidden", "false");
    botaoAbrirCarrinho.setAttribute("aria-expanded", "true");

    botaoFecharCarrinho.focus();
}


// FECHAR CARRINHO
function fecharCarrinho() {
    painelCarrinho.classList.remove("ativo");
    fundoCarrinho.classList.remove("ativo");

    document.body.classList.remove("carrinho-aberto");

    painelCarrinho.setAttribute("aria-hidden", "true");
    painelCarrinho.setAttribute("inert", "");

    fundoCarrinho.setAttribute("aria-hidden", "true");
    botaoAbrirCarrinho.setAttribute("aria-expanded", "false");

    botaoAbrirCarrinho.focus();
}


// AVISOS
let temporizadorAviso;

function mostrarAviso(mensagem) {
    avisoCarrinho.textContent = mensagem;
    avisoCarrinho.classList.add("ativo");

    clearTimeout(temporizadorAviso);

    temporizadorAviso = setTimeout(() => {
        avisoCarrinho.classList.remove("ativo");
    }, 2500);
}


// SALVAR CARRINHO
function salvarCarrinho() {
    localStorage.setItem("kookisCarrinho", JSON.stringify(carrinho));
}


// CARREGAR CARRINHO
function carregarCarrinho() {
    try {
        const dadosSalvos = localStorage.getItem("kookisCarrinho");

        if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);

            if (Array.isArray(dados)) {
                carrinho = dados
                    .filter(item =>
                        item &&
                        Number.isFinite(Number(item.id)) &&
                        Number.isFinite(Number(item.preco)) &&
                        Number.isInteger(Number(item.quantidade)) &&
                        Number(item.quantidade) > 0
                    )
                    .map(item => {
                        const adicionais = Array.isArray(item.adicionais)
                            ? item.adicionais.filter(adicional =>
                                adicionaisAcai.includes(adicional)
                            )
                            : [];

                        return {
                            ...item,
                            id: Number(item.id),
                            preco: Number(item.preco),
                            quantidade: Number(item.quantidade),
                            adicionais,
                            chave: gerarChave(Number(item.id), adicionais)
                        };
                    });
            }
        }
    } catch (erro) {
        carrinho = [];
        localStorage.removeItem("kookisCarrinho");
    }

    atualizarCarrinho();
}


// JANELA DE PERSONALIZAÇÃO DO AÇAÍ
function abrirPersonalizacao(produto) {
    let modal = document.getElementById("modal-personalizacao");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-personalizacao";
        modal.className = "modal-personalizacao";

        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="personalizacao-conteudo">
            <button
                type="button"
                class="fechar-personalizacao"
                aria-label="Fechar"
            >×</button>

            <span class="personalizacao-etiqueta">MONTE DO SEU JEITO</span>

            <h2>Personalize seu açaí</h2>

            <p class="personalizacao-descricao">
                Escolha os adicionais que quiser. Todos são gratuitos!
            </p>

            <div class="personalizacao-preco">
                ${formatarMoeda(Number(produto.preco))}
            </div>

            <div class="lista-adicionais">
                ${adicionaisAcai.map((adicional, indice) => `
                    <label class="opcao-adicional">
                        <input
                            type="checkbox"
                            value="${adicional}"
                            id="adicional-${indice}"
                        >

                        <span>${adicional}</span>
                        <strong>Grátis</strong>
                    </label>
                `).join("")}
            </div>

            <div class="rodape-personalizacao">
                <button
                    type="button"
                    class="botao-cancelar-personalizacao"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    class="botao-confirmar-personalizacao"
                >
                    Adicionar ao carrinho
                </button>
            </div>
        </div>
    `;

    modal.classList.add("ativo");

    function fecharModal() {
        modal.classList.remove("ativo");
    }

    modal.querySelector(".fechar-personalizacao")
        .addEventListener("click", fecharModal);

    modal.querySelector(".botao-cancelar-personalizacao")
        .addEventListener("click", fecharModal);

    modal.addEventListener("click", function fecharFora(evento) {
        if (evento.target === modal) {
            fecharModal();
        }
    });

    modal.querySelector(".botao-confirmar-personalizacao")
        .addEventListener("click", () => {
            const selecionados = Array.from(
                modal.querySelectorAll(".opcao-adicional input:checked")
            ).map(input => input.value);

            adicionarProduto(produto, selecionados);

            fecharModal();
        });

    modal.querySelector(".fechar-personalizacao").focus();
}


// ADICIONAR PRODUTO AO CARRINHO
function adicionarProduto(produto, adicionais = []) {
    const chave = gerarChave(produto.id, adicionais);

    const produtoExistente = carrinho.find(item => item.chave === chave);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            chave,
            nome: produto.nome,
            preco: Number(produto.preco),
            imagem: produto.imagem || "",
            quantidade: 1,
            adicionais: [...adicionais]
        });
    }

    atualizarCarrinho();

    mostrarAviso(`${produto.nome} adicionado ao carrinho!`);
}


// ADICIONAR PELO CARDÁPIO
function adicionarAoCarrinho(id) {
    const produto = produtos.find(item => item.id === id);

    if (!produto) {
        return;
    }

    // O produto de ID 1 é o açaí
    if (produto.id === 1) {
        abrirPersonalizacao(produto);
        return;
    }

    adicionarProduto(produto);
}


// ALTERAR QUANTIDADE
function alterarQuantidade(chave, alteracao) {
    const produto = carrinho.find(item => item.chave === chave);

    if (!produto) {
        return;
    }

    produto.quantidade += alteracao;

    if (produto.quantidade <= 0) {
        removerDoCarrinho(chave);
        return;
    }

    atualizarCarrinho();
}


// REMOVER PRODUTO
function removerDoCarrinho(chave) {
    carrinho = carrinho.filter(item => item.chave !== chave);

    atualizarCarrinho();
}


// LIMPAR CARRINHO
function limparCarrinho() {
    carrinho = [];

    atualizarCarrinho();
}


// ATUALIZAR CARRINHO
function atualizarCarrinho() {
    listaCarrinho.innerHTML = "";

    let total = 0;
    let quantidadeTotal = 0;

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <span>🛒</span>
                <h3>Seu carrinho está vazio</h3>
                <p>Escolha alguma delícia do nosso cardápio!</p>
            </div>
        `;
    }

    carrinho.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;
        quantidadeTotal += produto.quantidade;

        const item = document.createElement("div");

        item.classList.add("item-carrinho");

        item.innerHTML = `
            <div class="item-carrinho-info">
                <h4>${produto.nome}</h4>

                <p>${formatarMoeda(produto.preco)}</p>

                ${produto.adicionais && produto.adicionais.length > 0 ? `
                    <div class="adicionais-carrinho">
                        <strong>Adicionais:</strong>
                        <p>${produto.adicionais.join(", ")}</p>
                        <span>Todos gratuitos</span>
                    </div>
                ` : ""}

                <div class="controles-quantidade">
                    <button
                        type="button"
                        class="quantidade-menos"
                        data-chave="${produto.chave}"
                    >−</button>

                    <span>${produto.quantidade}</span>

                    <button
                        type="button"
                        class="quantidade-mais"
                        data-chave="${produto.chave}"
                    >+</button>
                </div>
            </div>

            <div class="item-carrinho-final">
                <strong>${formatarMoeda(subtotal)}</strong>

                <button
                    type="button"
                    class="botao-remover-item"
                    data-chave="${produto.chave}"
                >
                    Remover
                </button>
            </div>
        `;

        listaCarrinho.appendChild(item);
    });

    totalCarrinho.textContent = formatarMoeda(total);
    contadorCarrinho.textContent = quantidadeTotal;

    botaoLimparCarrinho.disabled = carrinho.length === 0;
    botaoFinalizar.disabled = carrinho.length === 0;

    salvarCarrinho();
}


// EVENTOS DOS BOTÕES DO CARRINHO
botaoAbrirCarrinho.addEventListener("click", abrirCarrinho);
botaoFecharCarrinho.addEventListener("click", fecharCarrinho);
fundoCarrinho.addEventListener("click", fecharCarrinho);
botaoLimparCarrinho.addEventListener("click", limparCarrinho);

botaoFinalizar.addEventListener("click", () => {
    if (carrinho.length === 0) {
        return;
    }

    document.getElementById("area-carrinho").style.display = "none";
    document.getElementById("checkout").style.display = "block";
});


// EVENTOS DOS PRODUTOS E QUANTIDADES
document.addEventListener("click", evento => {
    const botaoAdicionar = evento.target.closest(".botao-adicionar");

    if (botaoAdicionar) {
        const id = Number(botaoAdicionar.dataset.id);
        adicionarAoCarrinho(id);
    }

    const botaoMais = evento.target.closest(".quantidade-mais");

    if (botaoMais) {
        alterarQuantidade(botaoMais.dataset.chave, 1);
    }

    const botaoMenos = evento.target.closest(".quantidade-menos");

    if (botaoMenos) {
        alterarQuantidade(botaoMenos.dataset.chave, -1);
    }

    const botaoRemover = evento.target.closest(".botao-remover-item");

    if (botaoRemover) {
        removerDoCarrinho(botaoRemover.dataset.chave);
    }
});


// FECHAR COM ESC
document.addEventListener("keydown", evento => {
    if (
        evento.key === "Escape" &&
        painelCarrinho.classList.contains("ativo")
    ) {
        fecharCarrinho();
    }

    if (evento.key === "Escape") {
        const modal = document.getElementById("modal-personalizacao");

        if (modal) {
            modal.classList.remove("ativo");
        }
    }
});


// VOLTAR AO CARDÁPIO
function continuarComprando() {
    fecharCarrinho();

    document.getElementById("cardapio").scrollIntoView({
        behavior: "smooth"
    });
}

// INICIAR CARRINHO
carregarCarrinho();
