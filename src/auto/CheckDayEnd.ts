import { dailyAutoResetAttendance } from "../controller/AttendanceController";

export const runAtMidnight = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours === 0 && minutes === 0) {
        dailyAutoResetAttendance()
    }
}