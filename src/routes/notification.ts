import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { createNotification } from "../controller/NotificationController";

const router = Router();
router.route("/").post(createNotification);
export { router as NotificationRouter };