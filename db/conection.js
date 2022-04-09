const Sequelize = require('sequelize');
const sqlite3 = require('sqlite3');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/app.db'
});

module.exports = sequelize;