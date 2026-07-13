module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    mensagem: { type: DataTypes.STRING, allowNull: false },
    lida: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  return Notification;
};
