const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: { sequelize, queryInterface } }) => {
    
    const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'");
    if (tables.length === 0) {
      await queryInterface.createTable('Users', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        senha: { type: DataTypes.STRING, allowNull: false },
        telefone: { type: DataTypes.STRING },
        role: { type: DataTypes.ENUM('admin', 'cliente'), defaultValue: 'cliente' },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
    }
  },
  down: async ({ context: { sequelize, queryInterface } }) => {
    await queryInterface.dropTable('Users');
  },
};





