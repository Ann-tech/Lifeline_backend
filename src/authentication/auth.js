const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


const { findUserByUsername, findUserById } = require('../database/queries/users');

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
            callbackURL: "http://localhost:8080/api/v1/auth/google/callback",
            passReqToCallback   : true
        },
        function(request, accessToken, refreshToken, profile, done) {
            console.log(profile);
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return done(err, user);
            });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await findUserById(id);
    if (!user) {
        done(error, false);
    }
    done(null, user);
});
