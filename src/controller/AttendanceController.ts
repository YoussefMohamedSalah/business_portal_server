import { Request, Response } from 'express';
import { getAllUsers, getById, getUserAndCompanyById } from '../repositories/UserRepository';
import { handleStartWork, handleEndWork, parseTime } from '../utils/handleAttendance';
import { createStartAttendance, getAllToReset, getByUserId } from '../repositories/AttendanceRepository';
// 

// DONE
export const getAttendanceStatus = async (req: Request, res: Response) => {
    const { userId } = req.userData!;
    if (!userId) return res.status(200).json({ msg: "User not found" });
    const today = new Date().toISOString().slice(0, 10) // 2021-08-01
    let attendanceStatus: any = {};
    const user = await getById(userId);
    if (!user) return res.status(200).json({ msg: "User not found" });
    // check if user has shift and What is it
    const { shift_start, shift_end } = user
    if (shift_start === null || shift_end === null) return res.status(200).json({ msg: "You'r Shifts not found" });
    // now check if user already done attendance today
    const existingAttendance = await getByUserId(userId, today);
    // if (existingAttendance) return res.status(409).json({ msg: "You Already Start Attendance Today" });
    if (!existingAttendance) {
        attendanceStatus = {
            status: false,
            shift_start: user.shift_start,
            shift_end: user.shift_end,
        }
    } else {
        let shiftEndHour = shift_end.split(':')[0];
        let shiftEndMinute = shift_end.split(':')[1];
        let shiftStartHour = shift_start.split(':')[0];
        let shiftStartMinute = shift_start.split(':')[1];
        let totalShiftHour = parseInt(shiftEndHour) - parseInt(shiftStartHour);
        let totalShiftMinute = parseInt(shiftEndMinute) - parseInt(shiftStartMinute);
        let stringTotalShiftHour = totalShiftHour < 10 ? `0${totalShiftHour}` : totalShiftHour.toString();;
        let stringTotalShiftMinute = totalShiftMinute < 10 ? `0${totalShiftMinute}` : totalShiftMinute.toString();;
        attendanceStatus = {
            status: true,
            ...existingAttendance,
            total_Shift_Hours: `${stringTotalShiftHour}:${stringTotalShiftMinute}:00`,
        }
    }
    return res.json(attendanceStatus)
}

// DONE
export const addStartAttendance = async (req: Request, res: Response) => {
    const { lateReason } = req.body;
    const { userId } = req.userData!;
    const date = new Date();
    const stringDate = new Date().toISOString().slice(0, 10) // 2021-08-01

    // format login time
    let loginHour: string = date.getHours().toString();
    let loginMinute: string = date.getMinutes().toString();
    if (date.getHours() < 10) loginHour = `0${loginHour}`;
    if (date.getMinutes() < 10) loginMinute = `0${loginMinute}`;
    const userLogInTime = loginHour + ':' + loginMinute; //16:15
    // check if user exist
    const user = await getUserAndCompanyById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    // check if user has shift and What is it
    const { shift_start, shift_end } = user
    if (!shift_start || !shift_end) return res.status(404).json({ msg: "You'r Shift not found" });
    // now check if user already done attendance today
    const existingAttendance = await getByUserId(userId, stringDate);
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
    const { userId } = req.userData!;
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
    const attendance = await getByUserId(userId, stringDate);
    if (!attendance) return res.json({ msg: "User Attendance not found" });
    const { shift_start, shift_end, enter_time, leave_time } = attendance
    // check if user already done attendance today
    if (leave_time) return res.json({ msg: "You Already Done Attendance Today" });
    // Calculate Working Hours
    const workingHoursData = handleEndWork(shift_start, shift_end, enter_time, userLogOutTime)
    if (!workingHoursData) return res.json({ msg: "Field To Complete Attendance" });
    const { workingTimeFormat, overtimeFormat } = workingHoursData;
    // now if workingTimeFormat is '00:00' then user is trying to end work before start work time
    if ('00:00' === workingTimeFormat) return res.json({ msg: "Field To Complete Attendance" });
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
        // !Important
        // empty string to get all users in every company
        const usersList = await getAllUsers('');
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