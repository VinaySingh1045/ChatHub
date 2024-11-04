import mongoose from "mongoose";

const UserGroupSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member'
    },
}, { timestamps: true });

export const UserGroup = mongoose.model('UserGroup', UserGroupSchema)
