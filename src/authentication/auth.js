const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

const { findUserByUsername, findUserById } = require('../database/queries/users');

passport.use(
    'login',
    new LocalStrategy(
        {
            "usernameField": "username",
            "passwordField": "password"
        },

        async function(username, password, done) {
            try {
                const user = await findUserByUsername(username)
                if (!user) return done(null, false, {message: "User not found"})

                const validate = await user.isValidPassword(password)
                
                if (!validate) return done(null, false, {message: "Password incorrect"})

                return done(null, user, {message: "Login successful"})
            } catch(err) {
                console.log(err)
                return done(err)
            }
        }
    )
)

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
