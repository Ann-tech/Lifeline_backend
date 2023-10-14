const { findUserById, updateUserPrompt } = require("../database/queries/users")

async function getCurrentPrompt(userId) {
    try {
        const { currentTornadoPromptId } = await findUserById(userId);
        return currentTornadoPromptId;
    } catch(err) {
        throw err;
    }
}

async function updateUserPromptProgress(currentPromptId) {
    try {
        await updateUserPrompt(currentPromptId);
        return;
    } catch(err) {
        throw err;
    }
}
module.exports = {
    getCurrentPrompt,
    updateUserPromptProgress
}