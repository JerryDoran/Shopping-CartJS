const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    // let mongoose know we have a reference to the User model.  The id behind the scenes is
    // refering to the Users collection in the User model.
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cart: {
    type: Object,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema);
