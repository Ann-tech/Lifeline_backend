const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/users.model');


const { findUserByUsername, findUserById, findUserByEmail, createNewUser } = require('../database/queries/users');

require('dotenv').config();

passport.use(
    'jwt',
    new JWTStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },

        async(token, done) => {
            try {
                const id = token.user._id;
                const user = await findUserById(id);

                if (!user) return done(null, false);

                return done(null, token.user)
            } catch(err) {
                done(err)
            }
        }
    )
)

passport.use(
    'login',
    new LocalStrategy(
        {
            "usernameField": "username",
            "passwordField": "password"
        },

        async function(username, password, done) {
            try {
                const user = await findUserByUsername(username);
                if (!user) return done(null, false, {message: "incorrect username or password"});

                const validate = await user.isValidPassword(password)
                
                if (!validate) return done(null, false, {message: "incorrect password"})

                return done(null, user, {message: "Login successful"})
            } catch(err) {
                return done(err)
            }
        }
    )
);


passport.use(
    new GoogleStrategy(
        {
            clientID:     process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://lifeline-1zrj.onrender.com/api/v1/auth/google/callback",
            passReqToCallback   : true
        },
        async function(request, accessToken, refreshToken, profile, done) {
            try {
                const userData = {googleId: profile.id, email: profile.email};
                
                let user = await findUserByEmail(userData.email);

                if (!user) {
                    user = await createNewUser(userData); 
                }

                return done(null, user, {message: "Authentication successful"});
            } catch(err) {
                done(err);
            }
        }
    )
);

