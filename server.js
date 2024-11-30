const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
dotenv.config();

const {incomingRequestLogger} = require("./middlewares/index.js");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const imageRouter = require("./routes/image");
const reviewRouter = require("./routes/reviews.js");
const cartRouter = require("./routes/cart.js")

const app = express();
app.use(cors());
app.use(incomingRequestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/cart", cartRouter);



app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on localhost:${process.env.PORT}`);
    mongoose.connect(process.env.MONGODB_URI_STRING);
    mongoose.connection.on("error", (err) => {
        console.log(err);
    });
});