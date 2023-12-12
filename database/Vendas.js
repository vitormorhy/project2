import { DataTypes, Sequelize } from "sequelize";
import connection from "./database.js";

const Vendas = connection.define('vendas', {
    codVendedor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nomeVendedor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cargo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    codVenda: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    valorVenda: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    }
});

Vendas.sync({force: false}).then();

export default Vendas;