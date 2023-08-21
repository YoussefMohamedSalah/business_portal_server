import { Request, Response } from 'express';
import { getAllDepartments, getById } from '../repositories/DepartmentRepository';



// DONE
export const getDepartmentById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const department = await getById(id);
    if (department) {
        return res.json(department);
    }
    return res.status(404).json({ msg: "Department not found" });
};

// DONE
export const getCompanyDepartments = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const departments = await getAllDepartments(companyId);
    if (departments) {
        return res.json(departments);
    }
    return res.status(404).json({ msg: "Departments not found" });
};
