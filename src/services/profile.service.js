const { updateUserInfo, findUserById } = require('../database/queries/users');

async function getUserProfile(id) {
    try {
        const user = await findUserById(id);
        if (!user) return user;

        let profile = {};

        if (user.first_name) profile.first_name = user.first_name;
        if (user.last_name) profile.last_name = user.last_name;
        if (user.username) profile.username = user.username;
        profile.email = user.email;

        return profile;
    } catch(err) {
        throw err;
    }
}

async function updateUserProfile(userId, userData) {
    try {
        const user = await updateUserInfo(userId, userData);

        if (!user) return user;

        let profile = {};

        if (userData.first_name) profile.first_name = user.first_name;
        if (userData.last_name) profile.last_name = user.last_name;
        if (userData.username) profile.username = user.username;

        return profile;

    } catch(err) {
        throw err;
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile
}