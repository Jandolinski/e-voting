const Sequelize = require('sequelize');

const sequelize = new Sequelize('wrekol_e-voting','wrekol_e-voting','e-votingProj2019', {
    dialect: 'mysql',
    host: 'sql.wrekol.nazwa.pl'
});

module.exports = sequelize;