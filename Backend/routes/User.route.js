import { Router } from "express";
import { userRegister } from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

export const router = Router();

router.route("/register").post(
    upload.single("avatar")
,userRegister)