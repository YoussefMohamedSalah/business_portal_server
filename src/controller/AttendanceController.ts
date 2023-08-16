import { Request, Response } from 'express';
import { getAllUsers, getUserAndCompanyById } from '../repositories/UserRepository';
import { handleStartWork, handleEndWork, parseTime } from '../utils/handleAttendance';
import { createStartAttendance, getAllToReset, getByUserId } from '../repositories/AttendanceRepository';

// DONE
export const addStartAttendance = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lateReason } = req.body;
    const date = new Date();
    const stringDate = new Date().toISOString().slice(0, 10) // 2021-08-01

    // format login time
    let loginHour: string = date.getHours().toString();
    let loginMinute: string = date.getMinutes().toString();
    if (date.getHours() < 10) loginHour = `0${loginHour}`;
    if (date.getMinutes() < 10) loginMinute = `0${loginMinute}`;
    const userLogInTime = loginHour + ':' + loginMinute;
    // check if user exist
    const user = await getUserAndCompanyById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    // check if user has shift and What is it
    const { shift_start, shift_end } = user
    if (!shift_start || !shift_end) return res.status(404).json({ msg: "You'r Shift not found" });
    // now check if user already done attendance today
    const existingAttendance = await getByUserId(id, stringDate);
    if (existingAttendance) return res.status(409).json({ msg: "You Already Start Attendance Today" });
    // now check if user is late or early or absent
    const data = handleStartWork(shift_start, userLogInTime)
    const { late, early, absent, lateTime, earlyTime } = data;
    const CreateStartAttendanceData = {
        user,
        late,
        early,
        absent,
        userLogInTime,
        shift_start,
        shift_end,
        lateTime,
        earlyTime,
        lateReason: lateReason ? lateReason : '',
        date: stringDate
    }
    // if user is late then check if he is late by 15 min or more
    let attendance = await createStartAttendance(CreateStartAttendanceData);
    if (!attendance) return res.status(409).json({ msg: "Field To Complete Attendance" });
    const { user: userInfo, company, ...rest } = attendance
    return res.json(rest);
};

// DONE
export const addEndAttendance = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { dailyReport } = req.body;
    const date = new Date();
    const stringDate = new Date().toISOString().slice(0, 10) // 2021-08-01
    // format logout time
    let logoutHour: string = date.getHours().toString();
    let logoutMinute: string = date.getMinutes().toString();
    if (date.getHours() < 10) logoutHour = `0${logoutHour}`;
    if (date.getMinutes() < 10) logoutMinute = `0${logoutMinute}`;
    const userLogOutTime = logoutHour + ':' + logoutMinute;
    // Now get the attendance of this user today
    const attendance = await getByUserId(id, stringDate);
    if (!attendance) return res.status(404).json({ msg: "User Attendance not found" });
    const { shift_start, shift_end, enter_time, leave_time } = attendance
    // check if user already done attendance today
    if (leave_time) return res.status(409).json({ msg: "You Already Done Attendance Today" });
    // Calculate Working Hours
    const workingHoursData = handleEndWork(shift_start, shift_end, enter_time, userLogOutTime)
    if (!workingHoursData) return res.status(409).json({ msg: "Field To Complete Attendance" });
    const { workingTimeFormat, overtimeFormat } = workingHoursData;
    // now if workingTimeFormat is '00:00' then user is trying to end work before start work time
    '00:00' === workingTimeFormat && res.status(409).json({ msg: "Field To Complete Attendance" });
    // now update attendance
    attendance.leave_time = userLogOutTime;
    attendance.working_hours = workingTimeFormat;
    attendance.over_time = overtimeFormat;
    if (dailyReport && dailyReport !== '') attendance.daily_report = dailyReport;
    await attendance.save();
    return res.json(attendance);
};

// DONE
// this function is to work every 24 hour to get all users attendance and reset it
// every user that does not add attendance today, will add it as absent.
export const dailyAutoResetAttendance = async () => {
    // this Function Is Wrapped With SetInterval To Run Every 24 Hour
    const date = new Date();
    const today = date.toISOString().slice(0, 10); // 2021-08-01
    const yesterdayDate = new Date(date.setDate(date.getDate() - 1));
    const yesterday = yesterdayDate.toISOString().slice(0, 10); // 2021-08-01

    // !Important
    // SetTimeout to make sure that all users are added to database and server is Ready To Handle Requests
    setTimeout(async () => {
        const usersList = await getAllUsers();
        if (!usersList) return;
        // now loop throw all users and check if he has attendance yesterday
        usersList.forEach(async (user) => {
            let userJoiningDate = user.contract_date.toISOString().slice(0, 10);
            // if user is new, or there is no shift start or end data saved, then skip him
            if (userJoiningDate === today || !user.shift_start || !user.shift_end) return;
            // get user yesterdays attendance
            const attendance = await getByUserId(user.id, yesterday);
            // if user has attendance yesterday then skip him
            // if Not then add attendance as absent
            if (!attendance) {
                const CreateStartAttendanceData = {
                    user,
                    company: user.company,
                    late: null,
                    early: null,
                    absent: true,
                    userLogInTime: null,
                    shift_start: user.shift_start,
                    shift_end: user.shift_end,
                    lateTime: null,
                    earlyTime: null,
                    lateReason: '',
                    date: yesterday
                }
                await createStartAttendance(CreateStartAttendanceData)
            }
        })
    }, 5000)
}