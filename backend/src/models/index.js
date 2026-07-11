/**
 * Arquivo centralizador dos modelos do Sequelize.
 * Importa e inicializa todos os modelos e define os relacionamentos entre eles.
 *
 * @module models/index
 */

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User')(sequelize, Sequelize);
const Barber = require('./Barber')(sequelize, Sequelize);
const Service = require('./Service')(sequelize, Sequelize);
const Appointment = require('./Appointment')(sequelize, Sequelize);
const Notification = require('./Notification')(sequelize, Sequelize);

/* Relacionamentos */
User.hasMany(Appointment, { foreignKey: 'clienteId' });
Appointment.belongsTo(User, { foreignKey: 'clienteId', as: 'cliente' });

Barber.hasMany(Appointment, { foreignKey: 'barbeiroId' });
Appointment.belongsTo(Barber, { foreignKey: 'barbeiroId', as: 'barbeiro' });

Service.hasMany(Appointment, { foreignKey: 'servicoId' });
Appointment.belongsTo(Service, { foreignKey: 'servicoId', as: 'servico' });

module.exports = { sequelize, User, Barber, Service, Appointment, Notification };
