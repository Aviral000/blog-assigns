const { userJoi, userJoi2 } = require("../requestValidation/userValidation");

const validSignupBody = (req, res, next) => {
    const { error } = userJoi.body.validate(req.body);

    if(error) {
        res.status(400).json(error.details[0].message);
    }

    next();
}

const validLoginBody = (req, res, next) => {
    const { error } = userJoi2.body.validate(req.body);

    if(error) {
        res.status(400).json(error.details[0].message);
    }

    next();
}

module.exports = { validSignupBody, validLoginBody };