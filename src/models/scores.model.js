const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const scoreSchema = new Schema({
    score: {
        type: number,
        required: [true, "score is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date
    },
    updated_at: {
        type: Date,
        default: Date
    }
})



module.exports = mongoose.model('Score', scoreSchema)