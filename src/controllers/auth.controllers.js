const passport = require('passport');
const jwt = require('jsonwebtoken');

const { createNewUser } = require('../database/queries/users');
const { getInitialPrompt } = require('../database/queries/prompts');

const path = require('path');

async function httpSignupUser(req, res, next) {
    try {
        const userData = req.body;

        //get initial prompt
        const prompt = await getInitialPrompt();

        //create new user and set current prompt to initial prompt
        const user = await createNewUser({...userData, currentTornadoPromptId: prompt._id});

        //login user
        // loginUser(req, res, 201, user, 'user successfully created');
  
        res.status(201).json({success: true, message: 'user successfully created'})
    } catch(err) {
        console.log(err);
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
                    username: user.username
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
    console.log("hello")
    passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
}

async function httpRedirectUser(req, res, next) {
    passport.authenticate( 'google', {
        successRedirect: 'api/v1/auth/google/success',
        failureRedirect: 'api/v1/auth/google/failure'
    })(req, res, next);
}

async function httpSendSuccessResponse(req, res, next) {
    return res.status(200).json({success: true, message: "Authentication successfuly"})
}

async function httpSendFailureResponse(req, res, next) {
    return res.status(401).json({ success: false, message: 'Authentication failed.' });
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
    httpRedirectUser,
    httpSendSuccessResponse,
    httpSendFailureResponse,
    httpLogoutUser
}