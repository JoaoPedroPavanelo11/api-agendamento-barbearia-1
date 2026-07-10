/**
 * Arquivo de configuracao da conexao com o banco de dados.
 * Utiliza Sequelize como ORM e SQLite como banco de dados.
 *
 * @module config/database
 */

const { Sequelize } = require('sequelize');

/**
 * Instancia do Sequelize conectada ao SQLite.
 * O arquivo do banco sera armazenado em ./database.sqlite.
 * Logs de queries SQL estao desabilitados.
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

module.exports = sequelize;
