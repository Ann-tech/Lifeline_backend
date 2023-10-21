const passport = require('passport');

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
        loginUser(req, res, 201, user, 'user successfully created');
  
        // res.status(201).json({success: true, message: 'user successfully created'})
    } catch(err) {
        // next(err);

        res.render('signup', {error: err.message});
    }
}

async function httpLoginUser(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err) {
                // return next(err);
                return res.render('login', {error: err.message});
            }
            if (!user) {
                const error = new Error('username or password is incorrect');
                // return next(error);
                return res.render('login', {error: error.message});
            }
            loginUser(req, res, 200, user, info.message);
            
        } catch (error) {
            return next(error);
    }})(req, res, next);
}

async function loginUser(req, res, status, user, message) {
    req.logIn(user, err => {
        // if (err) return next(err);
        // res.status(status).json({
        //     success: true,
        //     message
        // });
        if (err) {
            res.render('login', {error: err.message});
        }

        return res.sendFile(path.join(__dirname, '..', '/index.html'));
    })
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