const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 16
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 16
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address:", value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        select: false,
        validate(value) {
            if (!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })) {
                throw new Error("Password must contain 8+ chars, including uppercase, lowercase, and number");
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL:", value);
            }
        }
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    about: {
        type: String,
        default: "This is about section for user",
        trim: true,
        minLength: 12,
        maxLength: 200
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Data is not valid");
            }
        }
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });



// Transform before sending data to client 
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);