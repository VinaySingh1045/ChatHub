import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { sendMessage } from "../controllers/Message.controller.js";

export const router = Router();

router.route("/sendMessage").post(sendMessage, verifyJWT);


