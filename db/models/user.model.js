const mongoose = require("mongoose");
const validator = require("validator");

const fullname = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String
    },
    lastname: {
        type: String,
        required: true
    }
}, {
    _id: false
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "This username is already taken"],
        minLength: [6, "username must be of length 6 or more"]
    },
    fullName: {
        type: fullname,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: true,
        minLength: [6, "password must be of length 6 or more"]
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 10,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;