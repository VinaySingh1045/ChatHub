import mongoose from "mongoose";

const GroupChatSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        trim: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
},{timestamps:true})


export const Group = mongoose.model("Group", GroupChatSchema)
