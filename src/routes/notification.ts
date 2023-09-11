import { Router } from "express";
import { getNotifications, getNotificationById, deleteNotification, deleteAllNotifications, markNotificationAsRead } from "../controller/NotificationController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").get(checkAuth, getNotifications);
router.route("/status/:id").get(checkAuth, markNotificationAsRead);


export { router as NotificationRouter };