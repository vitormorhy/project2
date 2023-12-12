import Express from "express";
import bodyParser from "body-parser";
import connection from "./database/database.js";
import formatarVendas from "./public/js/formater.js";

// importando model
import Vendas from "./database/Vendas.js";

connection.authenticate()
    .then(() => {
        console.log("Database has been connected successfully.");
    })
    .catch((error) => {
        console.log("Unable to connect to database:", error);
    })

const app = Express();

// setando view engine para o framework ejs
app.set('view engine', 'ejs');
// setando pasta de arquivos estáticos
app.use(Express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// rotas
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/relatorio', (req, res) => {
    res.render('relatorio')
})

app.get('/vendas', (req, res) => {
    Vendas.findAll({raw: true, order: [['codVendedor', 'DESC']]})
        .then(vendas => {
            let relatorio = formatarVendas(vendas)
            res.json({vendas, relatorio});
        })
})

app.post('/vendas', (req, res) => {
    const codVendedor = req.body.codVendedor;
    const nomeVendedor = req.body.nomeVendedor;
    const cargo = req.body.cargo;
    const valorVenda = req.body.valorVenda;

    Vendas.create({
        codVendedor,
        nomeVendedor,
        cargo,
        valorVenda,
    }).then(() => {
        res.redirect('/relatorio');
    })
});

app.put('/vendas/:id', (req, res) => {
    const codVenda = req.params.id
    const {valorVenda} = req.body

    Vendas.update({ valorVenda }, {
        where: {codVenda}
    }).then(() => {
        res.json({success: true});
    })
    .catch(error => {
        console.error("Erro ao atualizar venda:", error)
        res.status(500).json({success: false, error: "Erro ao atualizar venda."});
    });
})

app.delete('/vendas/:id', (req, res) => {
    const codVenda = req.params.id;

    Vendas.destroy({
        where: {
            codVenda,
        }
    })
    .then(() => {
        res.json({success: true});
    })
    .catch(error => {
        console.error("Erro ao excluir venda:", error)
        res.status(500).json({success: false, error: "Erro ao excluir venda."});
    });
});

app.put('/vendedor/:id', (req, res) => {
    const codVendedor = req.params.id
    const {nomeVendedor, cargo} = req.body

    Vendas.update({ nomeVendedor, cargo }, {
        where: {codVendedor}
    }).then(() => {
        res.json({success: true});
    }).catch(error => {
        console.error("Erro ao atualizar venda:", error)
        res.status(500).json({success: false, error: "Erro ao atualizar vendedor."});
    });
})

app.delete('/vendedor/:id', (req, res) => {
    const codVendedor = req.params.id

    Vendas.destroy({
        where: {
            codVendedor,
        }
    })
    .then(() => {
        res.json({success: true});
    })
    .catch(error => {
        console.error("Erro ao excluir venda:", error)
        res.status(500).json({success: false, error: "Erro ao excluir venda."});
    });
})

// app.delete('/vendas/:id', (req, res) => {
//     const codVendedor = req.params.id;

//     Vendas.destroy({
//         where: {
//             codVendedor,
//         }
//     })
//     .then(() => {
//         res.json({success: true});
//     })
//     .catch(error => {
//         console.error("Erro ao excluir venda:", error)
//         res.status(500).json({success: false, error: "Erro ao excluir venda."});
//     });
// });


app.listen(8880, error => {
    if(error) {
        console.log("Error on running server: " + error);
    } else {
        console.log("Running server...");
    }
})
