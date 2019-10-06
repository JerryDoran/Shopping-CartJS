const Product = require('../models/product');
const mongoose = require('mongoose');

// This seeder file will be ran outside of the normal app just to enter data
mongoose.connect('mongodb://localhost:27017/shopping', {
  useMongoClient: true
});

let products = [
  new Product({
    imagePath: '../images/avengergame.jpg',
    title: 'Avenger PS-4 Game',
    description: 'Epic battle for the universe',
    price: 10.99
  }),
  new Product({
    imagePath: '../images/dug.jpg',
    title: 'Dug',
    description:
      'Follow the irresponsible and sometimes forgetful dog on wreckless adventures',
    price: 14.99
  }),
  new Product({
    imagePath: '../images/justice-league.jpg',
    title: 'DC Universe Justice League',
    description: 'Face off with the Legion of Doom',
    price: 15.99
  }),
  new Product({
    imagePath: '../images/mario.jpg',
    title: 'Mario Kart',
    description: 'Follow Mario and friends around the globe',
    price: 14.99
  }),
  new Product({
    imagePath: '../images/princess.jpg',
    title: 'Disney Princesses',
    description:
      'Enter an enchanted world with beautiful princesses and hidden dangers',
    price: 15.99
  }),
  new Product({
    imagePath: '../images/spiderman.jpg',
    title: 'Spiderman 4',
    description: 'Battle for the existence of New York',
    price: 12.99
  })
];

let done = 0;
products.forEach(product => {
  product.save((err, result) => {
    done++;
    if (done === products.length) {
      exit();
    }
  });
});

function exit() {
  mongoose.disconnect();
}
