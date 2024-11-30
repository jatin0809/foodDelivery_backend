const express = require("express");
const router = express.Router();
const {Review} = require("../schema/reviews.schema");

 
router.post("/add", async (req, res)=>{
    const {name, city, image, info} = req.body;

    const review = new Review({name, image, city, info});
    await review.save();
    res.status(201).json({message: "Review Created Successfully"});
})

router.get("/", async (req, res)=>{
    const reviews = await Review.find({});
    res.status(200).json({reviews})
})


module.exports = router;