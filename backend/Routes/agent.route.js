import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js"
import { agentRegisterController,agentLoginController ,agentLogoutControler} from "../controller/agent.controller.js";
import{ verifyJWTforAgent } from "../middleware/auth.js"
let router = Router();


router.route("/signup").post(wrapAsync(agentRegisterController));
router.route("/login").post(wrapAsync(agentLoginController));
router.route("/logout").post(verifyJWTforAgent,wrapAsync(agentLogoutControler));

export default router;