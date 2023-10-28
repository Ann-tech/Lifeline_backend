const SCORE = 500;

function calculateCurrentScore(currentScore, promptType, isRight, positiveFeedback) {
    if (promptType == 'setup' || promptType == 'info') return currentScore;
    if (isRight && promptType == 'question') {
        currentScore = currentScore + SCORE;
    } 

    if (promptType == 'feedback' && !positiveFeedback)
        if (currentScore - SCORE / 2 >= 0) {
            currentScore = currentScore - SCORE / 2;
        }
    
    return currentScore;
}

module.exports = {
    calculateCurrentScore
}