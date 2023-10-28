const Prompt = require('../../models/prompts.model');

const  tornadoPrompts = require('../../data/tornadoPrompts.json');

async function insertAllTornadoPrompts() {
    try {
        const prompts = await getAllPrompts();
        if (prompts.length === 0) {
           const prompts = await Prompt.insertMany(tornadoPrompts, {upsert: true});
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

async function findPromptBasedOnTitleAndOption(title, selectedText) {
    try {
        const prompt = await Prompt.findOne({ 'options.text': selectedText, title });
        const { options } = prompt;
        

        for (let i = 0; i < options.length; i++) {
            const { text, isRight, nextPrompt } = options[i];

            const promptInfo = {};
            
            if (text === selectedText) {
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

module.exports = {
    insertAllTornadoPrompts,
    getInitialPrompt,
    findPromptBasedOnTitleAndOption,
    getPromptByTitle
}