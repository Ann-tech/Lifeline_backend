const { insertAllTornadoPrompts } = require("../queries/prompts");


async function seedTornadoPrompts() {
    try {
        const prompts = await insertAllTornadoPrompts();
        return prompts;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    seedTornadoPrompts
}