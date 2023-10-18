import { Request, Response } from 'express';
import { getAllDepartments, getById } from '../repositories/DepartmentRepository';
import { validateUUID } from '../utils/validateUUID';


export const getDepartmentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const department = await getById(id);
        if (!department) return res.status(404).json({ msg: "Department not found" });
        return res.status(200).json(department);
    } catch (error) {
        console.error("Error Retrieving Department:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }

};
export const getCompanyDepartments = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const departments = await getAllDepartments(companyId);
        if (departments) {
            return res.status(200).json(departments);
        }
        return res.status(404).json({ msg: "Departments not found" });
    } catch (error) {
        console.error("Error Retrieving Departments:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
