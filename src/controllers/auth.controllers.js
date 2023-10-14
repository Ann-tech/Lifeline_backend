const passport = require('passport');

const { createNewUser } = require('../database/queries/users');
const { getInitialPrompt } = require('../database/queries/prompts');

async function httpSignupUser(req, res, next) {
    try {
        const userData = req.body;

        //get initial prompt
        const prompt = await getInitialPrompt();

        //create new user and set current prompt to initial prompt
        const user = await createNewUser({...userData, currentTornadoPromptId: prompt._id});

        //login user
        req.logIn(user, err => {
            if (err) next(err);
            res.json({
                success: true,
                message: 'Login successful'
            });
        })
  
        // res.status(201).json({success: true, message: 'user successfully created'})
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