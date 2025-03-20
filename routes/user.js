const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const {email, username, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'This email is already registered. Please use a different email or log in.');
            return res.redirect('/signup');
        }

        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Hivbnb!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    // req.flash('success', 'Welcome back!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash('error', 'Something went wrong!');
            // return res.redirect('/listings');
        }
        // req.flash('success', 'Goodbye!');
        res.redirect('/listings');
    })
});

module.exports = router;