const express = require('express');
const userController = require('../controllers/userController');
const userAuth = require('../middleware/user-auth');

const router = express.Router();

//Login
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.post('/logout', userController.postLogout);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

router.get('/dashboard', userAuth, userController.getDashboard);
router.get('/election/:electionId', userAuth, userController.getElection);
router.post('/vote/', userAuth, userController.postVoteCandidate);


module.exports = router;