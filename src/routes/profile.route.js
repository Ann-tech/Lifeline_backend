const express = require('express');
const profileRouter = express();

const { httpGetUserProfile, httpUpdateUserProfile } = require('../controllers/profile.controller');
const { updateUserValidationMiddleware } = require('../validators/user.validator');

profileRouter.get('/', httpGetUserProfile);
profileRouter.put('/', updateUserValidationMiddleware, httpUpdateUserProfile);

module.exports = profileRouter;