import { Request, Response } from 'express';
import { getDashboardAttendance } from '../repositories/DashboardRepository';
import { getById } from '../repositories/CompanyRepository';
import { getAllUsers } from '../repositories/UserRepository';

// DONE
export const dashboardAttendance = async (req: Request, res: Response) => {
    // attendance, total_employee, absent, left
    const { companyId } = req.userData!;
    const date = new Date();
    const today = date.toISOString().slice(0, 10); // 2021-08-01
    let employee_count = 0;
    let old_employee_count = 0;
    let new_employee_count = 0;
    let present = 0;
    let absent = 0;
    let late_count = 0;
    let early_count = 0;
    let male_count = 0;
    let female_count = 0;

    // getting Company Data
    const company = await getById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    employee_count = company.employee_count;
    male_count = company.male_count;
    female_count = company.female_count;

    // get all company users
    const usersList = await getAllUsers(companyId);
    if (!usersList) return res.status(404).json({ msg: "Users not found" });
    usersList.forEach((user) => {
        let userJoiningDate = user.contract_date
        if (userJoiningDate === today || !user.shift_start || !user.shift_end) {
            new_employee_count++;
        } else {
            old_employee_count++;
        }
    });

    // getting Today Attendance List
    const todayAttendanceList = await getDashboardAttendance(companyId);
    if (!todayAttendanceList) {
        return res.status(404).json({ msg: "Dashboard Attendance Is Not Found" });
    }

    present = todayAttendanceList.length;
    // if user is new then he is Not absent
    absent = old_employee_count - present;

    late_count = todayAttendanceList.filter((attendance) => attendance.late === true).length;
    early_count = todayAttendanceList.filter((attendance) => attendance.early === true).length;

    const dashboardData = { employee_count, present, absent, late_count, early_count, male_count, female_count }
    return res.status(200).json(dashboardData);
};
