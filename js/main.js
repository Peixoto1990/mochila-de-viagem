const form = document.getElementById('novoItem');
const lista = document.getElementById('lista');
const itens = JSON.parse(localStorage.getItem('itens')) || [];



itens.forEach((elemento) => {
    criaElemento(elemento);
})

const inputNome = document.querySelector("#nome");
const inputQuantidade = document.querySelector("#quantidade");
const botaoEnviar = document.querySelector("[data-cadastrar]");

inputNome.addEventListener("keyup", (event) => {
    if (event.target.value.length < 3) {
        inputQuantidade.setAttribute("disabled", "");
        botaoEnviar.setAttribute("disabled", "");
        inputQuantidade.value = ""
    } else {
        inputQuantidade.removeAttribute("disabled");
    }
})

inputQuantidade.addEventListener("keyup", (event) => {
    if (event.target.value.length == 0) {
        botaoEnviar.setAttribute("disabled", "");
    } else {
        botaoEnviar.removeAttribute("disabled");
    }
})

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = event.target.elements['nome'];
    const quantidade = event.target.elements['quantidade'];

    const itemAtual = {
        nome: nome.value,
        quantidade: quantidade.value
    }

    itemAtual.nome = itemAtual.nome.replace(/\s{2,}/g," ");
    itemAtual.nome = itemAtual.nome.replace(/\s+\B/g, "");

    const existe = itens.find(elemento => elemento.nome.toUpperCase() === itemAtual.nome.toUpperCase());

    if (existe) {
        itemAtual.id = existe.id;
        atualizaElemento(itemAtual);
        itens[itens.findIndex(elemento => elemento.id === itemAtual.id)] = itemAtual;
    } else {
        itemAtual.id = itens[itens.length-1] ? itens[itens.length-1].id + 1 : 0;
        criaElemento(itemAtual);
        itens.push(itemAtual);
    }

    ordenaLista();
    atualizaOrdem();

    localStorage.setItem("itens", JSON.stringify(itens));

    nome.value = "";
    quantidade.value = "";

    inputQuantidade.setAttribute("disabled", "");
    botaoEnviar.setAttribute("disabled", "");
})

function criaElemento(item) {
    const novoItem = document.createElement('li');
    novoItem.classList.add('item');

    const numeroItem = document.createElement('strong');
    numeroItem.dataset.id = item.id;
    numeroItem.innerHTML = item.quantidade;

    novoItem.appendChild(numeroItem);
    novoItem.innerHTML += item.nome.toUpperCase();

    novoItem.appendChild(botaoDeleta(item.id));

    lista.appendChild(novoItem);
}

function atualizaElemento(item) {
    document.querySelector(`[data-id="${item.id}"]`).innerHTML = item.quantidade;
}

function botaoDeleta(id) {
    const elementoBotao = document.createElement("button");
    elementoBotao.classList.add("botaoExcluiItem");
    elementoBotao.innerText = "x";

    elementoBotao.addEventListener("click", function(event) {
        deletaElemento(this.parentNode, id);
    })

    return elementoBotao;
}

function deletaElemento(tag, id) {
    
    itens.splice(itens.findIndex(elemento => elemento.id === id), 1);

    localStorage.setItem("itens", JSON.stringify(itens));

    tag.remove();
}


function atualizaOrdem() {
    lista.innerHTML = "";

    itens.forEach((elemento) => {
        criaElemento(elemento);
    })
}

function ordenaLista() {
    var aux;
    var char1;
    var char2;

    for (var cont1 = 0; cont1 < itens.length; cont1++) {
        for (var cont2 = cont1+1; cont2 < itens.length; cont2++) {
            char1 = itens[cont1].nome.toUpperCase().charCodeAt(0);
            char2 = itens[cont2].nome.toUpperCase().charCodeAt(0);

            if (char1 > char2) {
                aux = itens[cont1];
                itens[cont1] = itens[cont2];
                itens[cont2] = aux;
            }
        }
        itens[cont1].id = cont1;
    }
}