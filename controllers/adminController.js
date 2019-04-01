const Candidate = require('../models/candidate');
const Election = require('../models/election');
const Admin = require('../models/admin');

const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/login', {
        pageTitle: 'Login Admin',
        errorMessage: message
    });
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({where: {email: email}})
    .then(admin => {
        if(!admin) {
            req.flash('error', 'Nieprawidłowy e-mail lub hasło');
            return res.redirect('/admin/login');
        }
        bcrypt.compare(password, admin.password)
        .then(doMatch => {
            if(doMatch) {
                req.session.isAdminLoggedIn = true;
                req.session.admin = admin;
                return req.session.save(err => {
                    res.redirect('/admin/dashboard');
                })
            }
            req.flash('error', 'Nieprawidłowy e-mail lub hasło');
            res.redirect('/admin/login');
        })
        .catch(err => {
            res.redirect('/admin/login');
        })
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req,res,next) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
}

exports.getSignup = (req,res,next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/signup', {
        errorMessage: message,
        pageTitle: 'Signup Admin',
    });
}
exports.postSignup = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(password != confirmPassword) {
        req.flash('error', 'hasła nie zgadzają się');
        return res.redirect('/admin/signup');
    }
    Admin.findOne({where: {email: email}})
    .then(adminDoc => {
        if(adminDoc) {
            req.flash('error', 'Administrator o takim E-mailu już istnieje');
            return res.redirect('/admin/signup');
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            Admin.create({
                email: email,
                password: hashedPassword
            })
            .then(result => {
                res.redirect('/admin/dashboard')
            })
        })
    })
    .catch(err => console.log(err));
}

exports.getDashboard = (req,res,next) => {
    Candidate.findAll()
    .then(candidates => {
        Election.findAll()
        .then(elections => {
            res.render('admin/dashboard', {
                pageTitle: 'Admin Dashboard',
                candidates: candidates,
                elections: elections,
             });
        })
        .catch(err => console.log(err));

    })
    .catch(err => console.log(err));
}

//CANDIDATES
exports.getEditCandidate = (req,res,next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/admin/dashboard');
    }
    const candidateId = req.params.candidateId;
    Candidate.findByPk(candidateId)
    .then(candidate => {
        return Election.findAll()
        .then(elections => {
            if(!candidate) {
                return res.redirect('/');
              }
            res.render('admin/edit-candidate', {
                pageTitle: 'Edit Candidate',
                editing: editMode,
                candidate: candidate,
                elections: elections
            });
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
}
exports.postEditCandidate = (req,res,next) => {
        const id = req.body.candidateId;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const electionId = req.body.id_election;
        const votes = parseInt(req.body.votes);
        Candidate.findByPk(id)
        .then(candidate => {
            candidate.firstName = firstName;
            candidate.lastName = lastName;
            candidate.electionId = electionId;
            candidate.votes = votes;
            return candidate.save();
        })
        .then(result => {
            res.redirect('/admin/dashboard');
        })
        .catch(err => console.log(err));
}
exports.postDeleteCandidate = (req,res,next) => {
    const candidateId = req.body.candidateId;
    Candidate.findByPk(candidateId)
    .then(candidate => {
        return candidate.destroy();
    })
    .then(result => {
        res.redirect('/admin/dashboard');
    })
    .catch(err => console.log(err));
}
exports.getAddCandidate = (req,res,next) => {
    Election.findAll()
    .then(elections => {
        res.render('admin/edit-candidate', {
            pageTitle: 'Add Candidate',
            editing: false,
            elections: elections
        });
    })
    .catch(err => console.log(err));
}
exports.postAddCandidate = (req,res,next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const electionId = req.body.id_election;
    Candidate.create({
        firstName: firstName,
        lastName: lastName,
        electionId: electionId,
        adminId: req.session.admin.id
    })
    .then(result => {
        res.redirect('/admin/dashboard');
    })
    .catch(err => console.log(err));
}

//ELECTIONS
exports.getEditElection = (req,res,next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const electionId = req.params.electionId;
    Election.findByPk(electionId)
    .then(election => {
        if(!election) {
          return res.redirect('/');
        }
        res.render('admin/edit-election', {
          pageTitle: 'Edit Election',
          editing: editMode,
          election: election
        });
    })
    .catch(err => console.log(err));
}
exports.postEditElection = (req,res,next) => {
        const id = req.body.electionId;
        const type = req.body.type;
        const start_date = req.body.start_date;
        const end_date = req.body.end_date;
        Election.findByPk(id)
        .then(election => {
            election.type = type;
            election.start_date = start_date;
            election.end_date = end_date;
            return election.save();
        })
        .then(result => {
            res.redirect('/admin/dashboard');
        })
        .catch(err => console.log(err));
}
exports.postDeleteElection = (req,res,next) => {
    const electionId = req.body.electionId;
    Election.findByPk(electionId)
    .then(election => {
        return election.destroy();
    })
    .then(result => {
        res.redirect('/admin/dashboard');
    })
    .catch(err => console.log(err));
}
exports.getAddElection = (req,res,next) => {
    res.render('admin/edit-election', {
        pageTitle: 'Add Election',
        editing: false
    });
}
exports.postAddElection = (req,res,next) => {
    const type = req.body.type;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    Election.create({
        type: type,
        start_date: start_date,
        end_date: end_date
    })
    .then(result => {
        res.redirect('/admin/dashboard');
    })
    .catch(err => console.log(err));
}

exports.getElection = (req,res,next) => {
    const electionId = req.params.electionId
    Election.findByPk(electionId)
    .then(election => {
        Candidate.findAll({where: {electionId: election.id}})
        .then(candidates => {
            res.render('admin/election-details', {
                election: election,
                candidates: candidates,
                pageTitle: 'Election Detail',
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}