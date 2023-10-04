import { Request, Response } from 'express';
import { getCompanyWithWorkflow } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { validateUUID } from '../utils/validateUUID';
import { createContract, getAllCompanySubcontractorContracts, getById, getAllProjectSubcontractorContracts } from '../repositories/SubcontractorContractRepository';


export const addContract = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    let isValidUUID = validateUUID(projectId);
    if (!isValidUUID) return res.status(400).json({ msg: "project Id is not valid" });
    const { companyId, userId } = req.userData!;
    const { subcontractor, items, conditions, date, vat, total_value, filesNameSet } = req.body;

    const contractFiles = req.files!;

    let conditionsObj;
    let itemsObj;
    let subcontractorObj;
    let filesNameSetArray;

    if (contractFiles) {
        conditionsObj = JSON.parse(conditions);
        itemsObj = JSON.parse(items);
        subcontractorObj = JSON.parse(subcontractor);
        if (filesNameSet) filesNameSetArray = filesNameSet.split(',')
    } else {
        conditionsObj = conditions;
        itemsObj = items;
        subcontractorObj = subcontractor;
        filesNameSetArray = []
    }

    let createInput = {
        subcontractor: subcontractorObj,
        items: itemsObj,
        conditions: conditionsObj,
        date,
        vat,
        total_value,
        filesNameSetArray
    }

    const company = await getCompanyWithWorkflow(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const project = await getProjectById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const contract = await createContract(createInput, company, project, user)
    if (!contract) return res.status(404).json({ msg: "Field To Create Contract" });
    return res.json(contract);
};

// DONE
export const getAllContractsByCompany = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const contracts = await getAllCompanySubcontractorContracts(companyId);
    if (!contracts) return res.status(404).json({ msg: "Contracts not found" });
    return res.json(contracts);
};

// DONE
export const getAllContractsByProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const contracts = await getAllProjectSubcontractorContracts(projectId);
    if (!contracts) return res.status(404).json({ msg: "Contracts not found" });
    return res.json(contracts);
};

// DONE
export const getContractById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const contract = await getById(id);
    if (!contract) {
        return res.status(404).json({ msg: "Contract not found" });
    }
    return res.json(contract);
};

// DONE
export const deleteContract = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const contract = await getById(id);
    if (!contract) return res.status(404).json({ msg: "Contract not found" });
    await contract.remove();
    return res.json({ msg: "Contract deleted" });
};

// DONE
export const updateContract = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });

    const contract = await getById(id);
    if (!contract) return res.status(404).json({ msg: "Contract not found" });
    const { date, conditions, items, total_value, status, work_flow, vat } = req.body;
    contract.date = date ? date : contract.date;
    contract.conditions = conditions ? conditions : contract.conditions;
    contract.items = items ? items : contract.items;
    contract.total_value = total_value ? total_value : contract.total_value;
    contract.status = status ? status : contract.status;
    contract.status = status ? status : contract.status;
    contract.work_flow = work_flow ? work_flow : contract.work_flow;
    contract.vat = vat ? vat : contract.vat;

    await contract.save();
    return res.json(contract);
};





