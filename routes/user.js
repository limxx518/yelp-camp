const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const user = require('../controllers/user');
const { storeReturnTo } = require('../middleware');

router.get('/register', user.getRegisterForm);

router.post('/register', catchAsync(user.registerUser));

router.get('/login', (req, res) => {
    res.render('user/login');
});

router.post('/login',  storeReturnTo, passport.authenticate('local',
    {failureFlash: true, failureRedirect: '/login'}), user.login);

router.get('/logout', user.logout);

module.exports = router;
