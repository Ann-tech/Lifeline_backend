const express = require('express');
const authRouter = express.Router();

const { 
    httpSignupUser, 
    httpLoginUser, 
    httpAuthenticateWithGoogle, 
    httpRedirectUser, 
    httpSendSuccessResponse, 
    httpSendFailureResponse,
    httpLogoutUser } = require('../controllers/auth.controllers');


authRouter.post('/signup', httpSignupUser);
authRouter.post('/login', httpLoginUser);
authRouter.get('/google', httpAuthenticateWithGoogle);
authRouter.get( '/google/callback', httpRedirectUser);
authRouter.get( 'google/success', httpSendSuccessResponse);
authRouter.get( 'google/failure', httpSendFailureResponse);
authRouter.post('/logout', httpLogoutUser);

module.exports = authRouter;