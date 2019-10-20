// PACKAGE IMPORTS
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// FILE IMPORTS
const Product = require('../models/product');

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
router.get('/checkout', (req, res, next) => {
  // Check to see if we have a cart
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  let cart = new Cart(req.session.cart);
  res.render('shop/checkout', { total: cart.totalPrice });
});

module.exports = router;
