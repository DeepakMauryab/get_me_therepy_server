import { Router } from "express";
import * as routes from "../controllers/Event.controller.js";

const router = Router();

router.route("/").get(routes.getEvents);
router.route("/").post(routes.createEvent);

export default router;
