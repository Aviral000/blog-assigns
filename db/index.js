const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
require("dotenv").config();

const passport = require("passport");
const jwtPassport = require("./config/passport");

const userRoute = require("./routes/user.route");
const blogRoute = require("./routes/blog.route");

jwtPassport(passport);

const app = express();

app.use(cors());

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
}

mongoose.connect(process.env.MONGO_URL, options)
    .then(() => console.log("db connected"))
    .catch(err => console.log(err))

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(helmet());

app.use("/users", userRoute);
app.use("/blogs", blogRoute);

app.listen(process.env.PORT_NUMBER, () => {
    console.log("server running")
})