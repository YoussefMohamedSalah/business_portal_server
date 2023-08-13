import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { CreateProjectInfo } from 'src/types/CreateProject';
import { createProject, getAllByCompanyId, getById } from '../repositories/ProjectRepository';

// DONE
export const addProject = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const createData: CreateProjectInfo = req.body;
    // first get company by id
    if (companyId) return res.status(400).json({ msg: "Company id is required" });
    const company = await getCompanyById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    // then create project
    const project = await createProject(createData, company);
    if (!project) return res.status(409).json({ msg: "Field To Create Project" });
    else return res.json(project);
};

// DONE
export const getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await getById(id);
    if (project) {
        return res.json(project);
    }
    return res.status(404).json({ msg: "Project not found" });
};

// DONE
// export const updateProjectItems = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const project = await getProjectItemsById(id);
//     if (!project) {
//         return res.status(404).json({ msg: "project not found" });
//     }
//     const { name, supplier_type, company_name, vat_on, Representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
//     customer.name = name ? name : customer.name;
//     await customer.save();
//     return res.json(customer);
// };

// DONE
export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await getById(id);
    if (!project) {
        return res.status(404).json({ msg: "Project not found" });
    }
    await project.remove();
    return res.json({ msg: "Project deleted" });
}

// DONE
export const allCompanyProjects = async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const projects = await getAllByCompanyId(companyId);
    if (!projects) {
        return res.status(404).json({ msg: "Projects not found" });
    }
    return res.json(projects);
};
