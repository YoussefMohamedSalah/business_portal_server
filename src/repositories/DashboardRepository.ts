import { getRepository } from "typeorm";
import { Attendance } from "../entities/Attendance";

// DONE
export const getDashboardAttendance = async (companyId: string) => {
    const attendanceRepository = getRepository(Attendance);
    const attendance = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.companyId = :companyId", { companyId: companyId })
        .andWhere("attendance.date = :date", { date: new Date().toISOString().slice(0, 10) })
        .getMany();
    return attendance;
};

