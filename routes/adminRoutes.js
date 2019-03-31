const express = require('express');
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/admin-auth');

const router = express.Router();

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.post('/logout', adminController.postLogout);
router.get('/signup', adminController.getSignup);
router.post('/signup', adminController.postSignup);
router.get('/dashboard', adminAuth, adminController.getDashboard);
//Candidates
router.get('/edit-candidate/:candidateId', adminAuth, adminController.getEditCandidate);
router.post('/edit-candidate/', adminAuth, adminController.postEditCandidate);
router.post('/delete-candidate/', adminAuth, adminController.postDeleteCandidate);
router.get('/add-candidate', adminAuth, adminController.getAddCandidate);
router.post('/add-candidate', adminAuth, adminController.postAddCandidate);

//Elections
router.get('/edit-election/:electionId', adminAuth, adminController.getEditElection);
router.post('/edit-election/', adminAuth, adminController.postEditElection);
router.post('/delete-election/', adminAuth, adminController.postDeleteElection);
router.get('/add-election', adminAuth, adminController.getAddElection);
router.post('/add-election', adminAuth, adminController.postAddElection);
router.get('/election/:electionId', adminAuth, adminController.getElection);


module.exports = router;