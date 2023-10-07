const express = require('express');
const authRouter = express.Router();

const { httpSignupUser, httpLoginUser } = require('../controllers/auth.controllers');

authRouter.post('/signup', httpSignupUser);
authRouter.post('/login', httpLoginUser);

module.exports = authRouter;