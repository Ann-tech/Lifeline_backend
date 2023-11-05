const { findUserById, updateUserPrompt } = require("../database/queries/users");
const { getPromptByTitle, findPromptBasedOnTitleAndOption } = require('../database/queries/prompts')

async function getCurrentPrompt(userId) {
    try {
        const user = await findUserById(userId);
        return { nextPrompt: user.currentTornadoPromptId, score: user.scores.tornadoGame.score };
    } catch(err) {
        throw err;
    }
}

// async function getNextPrompt(promptText) {
//     try {
//         const prompt = await findPromptBasedOnText(promptText);
//         const title = prompt.nextPrompt;

//         const nextPrompt = await getPromptByTitle(title);
//         return { isRight: prompt.isRight, nextPrompt };
//     } catch(err) {
//         throw err;
//     }
// }

async function getNextPrompt(promptInfo) {
    try {
        const { promptType, title, text, userId } = promptInfo;

        if (promptType !== 'question') {
            const prompt = await getPromptByTitle(title);
            const nextPrompt = await getPromptByTitle(prompt.nextPrompt);

            if (promptType == 'feedback') {
                return { nextPrompt, positiveFeedback: prompt.positiveFeedback };
            }
            return { nextPrompt };
        } else {
            const prompt = await findPromptBasedOnTitleAndOption(title, text);
            const promptTitle = prompt.nextPrompt;
            const nextPrompt = await getPromptByTitle(promptTitle);
            return { isRight: prompt.isRight, nextPrompt };
        }     
    } catch(err) {
        throw err;
    }
}

async function updateUserPromptProgress(userId, currentPromptId, promptType, isRight, positiveFeedback, initialPrompt) {
    try {
        const user = await updateUserPrompt(userId, currentPromptId, promptType, isRight, positiveFeedback, initialPrompt);
        return { score: user.scores.tornadoGame.score };
    
    } catch(err) {
        throw err;
    }
}
module.exports = {
    getCurrentPrompt,
    getNextPrompt,
    updateUserPromptProgress
}