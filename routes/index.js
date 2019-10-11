// PACKAGE IMPORTS
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

// FILE IMPORTS
const Product = require('../models/product');

// MIDDLEWARE PROTECTION
const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', (req, res, next) => {
  // This will get all the documents from DB and store in products array
  Product.find((err, docs) => {
    let productChunks = [];
    // Need to get three elements at a time for each row and put into new array
    let chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', {
      title: 'Shopping Cart',
      products: productChunks
    });
  });
});

// GET - signup route
router.get('/user/signup', (req, res, next) => {
  let messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

// POST - signup route
router.post(
  '/user/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  })
);

router.get('/user/profile', (req, res, next) => {
  res.render('user/profile');
});

module.exports = router;
