const ExtractJwt = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;
require("dotenv").config();

const { findByUsername } = require("../services/user.service");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

const JwtStrategy = new JWTStrategy(options, async (payload, done) => {
    try {
        const user = await findByUsername(payload);
        return done(null, user);
    } catch (error) {
        return done(error, false)
    }
})

module.exports = (passport) => {
    passport.use(JwtStrategy)
}