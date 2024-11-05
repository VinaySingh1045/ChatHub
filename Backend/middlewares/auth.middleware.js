import { ApiError } from "../utlis/ApiError.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { AsyncHandler } from "../utlis/AsyncHandler.js";

export const verifyJWT = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            throw new ApiError(401, "Unauthorized user request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }

})
