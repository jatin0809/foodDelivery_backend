const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cartSchema = new schema({
    userId: {  type: mongoose.Schema.Types.ObjectId,  required: true,  ref: "User" },
    items: [
      {
        productId: {  type: mongoose.Schema.Types.ObjectId,  required: true,  ref: "Product" },
        productName: { type: String, required: true },
        productImage: { type: String, required: true },
        quantity: {  type: Number,  required: true,  min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: {  type: Number,  required: true,  default: 0 },
    createdAt: {  type: Date,  default: Date.now },
    updatedAt: {  type: Date,  default: Date.now },
  });
  
const Cart = mongoose.model("Cart", cartSchema);
module.exports = {
  Cart
}