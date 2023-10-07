const passport = require('passport');

const { createNewUser } = require('../database/queries/users');

async function httpSignupUser(req, res, next) {
    try {
        const userData = req.body;
        const user = await createNewUser(userData);
  
        res.status(201).json({success: true, message: 'user successfully created'})
    } catch(err) {
        next(err);
    }
}

async function httpLoginUser(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                const error = new Error('email or password is incorrect');
                return next(error);
            }
            req.logIn(user, err => {
                if (err) next(err);
                res.json({
                    success: true,
                    message: info.message
                });
            })
            
        } catch (error) {
            return next(error);
    }})(req, res, next);
}

module.exports = {
    httpLoginUser,
    httpSignupUser
}