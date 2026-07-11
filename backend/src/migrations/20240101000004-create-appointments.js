const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: { sequelize, queryInterface } }) => {
    
    const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='Appointments'");
    if (tables.length === 0) {
      await queryInterface.createTable('Appointments', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
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
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
    }
  },
  down: async ({ context: { sequelize, queryInterface } }) => {
    await queryInterface.dropTable('Appointments');
  },
};





