const Candidate = require('../models/candidate');
const Election = require('../models/election');
const User = require('../models/user');
const Vote = require('../models/vote');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('user/login', {
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const pesel = req.body.pesel;
  const password = req.body.password;
  User.findOne({ where: { pesel: pesel } })
    .then(user => {
      if (!user) {
        req.flash('error', 'Nieprawidłowy PESEL lub hasło');
        return res.redirect('/user/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isUserLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              res.redirect('/user/dashboard');
            });
          }
          req.flash('error', 'Nieprawidłowy PESEL lub hasło');
          res.redirect('/user/login');
        })
        .catch(err => {
          res.redirect('/user/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('user/signup', {
    errorMessage: message,
    pageTitle: 'User Signup'
  });
};

exports.postSignup = (req, res, next) => {
  const pesel = req.body.pesel;
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password != confirmPassword) {
    req.flash('error', 'hasła nie zgadzają się');
    return res.redirect('/user/signup');
  }
  User.findOne({ where: { pesel: pesel } })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Użytkownik o takim nr PESEL już istnieje');
        return res.redirect('/user/signup');
      }
      return bcrypt.hash(password, 12).then(hashedPassword => {
        User.create({
          email: email,
          pesel: pesel,
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword
        }).then(result => {
          res.redirect('/user/dashboard');
        });
      });
    })
    .catch(err => console.log(err));
};

exports.getDashboard = (req, res, next) => {
  const user = req.user;
  Election.findAll()
    .then(elections => {
      res.render('user/dashboard', {
        pageTitle: 'User Dashboard',
        elections: elections,
        user: user
      });
    })
    .catch(err => console.log(err));
};

exports.getElection = (req, res, next) => {
  const electionId = req.params.electionId;
  Election.findByPk(electionId)
    .then(election => {
      Candidate.findAll({ where: { electionId: election.id } })
        .then(candidates => {
          let canVote = true;
          Vote.findAll({
            where: { electionId: electionId, userId: req.session.user.id }
          }).then(votes => {
            if (votes.length > 0) {
              canVote = false;
            }
            res.render('user/election-details', {
              election: election,
              candidates: candidates,
              canVote: canVote,
              pageTitle: 'Election Detail'
            });
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postVoteCandidate = (req, res, next) => {
  const id = req.body.candidateId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const electionId = req.body.id_election;
  const votes = parseInt(req.body.votes);
  Vote.findAll({ where: { electionId: electionId, userId: req.user.id } })
    .then(voting => {
      if (voting.length > 0) {
        return res.redirect('/user/dashboard');
      } else {
        Vote.create({
          electionId: electionId,
          userId: req.user.id
        })
          .then(result => {
            return Candidate.findByPk(id);
          })
          .then(candidate => {
            candidate.firstName = firstName;
            candidate.lastName = lastName;
            candidate.electionId = electionId;
            candidate.votes = votes + 1;
            return candidate.save();
          })
          .then(result => {
            res.redirect('/user/dashboard');
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
};
