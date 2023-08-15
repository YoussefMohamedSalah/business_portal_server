import { Router } from "express";
import { dashboardAttendance } from "../controller/DashboardController";

const router = Router();
// **************************************************
router.route("/attendance/:companyId").get(dashboardAttendance);




export { router as DashboardRouter };