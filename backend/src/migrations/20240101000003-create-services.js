const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: { sequelize, queryInterface } }) => {
    
    const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name='Services'");
    if (tables.length === 0) {
      await queryInterface.createTable('Services', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: DataTypes.STRING, allowNull: false },
        descricao: { type: DataTypes.STRING },
        preco: { type: DataTypes.FLOAT, allowNull: false },
        duracao: { type: DataTypes.INTEGER, allowNull: false },
        ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false },
      });
    }
  },
  down: async ({ context: { sequelize, queryInterface } }) => {
    await queryInterface.dropTable('Services');
  },
};





