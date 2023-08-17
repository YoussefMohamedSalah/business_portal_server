import { Router } from "express";
import { addStartAttendance, addEndAttendance } from "../controller/AttendanceController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
// **************************************************
router.route("/start").post(checkAuth, addStartAttendance);
router.route("/end").post(checkAuth, addEndAttendance);




export { router as AttendanceRouter };