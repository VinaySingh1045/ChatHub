import { Router } from "express";
import { getAllUsers, getLoginUsers, searchUsers, updateUserAvatar, updateUserContacts, updateUserProfile, userLogin, userLogout, userRegister } from "../controllers/User.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const router = Router(); 

router.route("/register").post(
    upload.single("avatar")
,userRegister)

router.route("/login").post(userLogin)
router.route("/logout").post(verifyJWT, userLogout)
router.route("/updateProfile").put(verifyJWT, updateUserProfile)
router.route("/updateAvatar").put(verifyJWT, upload.single("avatar"),updateUserAvatar)
router.route("/updateContacts").put(verifyJWT, updateUserContacts)
router.route("/searchUsers").get(verifyJWT, searchUsers)
router.route("/getLoginUsers").get(verifyJWT, getLoginUsers)

// router.route("/getAllUsers").get(verifyJWT, getAllUsers)
// apne ko abhi vahi users chaiye jisko hum add kare in contact 



