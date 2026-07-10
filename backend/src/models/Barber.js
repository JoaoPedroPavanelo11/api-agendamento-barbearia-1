/**
 * Modelo que representa a tabela de barbeiros da barbearia.
 *
 * @module models/Barber
 * @param {Object} sequelize - Instancia do Sequelize
 * @param {Object} DataTypes - Tipos de dados do Sequelize
 * @returns {Model} Modelo Barber
 *
 * @property {number} id - Chave primaria, auto-incremento
 * @property {string} nome - Nome do barbeiro (obrigatorio)
 * @property {string} foto - URL ou caminho da foto do barbeiro (opcional)
 * @property {string} dias_trabalho - Dias da semana trabalhados, separados por virgula (ex: 1,2,3,4,5,6)
 * @property {string} hora_inicio - Horario de inicio do expediente (padrao: 08:00)
 * @property {string} hora_fim - Horario de termino do expediente (padrao: 18:00)
 * @property {boolean} ativo - Indica se o barbeiro esta ativo (padrao: true)
 */
module.exports = (sequelize, DataTypes) => {
  const Barber = sequelize.define('Barber', {
    nome: { type: DataTypes.STRING, allowNull: false },
    foto: { type: DataTypes.STRING },
    dias_trabalho: {
      type: DataTypes.STRING,
      comment: 'Dias da semana separados por virgula: 1,2,3,4,5,6',
    },
    hora_inicio: { type: DataTypes.STRING, defaultValue: '08:00' },
    hora_fim: { type: DataTypes.STRING, defaultValue: '18:00' },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  return Barber;
};
