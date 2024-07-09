const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
require("dotenv").config();
const fs = require('fs');
const aws = require('aws-sdk');
const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

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
};

const uploadDir = path.join(__dirname, 'uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

mongoose.connect(process.env.MONGO_URL, options)
    .then(() => console.log("db connected"))
    .catch(err => console.log(err));

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(helmet());

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

app.post("/uploads", upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileContent = fs.readFileSync(req.file.path);

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: req.file.originalname,
        Body: fileContent,
        ContentType: req.file.mimetype
    };

    s3.upload(params, function(err, data) {
        if (err) {
            return res.status(500).send(err);
        }

        fs.unlinkSync(req.file.path);

        res.json({
            message: 'File uploaded successfully',
            data: data
        });
    });
});

app.use("/users", userRoute);
app.use("/blogs", blogRoute);

app.listen(process.env.PORT_NUMBER, () => {
    console.log("server running on port " + process.env.PORT_NUMBER);
});
