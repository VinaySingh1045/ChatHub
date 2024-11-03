import mongoose, { Schema } from "mongoose"

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    themePreference: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

