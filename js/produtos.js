
// =====================================
// KOOKIS ICE - PRODUTOS DO CARDÁPIO
// Produtos demonstrativos
// =====================================

const produtos = [
    {
        id: 1,
        nome: "Açaí no Copo",
        descricao: "Açaí cremoso e geladinho para refrescar seu dia.",
        preco: 10.00,
        imagem: "assets/produtos/acai-copo.jpg"
    },
    {
        id: 2,
        nome: "Casquinha",
        descricao: "Sorvete cremoso na casquinha crocante.",
        preco: 3.00,
        imagem: "assets/produtos/casquinha.jpg"
    },
    {
        id: 3,
        nome: "Sundae",
        descricao: "Uma combinação deliciosa de sorvete e cobertura.",
        preco: 11.00,
        imagem: "assets/produtos/sundae.jpg"
    },
    {
        id: 4,
        nome: "Milkshake",
        descricao: "Milkshake cremoso e cheio de sabor.",
        preco: 13.00,
        imagem: "assets/produtos/milkshake.jpg"
    }
];

function mostrarProdutos() {
    const listaProdutos = document.getElementById("lista-produtos");

    if (!listaProdutos) {
        return;
    }

    listaProdutos.innerHTML = "";

    produtos.forEach((produto) => {
        const card = document.createElement("div");

        card.classList.add("produto-card");

        card.innerHTML = `
            <div class="produto-imagem">
                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}"
                    loading="lazy"
                >
            </div>

            <div class="produto-informacoes">
                <h3>${produto.nome}</h3>

                <p>${produto.descricao}</p>

                <div class="produto-rodape">
                    <strong>
                        ${produto.preco.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </strong>

                    <span class="produto-disponivel">
                        Disponível
                    </span>
                </div>

                <button
                    class="botao-adicionar"
                    data-id="${produto.id}"
                >
                    Adicionar ao carrinho
                </button>
            </div>
        `;

        listaProdutos.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", mostrarProdutos);
