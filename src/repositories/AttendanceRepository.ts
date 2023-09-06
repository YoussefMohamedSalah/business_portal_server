import { getRepository } from "typeorm";
import { Attendance } from "../entities/Attendance";
import { User } from "../entities/User";


export const createStartAttendance = async (
    CreateStartAttendanceData: {
        user: User;
        absent: boolean | null;
        userLogInTime: string | null;
        shift_start: string;
        shift_end: string;
        late: boolean | null;
        early: boolean | null;
        lateTime: string | null;
        earlyTime: string | null;
        lateReason: string;
        date: string;
    }
) => {
    const { user, late, early, absent, userLogInTime, shift_start, shift_end, lateTime, earlyTime, lateReason, date } = CreateStartAttendanceData;
    const attendanceRepository = getRepository(Attendance);
    const attendance = new Attendance();
    if (absent !== null) attendance.absent = absent;
    if (userLogInTime !== null) attendance.enter_time = userLogInTime;
    if (late !== null) attendance.late = late;
    if (late !== null && late && lateTime !== null) attendance.late_by = lateTime;
    if (early !== null) attendance.early = early;
    if (early !== null && early && earlyTime !== null) attendance.early_by = earlyTime;
    if (late && lateReason !== '') attendance.late_reason = lateReason;
    attendance.shift_start = shift_start;
    attendance.shift_end = shift_end;
    attendance.date = date;
    attendance.user = user;
    attendance.company = user.company;
    await attendanceRepository.save(attendance);
    return attendance;
};


export const createEndAttendance = async (
    CreateEndAttendanceData: {
        absent: boolean;
        shift_end: string;
    }
) => {
    const { absent, shift_end } = CreateEndAttendanceData;
    const attendanceRepository = getRepository(Attendance);
    const attendance = new Attendance();
    attendance.absent = absent;
    attendance.shift_end = shift_end;
    await attendanceRepository.save(attendance);
    return attendance;
};

export const getByUserId = async (id: string, date: string) => {
    // get attendance where attendance user id = id
    // and where attendance date = today
    const attendanceRepository = getRepository(Attendance);
    const attendance = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.user = :id", { id: id })
        .andWhere("attendance.date = :date", { date: date })
        .getOne();
    return attendance;
};

export const getById = async (id: string) => {
    const attendanceRepository = getRepository(Attendance);
    const attendance = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.id = :id", { id: id })
        .getOne();
    return attendance;
};

export const getAllToReset = async (date: string) => {
    const attendanceRepository = getRepository(Attendance);
    const attendance = await attendanceRepository
        .createQueryBuilder("attendance")
        .where("attendance.date = :date", { date: date })
        .getMany();
    return attendance;
}