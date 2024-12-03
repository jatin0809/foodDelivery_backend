const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    number: { type: String, required: true },
    country: { type: String, required: false, default:null },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  })

  const User = mongoose.model("User", userSchema);
  module.exports = {
    User
  }