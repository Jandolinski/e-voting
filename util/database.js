const Sequelize = require('sequelize');

const sequelize = new Sequelize('e-voting','root','', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;