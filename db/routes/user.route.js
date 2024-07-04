const router = require("express").Router();

//controller
const { signup, login, getUser } = require("../controllers/user.controller");

const { validSignupBody, validLoginBody } = require("../middlewares/validators/validUserBody");

router.post("/signup", validSignupBody, signup);
router.post("/login", validLoginBody, login);
router.get("/", getUser );

module.exports = router;