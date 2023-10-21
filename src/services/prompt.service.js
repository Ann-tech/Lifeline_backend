const { findUserById, updateUserPrompt } = require("../database/queries/users")

async function getCurrentPrompt(userId) {
    try {
        const user = await findUserById(userId);
        return { nextPrompt: user.currentTornadoPromptId, score: user.scores.tornadoGame.score };
    } catch(err) {
        throw err;
    }
}

async function updateUserPromptProgress(userId, currentPromptId, isRight) {
    try {
        const user = await updateUserPrompt(userId, currentPromptId, isRight);
        return { score: user.scores.tornadoGame.score };
    
    } catch(err) {
        throw err;
    }
}
module.exports = {
    getCurrentPrompt,
    updateUserPromptProgress
}