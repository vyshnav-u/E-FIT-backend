const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    dob: {
        type: Date,
        default: null
    },
    address: {
        type: String,
        default: ""
    },
    height: {
        type: Number,
        default: null
    },
    weight: {
        type: Number,
        default: null
    },
    weightGoal: {
        type: Number,
        default: null
    },
    fitnessGoal: {
        type: String,
        default: ""
    },
    emergencyContact: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["member", "admin"],
        default: "member"
    },
    profileImage: {
        type: String,
        default: ""
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User