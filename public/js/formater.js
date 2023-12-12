const formatarVendas = (vendas) => {
    const vendasFormatadas = vendas
        .sort((a, b) => a.codVendedor - b.codVendedor)
        .reduce((acc, venda) => {
            let maiorVenda = venda.valorVenda
            let totalVendas = venda.valorVenda 
            let comissao = calcularComissao(venda.cargo, totalVendas)

            if(acc.find(vendedor => vendedor.codVendedor === venda.codVendedor)) {
                const ultimaVenda = acc.pop()

                if(maiorVenda < ultimaVenda.maiorVenda) {
                    maiorVenda = ultimaVenda.maiorVenda
                }

                totalVendas += ultimaVenda.totalVendas
                comissao = calcularComissao(venda.cargo, totalVendas)

                acc.push({
                    ...ultimaVenda,
                    maiorVenda,
                    totalVendas,
                    comissao
                })
            } else {
                acc.push({
                    ... venda,
                    maiorVenda,
                    totalVendas,
                    comissao
                })
            }
            
            return acc
        }, [])
        .sort((a, b) => b.totalVendas - a.totalVendas)

        return vendasFormatadas
}

function calcularComissao(cargo, valor) {
    const cargos = ["junior", "pleno", "senior"]
    const percComissao = [0.01, 0.02, 0.03]

    return valor * percComissao[cargos.indexOf(cargo)]
}

export default formatarVendas;