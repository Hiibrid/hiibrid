import { Router } from "express";
import mongoose from "mongoose";
import { registerController} from "../controller/user.controller.js";
import { loginController} from "../controller/user.controller.js";
import wrapAsync from "../utils/wrapAsync.js"
import { upload } from "../middleware/multer.middleware.js";



let router = Router();

//register route
router.route("/signup").post( upload.fields([{ name: "avatar", maxCount: 1 }]), wrapAsync(registerController));


// login route
router.route("/login").post( wrapAsync(loginController));

export default router;