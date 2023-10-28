const User = require('../../models/users.model');

const { getInitialPrompt } = require('./prompts');
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
        //get initial prompt
        const prompt = await getInitialPrompt();
        userData.currentTornadoPromptId = prompt._id;

        const user = await User.create(userData);

        return user;
    } catch(err) {
        throw err;
    }
}

async function findUserByEmail(email) {
    try {
        const user = await User.findOne({email});
        return user;
    } catch(err) {
        throw err;
    }
}


async function updateUserInfo(userId, userData) {
    try {
        const user = await User.findByIdAndUpdate(userId, userData, {new: true});
        return user;
    } catch(err) {
        throw err;
    }
}

async function updateUserPrompt(userId, currentPromptId, promptType, isRight, positiveFeedback, initialPrompt) {
    try {
        let user = await User.findById(userId);
        user.currentTornadoPromptId = currentPromptId;

        if (promptType == 'setup' || promptType == 'info') {
            if (initialPrompt) {
                user.scores.tornadoGame.score = 750;
            }
            await user.save();
            return user;
        }

        const currentScore = user.scores.tornadoGame.score;
        if (isRight && promptType == 'question') {
            user.scores.tornadoGame.score = calculateCurrentScore(currentScore, promptType, isRight);
        } 

        if (promptType == 'feedback' && !positiveFeedback) {
            user.scores.tornadoGame.score = calculateCurrentScore(currentScore, promptType, isRight, positiveFeedback);
        }

        

        await user.save();
 
        return user;
    } catch(err) {
        throw err;
    }
}

async function getAllUsersBasedOnScore() {
    try {
        const users = await User.find({}, {username: 1, 'scores.tornadoGame.score': 1, _id: 0})
                      .sort({ 'scores.tornadoGame.score': -1 });
        return users;
    } catch(err) {
        throw err;
    }
}




module.exports = {
    findUserByUsername,
    findUserById,
    createNewUser,
    findUserByEmail,
    updateUserInfo,
    updateUserPrompt,
    getAllUsersBasedOnScore
}