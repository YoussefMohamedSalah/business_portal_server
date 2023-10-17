import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { createProject, getAllByCompanyId, getById } from '../repositories/ProjectRepository';
import { getById as getGroupById } from '../repositories/GroupRepository';
import { getAllProject_MaterialReq, getAllProject_PcReq, getAllProject_PoReq, getAllProject_SiteReq } from '../repositories/RequestsRepository';
import { addGroup, getGroupByProjectId } from '../repositories/GroupRepository';
import { validateUUID } from '../utils/validateUUID';
import { getById as getCustomerById } from '../repositories/CustomerRepository'
import { Customer } from '../entities/Customer';
import { processNumber } from '../utils/checkAndParse';
import { createChat } from '../repositories/ChatRepository';


export const allCompanyProjects = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const projects = await getAllByCompanyId(companyId);
        if (!projects) return res.status(404).json({ msg: "Projects not found" });
        return res.json(projects);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Projects:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const addProject = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const {
        name, description, latitude, longitude,
        bid_value, duration, delivery_date,
        contract_number, contract_date, po_budget,
        pc_budget, subcontractor_budget, staff_budget,
        total_budget, project_managers, sites_count,
        buildings_count, floors_count, project_status,
        customerId, members
    } = req.body;

    const projectThumbnail = req.file!;
    let createData = {
        name, description, latitude, longitude,
        bid_value, duration, delivery_date,
        contract_number, contract_date, po_budget,
        pc_budget, subcontractor_budget, staff_budget,
        total_budget, project_managers, sites_count,
        buildings_count, floors_count, project_status,
        customerId, members
    }
    try {
        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company Is Not Found" });

        let customer: Customer | undefined | null;
        if (customerId) customer = await getCustomerById(customerId!)
        if (!customer) return res.status(409).json({ msg: "Customer Is Not Found" });

        const project = await createProject(createData, projectThumbnail, customer, company);
        if (!project) return res.status(409).json({ msg: "Field To Create Project" });

        let groupMembers = createData.members || [];

        // we Need To create Group to add its id to the project
        let createGroupData = {}
        if (createData.project_managers && createData.project_managers > 0) {
            createGroupData = {
                name: `${project.name}'s Group`,
                description: `This is ${project.name}'s Group And This Group Responsible For ${groupMembers.length} Members To Work On ${createData.name} Project`,
                managers: createData.project_managers || [],
                members: groupMembers,
                company,
                project
            }
        } else {
            createGroupData = {
                name: `${project.name}'s Group`,
                description: `This is ${project.name}'s Group And This Group Responsible For ${groupMembers.length} Members.`,
                managers: [],
                members: groupMembers,
                company,
                project
            }
        }

        const group = await addGroup(createGroupData);
        if (!group) return res.status(409).json({ msg: "Field To Create Group" });

        const chat = await createChat(group);
        if (!chat) return res.status(409).json({ msg: "Field To Create Group Chat" });

        const selectedProject = await getById(project.id)
        if (selectedProject) {
            selectedProject.group = group;
            await selectedProject.save()
        }
        const selectedGroup = await getGroupById(group.id)
        if (selectedGroup) {
            selectedGroup.project = project;
            await selectedGroup.save();
        }

        return res.json(project);
    } catch (error) {
        // Handle the error
        console.error("Error Adding Project:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const project = await getById(id);
        if (!project) return res.status(404).json({ msg: "Project not found" });
        return res.json(project);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Project:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    const projectThumbnail = req.file!;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const project = await getById(id);
        if (!project) return res.status(404).json({ msg: "project not found" });

        const {
            name, description, latitude, longitude,
            bid_value, duration, delivery_date,
            contract_number,
            contract_date, po_budget, pc_budget,
            subcontractor_budget, staff_budget,
            total_budget, project_managers, sites_count,
            buildings_count, floors_count
        } = req.body;


        let toCheckType: { [key: string]: number | string | undefined } = {
            latitude: latitude && processNumber('latitude', latitude!),
            longitude: longitude && processNumber('longitude', longitude!),
            bid_value: bid_value && processNumber('bid_value', bid_value!),
            duration: duration && processNumber('duration', duration),
            po_budget: po_budget && processNumber('po_budget', po_budget!),
            pc_budget: pc_budget && processNumber('pc_budget', pc_budget!),
            subcontractor_budget: subcontractor_budget && processNumber('subcontractor_budget', subcontractor_budget!),
            staff_budget: staff_budget && processNumber('staff_budget', staff_budget!),
            buildings_count: buildings_count && processNumber('buildings_count', buildings_count!),
            total_budget: total_budget && processNumber('total_budget', total_budget!),
            sites_count: sites_count && processNumber('sites_count', sites_count!),
            floors_count: floors_count && processNumber('floors_count', floors_count!),
        };

        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        if (toCheckType.latitude && latitude) project.latitude = toCheckType.latitude as number;
        if (toCheckType.longitude && longitude) project.longitude = toCheckType.longitude as number;
        if (toCheckType.bid_value && bid_value) project.bid_value = toCheckType.bid_value as number;
        if (toCheckType.duration && duration) project.duration = toCheckType.duration as number;
        if (toCheckType.po_budget && po_budget) project.po_budget = toCheckType.po_budget as number;
        if (toCheckType.pc_budget && pc_budget) project.pc_budget = toCheckType.pc_budget as number;
        if (toCheckType.subcontractor_budget && subcontractor_budget) project.subcontractor_budget = toCheckType.subcontractor_budget as number;
        if (toCheckType.staff_budget && staff_budget) project.staff_budget = toCheckType.staff_budget as number;
        if (toCheckType.total_budget && total_budget) project.total_budget = toCheckType.total_budget as number;
        if (toCheckType.floors_count && floors_count) project.floors_count = toCheckType.floors_count as number;
        if (toCheckType.sites_count && sites_count) project.sites_count = toCheckType.sites_count as number;
        if (toCheckType.buildings_count && buildings_count) project.buildings_count = toCheckType.buildings_count as number;

        project.name = name ? name : project.name;
        project.description = description ? description : project.description;
        project.delivery_date = delivery_date ? delivery_date : project.delivery_date;
        project.contract_number = contract_number ? contract_number : project.contract_number;
        project.contract_date = contract_date ? contract_date : project.contract_date;
        project.project_managers = project_managers ? project_managers : project.project_managers;
        project.thumbnail = projectThumbnail ? projectThumbnail.path : project.thumbnail;
        await project.save();
        return res.json(project);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Project:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const addProjectComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, userName } = req.userData!;
    const { comment, createdAt } = req.body;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const project = await getById(id);
        if (!project) return res.status(404).json({ msg: "project not found" });
        let newCommentObj = {
            id: project.comments_count + 1,
            userId,
            userName,
            comment,
            createdAt
        }
        project.comments.unshift(newCommentObj)
        project.comments_count = project.comments_count + 1;
        await project.save();
        return res.json(project);
    } catch (error) {
        // Handle the error
        console.error("Error Adding Comment:", error);
        return;
    }
}

export const removeProjectComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { commentId } = req.body;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const project = await getById(id);
        if (!project) return res.status(404).json({ msg: "project not found" });
        let filteredComments = project.comments.filter((comment: any) => comment.id !== commentId);
        project.comments = filteredComments;
        project.comments_count = project.comments_count - 1;
        await project.save();
        return res.json(project);
    } catch (error) {
        // Handle the error
        console.error("Error Removing Comment:", error);
        return;
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params; let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const project = await getById(id);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        await project.remove();
        return res.json({ msg: "Project deleted" });
    } catch (error) {
        // Handle the error
        console.error("Error deleted Project:", error);
        return;
    }
}

export const getAllEmployeesByProjectId = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const group = await getGroupByProjectId(id);
        if (!group) return res.status(404).json({ msg: "Group Is Not Found" });
        return res.json(group.members);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Project's Members:", error);
        return;
    }
}

// ** This is Getting All Requests For The Project **
export const getAllProjectPoRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    try {
        const requests = await getAllProject_PoReq(projectId);
        if (!requests) return res.status(404).json({ msg: "Requests not found" });
        return res.json(requests);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Project's Po Requests:", error);
        return;
    }
};

export const getAllProjectPcRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    let isValidUUID = validateUUID(projectId);
    if (!isValidUUID) return res.status(400).json({ msg: "Project Id is not valid" });
    try {
        const company = await getAllProject_PcReq(projectId);
        if (company) {
            return res.json(company);
        }
        return res.status(404).json({ msg: "Requests not found" });
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Project's Pc Requests:", error);
        return;
    }
};

export const getAllProjectMaterialRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    let isValidUUID = validateUUID(projectId);
    if (!isValidUUID) return res.status(400).json({ msg: "Project Id is not valid" });
    try {
        const requests = await getAllProject_SiteReq(projectId);
        if (!requests) return res.status(404).json({ msg: "Requests not found" });
        return res.json(requests);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Project's Material Requests:", error);
        return;
    }
};

// DONE
export const getAllProjectSiteRequests = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    let isValidUUID = validateUUID(projectId);
    if (!isValidUUID) return res.status(400).json({ msg: "Project Id is not valid" });
    try {
        const requests = await getAllProject_MaterialReq(projectId);
        if (!requests) return res.status(404).json({ msg: "Requests not found" });
        return res.json(requests);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Project's Site Requests:", error);
        return;
    }
};