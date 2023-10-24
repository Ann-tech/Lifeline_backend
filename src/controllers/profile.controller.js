const { getUserProfile, updateUserProfile } = require("../services/profile.service");

async function httpGetUserProfile(req, res, next) {
    try {
        const id = req.user._id;
        const user = await getUserProfile(id);

        if (!user) res.status(404).json({success: false, message: "user does not exist"});

        return res.status(200).json({success: true, user});
    } catch(err) {
        throw err;
    }
}

async function httpUpdateUserProfile(req, res, next) {
    try {
        const userData = req.body;
        const userId = req.user._id;

        const user = await updateUserProfile(userId, userData);

        if (!user) return res.status(400).json({success: false, message: "An error has occured"});

        return res.status(201).json({success: true, message: "profile successfully updated", user});
    } catch(err) {
        throw err;
    }
}

module.exports = {
    httpGetUserProfile,
    httpUpdateUserProfile
}