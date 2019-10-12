// PACKAGE IMPORTS
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

// MIDDLEWARE PROTECTION
const csrfProtection = csrf();
router.use(csrfProtection);

// GET - User profile route
router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('user/profile');
});

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, (req, res, next) => {
  next();
});

// GET - User signup route
router.get('/signup', (req, res, next) => {
  let messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

// POST - User signup route
router.post(
  '/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  })
);

// GET - User sign in route
router.get('/signin', (req, res, next) => {
  let messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

// POST - User sign in route
router.post(
  '/signin',
  passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  })
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // Just means continue
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
