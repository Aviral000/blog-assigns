const { addUser, checkUser, findByUsername } = require("../services/user.service")

const signup = async (req, res) => {
    try {
        const user = await addUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const login = async (req, res) => {
    try {
        const user = await checkUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json(error);
    }
}

const getUser = async (req, res) => {
    try {
        const user = await findByUsername(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = { signup, login, getUser }