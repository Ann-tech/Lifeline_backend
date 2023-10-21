const express = require('express');
const leaderboardRouter = express.Router();

const { httpGetAllUsersBasedOnScore } = require('../controllers/users.controller');

leaderboardRouter.get('/', httpGetAllUsersBasedOnScore);

module.exports = leaderboardRouter;