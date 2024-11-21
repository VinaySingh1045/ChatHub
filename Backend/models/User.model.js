import mongoose, { Schema } from "mongoose"
import bycrpt from "bcrypt"
import jwt from "jsonwebtoken"

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
    bio: {
        type: String,
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
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// Now we have to make a pre-save hook for the hash the passwords
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bycrpt.hash(this.password, 10);
    next();

})

// Now we have to check the [password] field with the given password matches with the hash password 
// For this we have to make method we are able to make it directly 

UserSchema.methods.comparePassword = async function (password) {
    return await bycrpt.compare(password, this.password);
}

// Method to generate an access token using JWT
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// Method to generate an refresh token using JWT
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User", UserSchema);