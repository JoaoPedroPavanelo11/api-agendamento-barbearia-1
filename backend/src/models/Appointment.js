/**
 * Modelo que representa a tabela de agendamentos (appointments).
 * Cada agendamento associa um cliente, um barbeiro e um servico a uma data/hora.
 *
 * @module models/Appointment
 * @param {Object} sequelize - Instancia do Sequelize
 * @param {Object} DataTypes - Tipos de dados do Sequelize
 * @returns {Model} Modelo Appointment
 *
 * @property {number} id - Chave primaria, auto-incremento
 * @property {string} data - Data do agendamento no formato YYYY-MM-DD (obrigatorio)
 * @property {string} hora - Horario do agendamento no formato HH:mm (obrigatorio)
 * @property {string} status - Status: 'pendente', 'confirmado', 'cancelado' ou 'concluido' (padrao: 'pendente')
 * @property {string} observacao - Observacao opcional do cliente (opcional)
 * @property {number} clienteId - Chave estrangeira para o usuario cliente (obrigatorio)
 * @property {number} barbeiroId - Chave estrangeira para o barbeiro (obrigatorio)
 * @property {number} servicoId - Chave estrangeira para o servico (obrigatorio)
 */
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    data: { type: DataTypes.DATEONLY, allowNull: false },
    hora: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado', 'concluido'),
      defaultValue: 'pendente',
    },
    observacao: { type: DataTypes.STRING },
    clienteId: { type: DataTypes.INTEGER, allowNull: false },
    barbeiroId: { type: DataTypes.INTEGER, allowNull: false },
    servicoId: { type: DataTypes.INTEGER, allowNull: false },
  });

  return Appointment;
};
