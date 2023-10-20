const User = require('../../models/users.model');

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
            user.scores.tornadoGameScore.score = 0;
        }

        const currentScore = user.scores.tornadoGameScore.score;
        
        if (isRight) {
            user.scores.tornadoGameScore.score = currentScore + SCORE;
        } else if (isRight === null) {
            user.scores.tornadoGameScore.score = user.scores.tornadoGameScore.score;
        } else {
            if (currentScore - SCORE / 2 >= 0) {
                user.scores.tornadoGameScore.score = currentScore - SCORE / 2;
            }
        }

        await user.save();
 
        return user;
    } catch(err) {
        throw err;
    }
}

async function updateUserScore(score) {

}

module.exports = {
    findUserByUsername,
    findUserById,
    createNewUser,
    updateUserPrompt
}