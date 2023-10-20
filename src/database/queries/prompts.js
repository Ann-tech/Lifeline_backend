const Prompt = require('../../models/prompts.model');

const  tornadoPrompts = require('../../data/tornadoPrompts.json');

async function insertAllTornadoPrompts() {
    try {
        const prompts = await getAllPrompts();
        if (prompts.length === 0) {
            await Prompt.insertMany(tornadoPrompts, {upsert: true});
        }
        return prompts;
    } catch(err) {
        throw err;
    }
}

async function getAllPrompts() {
    try {
        const prompts = await Prompt.find({});
        return prompts;
    } catch(err) {
        throw err;
    }
}

async function getInitialPrompt() {
    try {
        const prompt = await Prompt.findOne({initialPrompt: true});
        return prompt;
    } catch(err) {
        throw err;
    }
}

async function findPromptBasedOnText(promptText) {
    try {
        const prompt = await Prompt.findOne({ 'options.text': promptText });
        const { options } = prompt;
        

        for (let i = 0; i < options.length; i++) {
            const { text, isRight, nextPrompt } = options[i];

            const promptInfo = {};
            
            if (text === promptText) {
                promptInfo.isRight = isRight;
                promptInfo.nextPrompt = nextPrompt;

                return promptInfo;
            }
            
        }
        
    } catch(err) {
        throw err;
    }
}

async function getPromptByTitle(title) {
    try {
        const prompt = await Prompt.findOne({title});
        return prompt;
    } catch(err) {
        throw err;
    }
}

async function getNextPrompt(promptText) {
    try {
        const prompt = await findPromptBasedOnText(promptText);
        const title = prompt.nextPrompt;

        const nextPrompt = await getPromptByTitle(title);
        return { isRight: prompt.isRight, nextPrompt };
    } catch(err) {
        throw err;
    }
}
module.exports = {
    insertAllTornadoPrompts,
    getInitialPrompt,
    getNextPrompt
}