import { Router } from "express";
import { addStartAttendance, addEndAttendance } from "../controller/AttendanceController";

const router = Router();
// **************************************************
router.route("/start/:id").post(addStartAttendance);
router.route("/end/:id").post(addEndAttendance);




export { router as AttendanceRouter };