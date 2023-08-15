import { getRepository } from "typeorm";
import { Attendance } from "../entities/Attendance";
import { User } from "../entities/User";


export const createStartAttendance = async (
    CreateStartAttendanceData: {
        user: User;
        absent: boolean;
        userLogInTime: string;
        shift_start: string;
        shift_end: string;
        late: boolean;
        early: boolean;
        lateTime: string;
        earlyTime: string;
    }
) => {
    const { user, late, early, absent, userLogInTime, shift_start, shift_end, lateTime, earlyTime } = CreateStartAttendanceData;
    const attendanceRepository = getRepository(Attendance);
    const attendance = new Attendance();
    attendance.absent = absent;
    attendance.enter_time = userLogInTime;
    attendance.late = late;
    if (late) attendance.late_by = lateTime;
    attendance.early = early;
    if (early) attendance.early_by = earlyTime;
    attendance.shift_start = shift_start;
    attendance.shift_end = shift_end;
    attendance.user = user;
    attendance.date = new Date().toISOString().slice(0, 10);
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

export const getByUserId = async (id: string) => {
    // get attendance where attendance user id = id
    // and where attendance date = today
    const date = new Date().toISOString().slice(0, 10)
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
