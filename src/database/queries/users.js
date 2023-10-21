const User = require('../../models/users.model');
const { calculateCurrentScore } = require('../../utils');

const SCORE = 500;

async function findUserByUsername(username) {
    try {
        const user = await User.findOne({username});
        return user;
    } catch(err) {
        throw err;
    }
}

async function findUserById(id) {
    try {
        const user = await User.findById(id).populate('currentTornadoPromptId');
        return user;
    } catch(err) {
        throw err;
    }
}

async function createNewUser(userData) {
    try {
        const user = await User.create(userData);
        return user;
    } catch(err) {
        throw err;
    }
}

async function updateUserPrompt(userId, currentPromptId, isRight) {
    try {
        let user = await User.findById(userId);
        user.currentTornadoPromptId = currentPromptId;

        user = await user.populate('currentTornadoPromptId');

        if (user.currentTornadoPromptId.initialPrompt) {
            user.scores.tornadoGame.score = 0;
        }

        const currentScore = user.scores.tornadoGame.score;
        
        if (isRight) {
            user.scores.tornadoGame.score = calculateCurrentScore(currentScore, isRight);
        } else if (isRight === null) {
            user.scores.tornadoGame.score = calculateCurrentScore(currentScore, isRight);
        } else {
            if (currentScore - SCORE / 2 >= 0) {
                user.scores.tornadoGame.score = calculateCurrentScore(currentScore, isRight);
            }
        }

        await user.save();
 
        return user;
    } catch(err) {
        throw err;
    }
}

async function getAllUsersBasedOnScore() {
    const users = await User.find({}, {username: 1, 'scores.tornadoGame.score': 1, _id: 0})
                      .sort({ 'scores.tornadoGame.score': -1 });
    return users;
}


module.exports = {
    findUserByUsername,
    findUserById,
    createNewUser,
    updateUserPrompt,
    getAllUsersBasedOnScore
}