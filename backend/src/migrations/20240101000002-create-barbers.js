const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: { sequelize, queryInterface } }) => {
    
    const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='Barbers'");
    if (tables.length === 0) {
      await queryInterface.createTable('Barbers', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: DataTypes.STRING, allowNull: false },
        foto: { type: DataTypes.STRING },
        dias_trabalho: { type: DataTypes.STRING },
        hora_inicio: { type: DataTypes.STRING, defaultValue: '08:00' },
        hora_fim: { type: DataTypes.STRING, defaultValue: '18:00' },
        ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
    }
  },
  down: async ({ context: { sequelize, queryInterface } }) => {
    await queryInterface.dropTable('Barbers');
  },
};





