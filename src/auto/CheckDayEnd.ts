import { dailyAutoResetAttendance } from "../controller/AttendanceController";

export const runAtMidnight = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    if (hours === 0 && minutes === 0 && seconds >= 0 && seconds <= 2) {
        dailyAutoResetAttendance()
    }
}