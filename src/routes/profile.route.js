const express = require('express');
const profileRouter = express();

const { httpGetUserProfile, httpUpdateUserProfile } = require('../controllers/profile.controller');

profileRouter.get('/', httpGetUserProfile);
profileRouter.put('/', httpUpdateUserProfile);

module.exports = profileRouter;