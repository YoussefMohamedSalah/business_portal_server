import { Router } from "express";
import { dashboardAttendance } from "../controller/DashboardController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
// **************************************************
router.route("/attendance").get(checkAuth, dashboardAttendance);




export { router as DashboardRouter };