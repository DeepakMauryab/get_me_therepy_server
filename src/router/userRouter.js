import { Router } from "express";
import * as routes from "../controllers/Customer.controller.js";

const router = Router();

router.route("/").post(routes.addCustomer);
router.route("/googleAuth").post(routes.addUserWithGoogleAuth);
router.route("/login").post(routes.loginCustomer);
router.route("/reset-password").post(routes.sendOTP);
router.route("/password-update").post(routes.resetPassword);

export default router;
