const passport = require('passport');
const jwt = require('jsonwebtoken');

const { createNewUser } = require('../database/queries/users');

const path = require('path');
const logger = require('../logging/logger');

async function httpSignupUser(req, res, next) {
    try {
        const userData = req.body;

        //create new user and set current prompt to initial prompt
        const user = await createNewUser(userData);

        //login user
        // loginUser(req, res, 201, user, 'user successfully created');
  
        res.status(201).json({success: true, message: 'user successfully created'})
    } catch(err) {
        logger.error(err);
        next(err);

        // res.render('signup', {error: err.message});
    }
}

async function httpLoginUser(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
                // return res.render('login', {error: err.message});
            }

            if (!user) {
                const err = new Error(info.message);
                err.status = 401;
                return res.status(err.status).json({ success: false, message: err.message });
                // return res.render('login', {error: error.message});
            }
            req.login(user, {session: false}, async(err) => {
                if (err) return next(err)

                const body = {_id: user._id, username: user.username}
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {expiresIn: "7d"})

                return res.status(200).json({
                    success: true,
                    message: info.message,
                    token,
                    username: user.username,
                    email: user.email
                })

                // if (err) {
                //     res.render('login', {error: err.message});
                // }
        
                // return res.sendFile(path.join(__dirname, '..', '/index.html'));
            })
        } catch(err) {
            next(err)
        }
    })(req, res, next);  
}

async function httpAuthenticateWithGoogle(req, res, next) {
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
}

async function httpSendResponse(req, res, next) {
    passport.authenticate( 'google', async (err, user, info) => {
        try {
            if (err) {
                return next(err);
                // return res.render('login', {error: err.message});
            }

            req.login(user, {session: false}, async(err) => {
                if (err) return next(err)

                const body = {_id: user._id}

                if (user.username) body.username = user.username;

                const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {expiresIn: "7d"});

                const response = {
                    success: true,
                    message: info.message,
                    token
                };
                if (user.username) response.username = user.username;

                return res.status(200).json(response);

                // if (err) {
                //     res.render('login', {error: err.message});
                // }
        
                // return res.sendFile(path.join(__dirname, '..', '/index.html'));
            })
        } catch(err) {
            next(err)
        }
    })(req, res, next);
}


async function httpLogoutUser(req, res, next) {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
}


module.exports = {
    httpLoginUser,
    httpSignupUser, 
    httpAuthenticateWithGoogle,
    httpSendResponse,
    httpLogoutUser
}