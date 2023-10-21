const SCORE = 500;

function calculateCurrentScore(currentScore, isRight) {
    if (isRight) {
        currentScore = currentScore + SCORE;
    } else if (isRight === null) {
        currentScore = currentScore;
    } else {
        if (currentScore - SCORE / 2 >= 0) {
            currentScore = currentScore - SCORE / 2;
        }
    }
    return currentScore;
}

module.exports = {
    calculateCurrentScore
}