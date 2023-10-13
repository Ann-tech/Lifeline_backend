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

module.exports = {
    insertAllTornadoPrompts
}