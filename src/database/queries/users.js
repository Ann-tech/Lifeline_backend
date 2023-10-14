const User = require('../../models/users.model');

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
        const user = await User.findById(id);
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

async function updateUserPrompt(id) {
    try {
        const user = await User.updateOne({currentTornadoPromptId: id});
        return user;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    findUserByUsername,
    findUserById,
    createNewUser,
    updateUserPrompt
}