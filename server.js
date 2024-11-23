const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const {incomingRequestLogger} = require("./middlewares/index.js");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

app.use(incomingRequestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);



app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on localhost:${process.env.PORT}`);
    mongoose.connect(process.env.MONGODB_URI_STRING);
    mongoose.connection.on("error", (err) => {
        console.log(err);
    });
});