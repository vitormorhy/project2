import { Sequelize } from "sequelize";

const connection = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite3',
    logging: false,
});

export default connection;