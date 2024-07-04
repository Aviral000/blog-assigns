const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

const addUser = async (body) => {
    try {
        const { password } = body;
        const hashedPwd = await hashPassword(password);
        const user = await User.create({ ...body, password: hashedPwd });
        return user;
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            const duplicateValue = error.keyValue[duplicateField];
            throw new Error(`${duplicateField} "${duplicateValue}" already exists.`);
        } else if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(val => val.message);
            throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
        } else {
            throw new Error('Failed to create the new user');
        }
    }
}

const checkUser = async (body) => {
    try {
        const user = await User.findOne({ username: body.username });
        
        if(!user) {
            throw new Error("Failed in retrieving the user data");
        }

        const credentials = bcrypt.compare(body.password, user.password);

        if(!credentials) {
            throw new Error("Incorrect password");
        }

        const payload = { username: user.username };
        const options = { expiresIn: "1h" };
        const token = jwt.sign(payload, process.env.SECRET_KEY, options);

        if(!token) {
            throw new Error("Failed to generate the token");
        }

        return { user, token };

    } catch (error) {
        throw new Error("Failed in retrieving the user data");
    }
}

const findByUsername = async (data) => {
    try {
        const user = await User.findOne({ username: data.username });
        return user;
    } catch (error) {
        throw new Error("Failed in retrieving the user data");
    }
}

module.exports = { addUser, checkUser, findByUsername }