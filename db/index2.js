const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const { default: helmet } = require("helmet");
const cors = require("cors");
require("dotenv").config();
const fs = require('fs');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const multer = require("multer");
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const passport = require("passport");
const jwtPassport = require("./config/passport");

jwtPassport(passport);

const app = express();

app.use(cors());

const accessKey = process.env.AWS_ACCESS_KEY_ID;
const privateKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET_NAME;
const regionI = process.env.AWS_REGION;

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

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: privateKey,
    },
    region: regionI
})

mongoose.connect(process.env.MONGO_URL, options)
    .then(() => console.log("db connected"))
    .catch(err => console.log(err));

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(helmet());

app.post("/uploads", upload.single('file'), async (req, res) => {

    req.file.buffer

    const params= {
        bucket: bucketName,
        Key: req.body.file.originalname,
        body: req.file.buffer,
        ContentType: req.file.mimetype
    }

    const command = new PutObjectCommand(params);

    await s3.send(command);

    res.json();
});

app.listen(process.env.PORT_NUMBER, () => {
    console.log("server running on port " + process.env.PORT_NUMBER);
});
