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
    options: [
        {
            text: String,
            nextPrompt: {
                type: String, 
                required: true
            }
        }
    ]
});


module.exports = mongoose.model('Prompt', promptSchema)