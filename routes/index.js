// PACKAGE IMPORTS
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Order = require('../models/order');

// FILE IMPORTS
const Product = require('../models/product');

/* GET home page. */
router.get('/', (req, res, next) => {
  let successMsg = req.flash('success')[0];
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
      products: productChunks,
      successMsg: successMsg,
      noMessages: !successMsg
    });
  });
});

router.get('/add-to-cart/:id', (req, res, next) => {
  let productId = req.params.id;

  let cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(cart);
    res.redirect('/');
  });
});

router.get('/delete/:id', (req, res, next) => {
  let productId = req.params.id;

  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.deleteOneItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/deleteAll/:id', (req, res, next) => {
  let productId = req.params.id;

  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.deleteAllItems(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

// GET Route to view the shopping cart page
router.get('/shopping-cart', (req, res, next) => {
  // Check to see if we have a cart
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null });
  }
  let cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {
    products: cart.generateArray(),
    totalPrice: cart.totalPrice
  });
});

// GET Route to checkout
router.get('/checkout', isLoggedIn, (req, res, next) => {
  // Check to see if we have a cart
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  let cart = new Cart(req.session.cart);
  let errMsg = req.flash('error')[0];
  res.render('shop/checkout', {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  });
});

router.post('/checkout', isLoggedIn, (req, res, next) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }

  let cart = new Cart(req.session.cart);
  let stripe = require('stripe')('sk_test_uV2MjYrzc5XIcLYW26ylg8Nt00gJ8abP46');

  stripe.charges.create(
    {
      // amount is in cents so we multiply by 100 to get dollars
      amount: cart.totalPrice * 100,
      currency: 'usd',
      // source: 'tok_mastercard',
      source: req.body.stripeToken,
      description: 'Test Charge'
    },
    function(err, charge) {
      // Check for errors - asynchronously called
      if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }

      // Create a new order and save to the database
      let order = new Order({
        // Can always access this user object because passport makes the 'user' object available
        // on the req object after you sign into the application.
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
      });

      // Save to database
      order.save((err, result) => {
        if (err) {
          console.log(err);
        }
        req.flash('success', 'Succesfully bought product');
        req.session.cart = null;
        res.redirect('/');
      });
    }
  );
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // Just means continue
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}

module.exports = router;
