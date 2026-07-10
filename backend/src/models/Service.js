/**
 * Modelo que representa a tabela de servicos oferecidos pela barbearia.
 *
 * @module models/Service
 * @param {Object} sequelize - Instancia do Sequelize
 * @param {Object} DataTypes - Tipos de dados do Sequelize
 * @returns {Model} Modelo Service
 *
 * @property {number} id - Chave primaria, auto-incremento
 * @property {string} nome - Nome do servico (obrigatorio)
 * @property {string} descricao - Descricao detalhada do servico (opcional)
 * @property {number} preco - Valor do servico em reais (obrigatorio)
 * @property {number} duracao - Duracao estimada em minutos (obrigatorio)
 * @property {boolean} ativo - Indica se o servico esta disponivel (padrao: true)
 */
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING },
    preco: { type: DataTypes.FLOAT, allowNull: false },
    duracao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duracao em minutos',
    },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  return Service;
};
