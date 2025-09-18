const mongoose = require('mongoose');

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
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        maxLength: 16
    },
    photoUrl: {
        type: String,
        default: 'https://www.pngitem.com/pimgs/m/272-2720656_user-profile-dummy-hd-png-download.png'
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

module.exports = mongoose.model("User", userSchema);