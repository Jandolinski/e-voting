// const db = require('../util/database');

// module.exports = class Candidate {
//     constructor(id,firstName,lastName,id_election,votes) {
//         this.id = id;
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.id_election = id_election;
//         this.votes = votes;
//     }
//     save() {
//          return db.execute('INSERT INTO candidates (firstName,lastName,id_election,votes) VALUES (?, ?, ?, ?)',
//         [this.firstName,this.lastName,this.id_election,this.votes]);
//     }
//     static deleteById(id) {
        
//     }
//     static findById(id) {
//         return db.execute('SELECT * FROM candidates WHERE candidates.id = ?', [id]);
//     }
//     static findByElectionId(id, cb) {
//         getCandidatesFromFile(candidates => {
//             const updatedCandidates = candidates.filter(cand => cand.id_election === id);
//             cb(updatedCandidates);
//         });
//     }
//     static fetchAll() {
//         return db.execute('SELECT * FROM candidates');
//     }
// }

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Candidate = sequelize.define('candidate', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    votes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    }

});

module.exports = Candidate;