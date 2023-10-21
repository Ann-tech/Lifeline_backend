const { getAllUsersBasedOnScore } = require("../database/queries/users")

async function httpGetAllUsersBasedOnScore(req, res) {
    const users = await getAllUsersBasedOnScore();
    return res.status(200).json(users);
}

module.exports = {
    httpGetAllUsersBasedOnScore
}