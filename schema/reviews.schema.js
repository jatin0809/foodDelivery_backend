const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: String, required: true },
    info: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  })

  const Review = mongoose.model("Review", reviewSchema);
  module.exports = {
    Review
  }