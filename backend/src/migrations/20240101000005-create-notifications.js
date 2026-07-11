const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: { sequelize, queryInterface } }) => {
    
    const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='Notifications'");
    if (tables.length === 0) {
      await queryInterface.createTable('Notifications', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        mensagem: { type: DataTypes.STRING, allowNull: false },
        lida: { type: DataTypes.BOOLEAN, defaultValue: false },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
    }
  },
  down: async ({ context: { sequelize, queryInterface } }) => {
    await queryInterface.dropTable('Notifications');
  },
};





