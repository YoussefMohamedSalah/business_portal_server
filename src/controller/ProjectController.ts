import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { CreateProjectInfo } from '../types/CreateProject';
import { createProject, getAllByCompanyId, getById } from '../repositories/ProjectRepository';
import { getAllProject_MaterialReq, getAllProject_PcReq, getAllProject_PoReq, getAllProject_SiteReq } from '../repositories/RequestsRepository';


// DONE
export const allCompanyProjects = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const projects = await getAllByCompanyId(companyId);
    if (!projects) {
        return res.status(404).json({ msg: "Projects not found" });
    }
    return res.json(projects);
};

// DONE
export const addProject = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const createData: CreateProjectInfo = req.body;
    // first get company by id
    if (!companyId) return res.status(400).json({ msg: "Company id is required" });
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
    if (!project) return res.status(404).json({ msg: "Project not found" });
    return res.json(project);
};

// DONE
export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const project = await getById(id);
    if (!project) {
        return res.status(404).json({ msg: "project not found" });
    }
    const {
        name, description, latitude, longitude,
        bid_value, duration, delivery_date,
        contract_number, contract_date, po_budget,
        pc_budget, subcontractor_budget, staff_budget,
        total_budget, project_manager, sites_count,
        buildings_count, floors_count, comments,
    } = req.body;
    project.name = name ? name : project.name;
    project.description = description ? description : project.description;
    project.latitude = latitude ? latitude : project.latitude;
    project.longitude = longitude ? longitude : project.longitude;
    project.bid_value = bid_value ? bid_value : project.bid_value;
    project.duration = duration ? duration : project.duration;
    project.delivery_date = delivery_date ? delivery_date : project.delivery_date;
    project.contract_number = contract_number ? contract_number : project.contract_number;
    project.contract_date = contract_date ? contract_date : project.contract_date;
    project.po_budget = po_budget ? po_budget : project.po_budget;
    project.pc_budget = pc_budget ? pc_budget : project.pc_budget;
    project.subcontractor_budget = subcontractor_budget ? subcontractor_budget : project.subcontractor_budget;
    project.staff_budget = staff_budget ? staff_budget : project.staff_budget;
    project.total_budget = total_budget ? total_budget : project.total_budget;
    project.project_manager = project_manager ? project_manager : project.project_manager;
    project.sites_count = sites_count ? sites_count : project.sites_count;
    project.buildings_count = buildings_count ? buildings_count : project.buildings_count;
    project.floors_count = floors_count ? floors_count : project.floors_count;
    if (comments) {
        project.comments = comments;
        project.comments_count = comments.length;
    }
    await project.save();
    return res.json(project);
};

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

// ** This is Getting All Requests For The Project **
// DONE
export const getAllProjectPoRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const requests = await getAllProject_PoReq(projectId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};

// DONE
export const getAllProjectPcRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const company = await getAllProject_PcReq(projectId);
    if (company) {
        return res.json(company);
    }
    return res.status(404).json({ msg: "company not found" });
};

// DONE
export const getAllProjectMaterialRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const requests = await getAllProject_SiteReq(projectId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};

// DONE
export const getAllProjectSiteRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const requests = await getAllProject_MaterialReq(projectId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};