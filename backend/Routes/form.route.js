import { Router } from "express";
import { formAddcontroller, formSubmit } from "../controller/form.cotroller.js";
import wrapAsync from "../utils/wrapAsync.js";
import {verifyJWT} from "../middleware/auth.js"

const router = Router();

router.route("/form").post(wrapAsync(formAddcontroller));
router.route("/form/submit").post(verifyJWT,wrapAsync(formSubmit))

export default router;
