const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'essdetailing_e-voting-sql',
  'essdetailing_e-voting-sql',
  'E-voting2019',
  {
    dialect: 'mysql',
    host: 'sql.essdetailing.nazwa.pl'
  }
);

module.exports = sequelize;
