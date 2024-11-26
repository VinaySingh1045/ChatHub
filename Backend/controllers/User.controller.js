import { AsyncHandler } from "../utlis/AsyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import uploadOnCloudinary from "../utlis/Cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();

        const refreshToken = await user.generateRefreshToken();

        // addding and saving the refresh token in db
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        };

    } catch (error) {
        // console.log("Error:", error );
        throw new ApiError(500, error || "Something went wrong while generating Refresh and Access Token")
    }
}


const userRegister = AsyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body

    // console.log("Request Body:", req.body);

    // Validation
    if (!fullName || !email || !password) {
        throw new ApiError(400, "All fileds are required")
    }

    // Check if the email is already exists
    const existsUser = await User.findOne({ email })

    if (existsUser) {
        throw new ApiError(409, "Email already exists")
    }

    // Now uploading the file to the cloudinary service

    let avatarFilePath;

    if (req.file) {
        avatarFilePath = req.file.path
    }
    else {
        console.log("Something went wrong");
    }

    const avatar = await uploadOnCloudinary(avatarFilePath);
    // console.log("Cloudinary response avatar: ", avatar);

    // Create the user
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: avatar?.url || "",
    })

    return res.status(201).json(
        new ApiResponse(200, user, "User Register Successfully")
    )

})

const userLogin = AsyncHandler(async (req, res) => {
    const { email, password } = req.body

    // console.log("Request Body:", req.body);

    // Validation
    if (!email || !password) {
        throw new ApiError(400, "All fileds are required")
    }

    // Check if the user exists
    const userExists = await User.findOne({ email })

    if (!userExists) {
        throw new ApiError(404, "User not found")
    }

    // Comparing the password

    const isPasswordMatch = await userExists.comparePassword(password)

    if (!isPasswordMatch) {
        throw new ApiError(401, "Invaild User Credentials");
    }

    // Generating the Refresh and Access Token

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExists._id)

    // Here is two different way to update the userExists, we are updating it because in userExists we did not have access and refresh tokens to update it we need to update 

    // 1. Update user document with the new refreshToken

    // userExists.refreshToken = refreshToken;
    // await userExists.save();

    // 2. Call the model again and update it now what will be faster you have to decided 1. one or a second.

    const user = await User.findById(userExists._id).select("-password -refreshToken").populate("contacts")

    // Set cookies options
    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user, accessToken, refreshToken }, "User Login Successfully")
        )

})

const userLogout = AsyncHandler(async (req, res) => {

    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                },
            },
            {
                new: true
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
                new ApiResponse(200, {}, "User Logout Successfull")
            )

    } catch (error) {
        console.log("Logout:Error ", error)
    }
})

const updateUserProfile = AsyncHandler(async (req, res) => {

    const { fullName, themePreference, bio } = req.body

    let fieldsToUpdate = {}

    if (fullName) { fieldsToUpdate.fullName = fullName }
    if (themePreference) { fieldsToUpdate.themePreference = themePreference }
    if (bio) { fieldsToUpdate.bio = bio }

    // Update user fields in the database
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: fieldsToUpdate },
        { new: true }
    ).select("-password");

    // Return the updated user data
    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Updated user profile successfully")
    );
});


const updateUserAvatar = AsyncHandler(async (req, res) => {

    // if(!avatarFilePath){
    //     throw new ApiError(400, "No Avatar Provided")
    // }
    if (!req.file || !req.file.path) {
        throw new ApiError(400, "No Avatar Provided");
    }
    const avatarFilePath = req.file.path

    // upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarFilePath)

    if (!avatar.url) {
        throw new ApiError(400, "avatar file not found")
    }

    // Update user avatar in the database
    const updateUserAvatar = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, {
        new: true
    }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, updateUserAvatar, "Updated user avatar successfully")
    )

})

const searchUsers = AsyncHandler(async (req, res) => {
    const { searchTerm } = req.query

    if (!searchTerm) {
        throw new ApiError(400, "Search term is required");
    }

    const users = await User.find({
        $or: [

            { fullName: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
        ],
        _id: { $ne: req.user._id }  // Exclude the logged in user from the search results list // one note exculed is not working properly b/c we have changed in routes...
    }).select("fullName email avatar contacts")
        .populate("contacts")

    return res.status(200).json(
        new ApiResponse(200, users, "Search users successfully")
    );


})

const getLoginUsers = AsyncHandler(async (req, res) => {

    return res.status(200).json(
        new ApiResponse(200, req.user, "User fetch Successfully")
    )

})

const getAllUsers = AsyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("fullName email avatar contacts")

    return res.status(200).json(
        new ApiResponse(200, users, "All users fetched successfully")
    )

})

// update User's Contacts list
const updateUserContacts = AsyncHandler(async (req, res) => {
    const { contacts } = req.body

    if (!Array.isArray(contacts) || !contacts.length) {
        throw new ApiError(400, "Invalid contacts list")
    }

    const updateuser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { contacts: { $each: contacts } }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, updateuser, "User added Successfully")
    )

})

export { userRegister, userLogin, userLogout, updateUserProfile, updateUserAvatar, searchUsers, getLoginUsers, updateUserContacts, getAllUsers }


