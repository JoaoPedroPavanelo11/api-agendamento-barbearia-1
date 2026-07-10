/**
 * Modelo que representa a tabela de usuarios do sistema.
 * Cada usuario pode ser um cliente ou administrador.
 *
 * @module models/User
 * @param {Object} sequelize - Instancia do Sequelize
 * @param {Object} DataTypes - Tipos de dados do Sequelize
 * @returns {Model} Modelo User
 *
 * @property {number} id - Chave primaria, auto-incremento
 * @property {string} nome - Nome completo do usuario (obrigatorio)
 * @property {string} email - Email unico para login (obrigatorio)
 * @property {string} senha - Hash da senha (obrigatorio)
 * @property {string} telefone - Telefone de contato (opcional)
 * @property {string} role - Nivel de acesso: 'admin' ou 'cliente' (padrao: 'cliente')
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('admin', 'cliente'), defaultValue: 'cliente' },
  });

  return User;
};
