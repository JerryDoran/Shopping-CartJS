// PACKAGE IMPORTS
const express = require('express');
const router = express.Router();

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

module.exports = router;
