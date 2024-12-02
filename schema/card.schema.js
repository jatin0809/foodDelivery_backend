const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  cards: [
    {
      number: { type: String, required: true },
      expiration: { type: String, required: true },
      cvc: { type: String, required: true },
      name: { type: String, required: true },
      isDefault: { type: Boolean, default: false }, // Default card flag
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Card = mongoose.model("Card", cardSchema);

module.exports = {
  Card
};
