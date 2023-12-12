const $ = (element) => document.querySelector(element)

let sales = []
let report = []

const addModal = $("#addModal")
const addForm = $("#addForm")

const updtModal = $("#updtModal")
const updtBody = $("#updtBody")
let salesList
const closeUpdtModalBtn= $("#closeUpdtModalBtn")

const closeAddModalBtn= $("#closeAddModalBtn")
const addVendaBtn = $("#addVendaBtn")
const valorVenda = $("#valorVenda")

const updateBtns = document.querySelectorAll(".btn-update")

// event listenerrs
addVendaBtn.addEventListener('click', () => {
    addModal.style.display = "flex"
})

closeAddModalBtn.addEventListener('click', () => {
    addModal.style.display = "none"
    addForm.reset()
})

closeUpdtModalBtn.addEventListener('click', () => {
    updtModal.style.display = "none"
})

window.addEventListener('DOMContentLoaded', buscarVendas)

function renderizarTabela(){
    const table = $("#table")
    table.innerHTML = ''
    report.forEach(sale => {
        table.innerHTML += `
            <tr>
                <td class="text-capitalize">${sale.nomeVendedor}</td>
                <td class="text-capitalize">${sale.cargo}</td>
                <td>${sale.totalVendas.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${sale.maiorVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>${sale.comissao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-update" onclick="abrirUpdtModal(${sale.codVendedor})">Editar</button>
                    <button type="button" class="btn btn-danger" onclick="deletarVendedor(${sale.codVendedor})">Deletar</button>
                </td>
            </tr>
        `
    })
}

function buscarVendas() {
    return new Promise((resolve, reject) => {
        fetch('/vendas')
            .then(response => response.json())
            .then(data => {
                sales = data.vendas;
                report = data.relatorio;

                renderizarTabela();
                resolve(); // Resolva a Promise quando a busca estiver concluída
            })
            .catch(error => {
                reject(error); // Rejeite a Promise se houver um erro
            });
    });
}

async function atualizarVendas(idVenda, idVendedor) {
    let venda = {
        valorVenda: $(`#venda${idVenda}`).value
    };
    

    try {
        await fetch(`/vendas/${idVenda}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venda)
        });

        await buscarVendas();
        listarVendas(idVendedor);
    } catch (error) {
        console.error("Erro durante a execução:", error);
    }
}

async function deletarVenda(idVenda, idVendedor, qtdVendas) {
    const msg = qtdVendas === 1 ? "Ao apagar a última venda, o restante dos dados do vendedor serão apagados. Deseja continuar?" : "Apagar venda?"
    const apagar = confirm(msg)

    if(apagar) {
        try {
            await fetch(`/vendas/${idVenda}`, {
                method: 'DELETE',
            });
    
            await buscarVendas();
            if(qtdVendas === 1) {
                updtModal.style.display = 'none'
            }
            listarVendas(idVendedor);
        } catch (error) {
            console.error("Erro durante a execução:", error);
        }
    }
}


async function atualizarVendedor(idVendedor){
    let dados = {
        idVendedor,
        nomeVendedor: $("#updtNome").value,
        cargo: $("#updtCargo").value
    }

    try {
        await fetch(`/vendedor/${idVendedor}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })

        await buscarVendas();
        listarVendas(idVendedor);
    } catch (error) {
        console.error("Erro durante a execução:", error);
    }
}

function deletarVendedor(idVendedor){
    const apagar = confirm("Todos os dados do vendedor serão deletados. Você deseja continuar?")

    if(apagar) {
        fetch(`/vendedor/${idVendedor}`, { method: 'DELETE' })
            .then(response => {
                return response.json();
            })
            .then(dados => {
                if(dados.success) {
                    console.log("Successfull DELETE.");
                    location.reload(true);
                } else {
                    console.log("Error during execution:", dados.error)
                }

                buscarVendas()
            })
    }
}

function abrirUpdtModal(idVendedor){
    updtModal.style.display = 'flex'
    let vendorSales = sales.filter((sale) => sale.codVendedor === idVendedor)
    let name = vendorSales[0].nomeVendedor
    let role = vendorSales[0].cargo

    const dados = {
        name,
        role,
        idVendedor: vendorSales[0].codVendedor
    }

    console.log(vendorSales)
    

    updtBody.innerHTML = ''
    updtBody.innerHTML += `
        <div class="dados-vendedor">
            <div class="header d-flex justify-content-between">
                <h4>Vendedor</h4>
                <button onclick="atualizarVendedor(${vendorSales[0].codVendedor})" type="button" class="btn btn-primary"><i class="bi bi-floppy"></i></button>
            </div>

            <div class="input-group mb-3 mt-3">
                <span class="input-group-text"><i class="bi bi-person-square"></i></span>
                <input type="text" id="updtNome" class="form-control" placeholder="Nome" value="${name}">
            </div>
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-postcard"></i></span>
                <select name="cargo" id="updtCargo" class="form-select">
                    <option ${role === "junior" ? "selected" : ''} value="junior">Junior</option>
                    <option ${role === "pleno" ? "selected" : ''} value="pleno">Pleno</option>
                    <option ${role === "senior" ? "selected" : ''} value="senior">Senior</option>
                </select>
            </div>
        </div>
        <hr>
        <h4>Vendas</h4>
        <div id="vendas"></div>
    `
    salesList = $("#vendas")
    listarVendas(idVendedor)
}

function formatarData(data) {
    let temp = data.split("-")

    return temp[2] + "/" + temp[1] + "/" + temp[0]
}

function listarVendas(idVendedor) {
    let vendorSales = sales.filter((sale) => sale.codVendedor === idVendedor)

    salesList.innerHTML = ""
    vendorSales.forEach(sale => {
        salesList.innerHTML += `
            <div class="venda">
                <i class="bi bi-calendar2-week h4"></i>
                <h6>${formatarData(sale.createdAt.substr(0,10))}</h6>
                    
                <label for="venda${sale.codVenda}">R$ </label>
                <input type="number" class="form-control" id="venda${sale.codVenda}" value="${sale.valorVenda}">
                <button onclick="atualizarVendas(${sale.codVenda}, ${sale.codVendedor})" class="btn btn-primary">Alterar</button>
                <button onclick="deletarVenda(${sale.codVenda}, ${sale.codVendedor}, ${vendorSales.length})" class="btn btn-danger"><i class="bi bi-x h3"></i></button>
            </div>
        `
    })
}