const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
         match: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    },
    password: {
        type: String,
        required: false,
    },
    preferredLanguage: {
        type: String,
        enum: ["English", "Hindi", "Hinglish"],
        default: 'Hinglish',
    },
    
    // profile details 
    
    phoneNumber: {
        type: String,
        required: false,
    },
    jobType: {
        type: String,
        required: false,
    },
    age: {
        type: Number,
        required: false,
    },
    income: {
        type: Number,
        required: false,
    },
    state : {
        type: String,
        required: false,
    },
    caste : {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST'],
        required: false,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false,
    }
    
}, { timestamps: true });


userSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
        return next(error);
    }
});


module.exports = mongoose.model('User', userSchema);