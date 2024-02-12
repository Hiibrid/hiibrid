import { Router } from "express";
import mongoose from "mongoose";
import { registerController,loginController,logoutControler} from "../controller/user.controller.js";

import wrapAsync from "../utils/wrapAsync.js"
import { upload } from "../middleware/multer.middleware.js";
import{verifyJWT} from "../middleware/auth.js"



let router = Router();

//register route
router.route("/signup").post( upload.fields([{ name: "avatar", maxCount: 1 }]), wrapAsync(registerController));


// login route
router.route("/login").post( wrapAsync(loginController));
router.route("/logout").post( verifyJWT, wrapAsync(logoutControler));

export default router;