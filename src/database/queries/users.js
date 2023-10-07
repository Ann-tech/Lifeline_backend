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

module.exports = {
    findUserByUsername,
    findUserById
}