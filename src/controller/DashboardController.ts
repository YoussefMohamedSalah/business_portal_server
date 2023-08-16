import { Request, Response } from 'express';
import { getDashboardAttendance } from '../repositories/DashboardRepository';

// DONE
export const dashboardAttendance = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const dashboardAttendance = await getDashboardAttendance(companyId);
    if (!dashboardAttendance) {
        return res.status(404).json({ msg: "Dashboard Attendance Is Not Found" });
    }
    return res.json(dashboardAttendance);
};
