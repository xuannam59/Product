const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // user_id: String,
  cart_id: String,
  userInfor: {
    fullName: String,
    address: String,
    phone: Number
  },
  products: [
    {
      product_id: String,
      quantity: Number,
      price: Number,
      discountPercentage: Number,
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  },
  deleteAt: Date
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;