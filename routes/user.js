// PACKAGE IMPORTS
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const Order = require('../models/order');
const Cart = require('../models/cart');

// MIDDLEWARE PROTECTION
const csrfProtection = csrf();
router.use(csrfProtection);

// GET - User profile route
router.get('/profile', isLoggedIn, (req, res, next) => {
  Order.find(
    {
      user: req.user
    },
    (err, orders) => {
      if (err) {
        return res.write('Error!');
      }
      let cart;
      orders.forEach(order => {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
      });
      res.render('user/profile', { orders: orders });
    }
  );
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
    failureRedirect: '/user/signup',
    failureFlash: true
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(req.session.oldUrl);
    } else {
      res.redirect('/user/profile');
    }
  }
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
    failureRedirect: '/user/signin',
    failureFlash: true
  }),
  (req, res, next) => {
    if (req.session.oldUrl) {
      let oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
    }
  }
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
