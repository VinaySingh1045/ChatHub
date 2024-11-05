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
        await user.save({validateBeforeSave: false});

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
    console.log("Cloudinary response avatar: ", avatar);

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

    console.log("Request Body:", req.body);

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

    const {  accessToken, refreshToken } = await generateAccessAndRefreshToken(userExists._id)

    // Here is two different way to update the userExists, we are updating it because in userExists we did not have access and refresh tokens to update it we need to update 

    // 1. Update user document with the new refreshToken

    // userExists.refreshToken = refreshToken;
    // await userExists.save();

    // 2. Call the model again and update it now what will be faster you have to decided 1. one or a second.

    const user = await User.findById(userExists._id).select("-password -refreshToken")

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

export { userRegister, userLogin }


