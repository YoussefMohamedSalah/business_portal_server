import { Router } from "express";
import { addStartAttendance, addEndAttendance, getAttendanceStatus } from "../controller/AttendanceController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
// **************************************************
router.route("/start").post(checkAuth, addStartAttendance);
router.route("/end").post(checkAuth, addEndAttendance);

// get attendance for user by id and return status
router.route("/status").get(checkAuth, getAttendanceStatus);



export { router as AttendanceRouter };