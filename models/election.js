const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Election = sequelize.define('election', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    start_date: {
        type: Sequelize.STRING,
        allowNull: false
    },
    end_date: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Election;