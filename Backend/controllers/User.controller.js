import { AsyncHandler } from "../utlis/AsyncHandler.js";
import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import uploadOnCloudinary from "../utlis/Cloudinary.js";

const userRegister = AsyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body
    console.log("Request Body:", req.body);
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

    if(req.file){
        avatarFilePath = req.file.path
    }
    else{
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

export { userRegister }


