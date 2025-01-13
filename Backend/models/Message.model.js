import mongoose, { Schema } from "mongoose";


const MessageSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group",
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["sent", "received", "read"],
        default: "sent"
    },
    timestamp: {
        type: String,
    },
    seenBy: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
}, { timestamps: true })

export const Message = mongoose.model("Message", MessageSchema)
