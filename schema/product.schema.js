const mongoose = require("mongoose");
const schema = mongoose.Schema;

const productSchema = new schema({
    category: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
})

const Product = mongoose.model("Product", productSchema );

module.exports = {
    Product
}