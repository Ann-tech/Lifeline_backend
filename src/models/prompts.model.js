const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const promptSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    intialPrompt: {
        type: Boolean,
        required: true,
        default: false
    },
    options: [
        {
            text: String,
            isRight: {
                type: Boolean,
                required: true,
                default: false
            },
            nextPrompt: {
                type: String,
                required: true
            }
        }
    ]
});


module.exports = mongoose.model('Prompt', promptSchema)