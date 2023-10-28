const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const promptSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    promptType: {
        type: String,
        enum: ["info", "setup", "question", "feedback"],
        required: true
    },
    heading: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    nextPrompt: {
        type: String
    },
    positiveFeedback: {
        type: Boolean,
    },
    initialPrompt: {
        type: Boolean,
        required: true,
        default: false
    },
    finalPrompt: {
        type: Boolean,
        required: true,
        default: false
    },
    question: {
        type: String
    },
    options: [
        {
            text: String,
            isRight: {
                type: Boolean,
                default: false
            },
            nextPrompt: {
                type: String,
                required: true
            }
        }
    ]
});

promptSchema.pre('save', function (next) {
    console.log(this);
    if (this.promptType === 'feedback') {
      this.positiveFeedback = false;
    }
    if (!this.options) {
        delete this.options;
    }
    next();
});


module.exports = mongoose.model('Prompt', promptSchema)