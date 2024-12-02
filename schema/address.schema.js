const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  userName: { type: String, required: true },
  addresses: [
    {
      state: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      street: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = {
  Address
};
