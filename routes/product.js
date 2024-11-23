const express = require("express");
const { Product } = require("../schema/product.schema");
const router = express.Router();

// Add Products
router.post("/add", async (req, res)=> {
    const {category, image, title, price, description} = req.body;
    const ifProductExists = await Product.findOne({title});

    if(ifProductExists){
        return res.status(400).json({message: "Product already Exists"});
    }
    const product = new Product({category, image, title, price, description});
    await product.save();
    res.status(201).json({message: "Product Created Successfully"});
})

// get all products
router.get("/", async (req, res)=> {
    const products = await Product.find({});
    res.status(200).json({products});
})

// get by category
router.get("/:category", async (req, res)=> {
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found in the given category" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
})


module.exports = router;