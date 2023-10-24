const express = require('express');
const authRouter = express.Router();

const userValidator = require('../validators/user.validator');

const { 
    httpSignupUser, 
    httpLoginUser, 
    httpAuthenticateWithGoogle, 
    httpSendResponse, 
    httpLogoutUser 
} = require('../controllers/auth.controllers');


authRouter.post('/signup', userValidator, httpSignupUser);
authRouter.post('/login', httpLoginUser);
authRouter.get('/google', httpAuthenticateWithGoogle);
authRouter.get( '/google/callback', httpSendResponse);

authRouter.post('/logout', httpLogoutUser);

module.exports = authRouter;