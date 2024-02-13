import { Router } from "express";
import wrapAsync from "../utils/wrapAsync.js"
import { agentRegisterController,agentLoginController } from "../controller/agent.controller.js";

let router = Router();


router.route("/signup").post(wrapAsync(agentRegisterController));
router.route("/login").post(wrapAsync(agentLoginController));

export default router;