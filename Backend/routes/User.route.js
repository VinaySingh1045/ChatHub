import { Router } from "express";
import { userLogin, userLogout, userRegister } from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const router = Router();

router.route("/register").post(
    upload.single("avatar")
,userRegister)

router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, userLogout)

