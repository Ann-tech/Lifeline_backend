const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    first_name: {
        type: String,
        required: [true, "first_name field is required"]
    },
    last_name: {
        type: String,
        required: [true, "last_name field is required"]
    },
    username: {
        type: String,
        required: [true, "username field is required"],
        trim: true,
        lowercase: true,
        unique: [true, 'username already exists']
    },
    email: {
        type: String,
        required: [true, "email field is required"],
        trim: true,
        lowercase: true,
        unique: [true, 'email already exists'],
        validate: [validator.isEmail, 'enter a valid email address']
    }, 
    google_id: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    currentTornadoPromptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prompt',
        required: true
    },
    scores: {
        tornadoGame: {
            score: {
                type: Number,
                min: 0,
                required: true,
                default: 0
            }
        }
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


userSchema.pre(
    'save',
    async function(next) {
        let user = this

        if (!user.isModified('password')) return next()

        try {
            const hash = await bcrypt.hash(user.password, 10)
            user.password = hash
            next()
        } catch(err) {
            next(err)
        }  
    }
)

userSchema.methods.isValidPassword = async function(password) {
    const compare = await bcrypt.compare(password, this.password)
    return compare
}

//modifies data sent back to user
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.password
    }
})

module.exports = mongoose.model('User', userSchema)