const { findUserById } = require("../database/queries/users")

async function getCurrentPrompt(userId) {
    try {
        const { currentTornadoPromptId } = await findUserById(userId);
        return currentTornadoPromptId;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    getCurrentPrompt
}