import { Request, Response } from 'express';
import { getAllCompany_PoReq, getAllCompany_PcReq, getAllCompany_SiteReq, getAllCompany_MaterialReq, getPcById, getPoById, getMaterialById, getSiteById, getById, createPoRequest, createPcRequest, createMaterialRequest, createSiteRequest } from '../repositories/RequestsRepository';
import { getCompanyWithWorkflow } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { RequestType } from '../enums/enums';
import { validateUUID } from '../utils/validateUUID';

// ** This Is Getting All Requests For The Company **
// DONE
export const getAllPoRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const requests = await getAllCompany_PoReq(companyId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};

// DONE
export const getAllPcRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const requests = await getAllCompany_PcReq(companyId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};

// DONE
export const getAllMaterialRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const requests = await getAllCompany_MaterialReq(companyId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};

// DONE
export const getAllSiteRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const requests = await getAllCompany_SiteReq(companyId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};


// ** This Is Getting One Requests For The Company By Id **
// DONE
export const getRequestById = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { companyId } = req.userData!;
    const request = await getById(companyId, id);
    if (!request) {
        return res.status(404).json({ msg: "Request not found" });
    }
    return res.json(request);
};

// ** This Is Update And Delete One Requests For The Company By Id **
// DONE
export const deleteRequest = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { companyId } = req.userData!;
    const request = await getById(companyId, id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    await request.remove();
    return res.json({ msg: "Request deleted" });
};

// DONE
export const updatePcRequest = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { companyId } = req.userData!;
    const request = await getPcById(companyId, id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    const { transaction_date, paid_amount, balance_payment, subject, description, status, vat, total } = req.body;
    request.transaction_date = transaction_date ? transaction_date : request.transaction_date;
    request.paid_amount = paid_amount ? paid_amount : request.paid_amount;
    request.balance_payment = balance_payment ? balance_payment : request.balance_payment;
    request.subject = subject ? subject : request.subject;
    request.description = description ? description : request.description;
    request.status = status ? status : request.status;
    request.vat = vat ? vat : request.vat;
    request.total = total ? total : request.total;

    await request.save();
    return res.json(request);
};

// DONE
export const updatePoRequest = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { companyId } = req.userData!;
    const request = await getPoById(companyId, id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    const { subject, description, status, vat, total } = req.body;
    request.subject = subject ? subject : request.subject;
    request.description = description ? description : request.description;
    request.status = status ? status : request.status;
    request.vat = vat ? vat : request.vat;
    request.total = total ? total : request.total;
    await request.save();
    return res.json(request);
};

// DONE
export const updateMaterialRequest = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { companyId } = req.userData!;

    const request = await getMaterialById(companyId, id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    const { items, subject, description, status } = req.body;
    request.items = items ? items : request.items;
    request.subject = subject ? subject : request.subject;
    request.description = description ? description : request.description;
    request.status = status ? status : request.status;

    await request.save();
    return res.json(request);
};

// DONE
export const updateSiteRequest = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { companyId } = req.userData!;
    const request = await getSiteById(companyId, id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    const { items, subject, description, status } = req.body;
    request.items = items ? items : request.items;
    request.subject = subject ? subject : request.subject;
    request.description = description ? description : request.description;
    request.status = status ? status : request.status;
    await request.save();
    return res.json(request);
};

// ** This Is Creating New Requests For The Company By Request Type In Params **

export const createRequest = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { companyId, userId } = req.userData!;
    const { type, subject, description, vat, total, items } = req.body;
    let data = {
        type,
        subject,
        description,
        vat,
        total,
        items
    }
    const company = await getCompanyWithWorkflow(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const project = await getProjectById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });


    let request;
    if (type === RequestType.PURCHASE_ORDER) {
        const createdRequest = await createPoRequest(data, company, user, project)
        if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
        request = createdRequest;
    } else if (type === RequestType.PETTY_CASH) {
        const createdRequest = await createPcRequest(data, company, user, project)
        if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
        request = createdRequest;
    } else if (type === RequestType.MATERIAL) {
        const createdRequest = await createMaterialRequest(data, company, user, project)
        if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
        request = createdRequest;
    } else if (type === RequestType.SITE) {
        const createdRequest = await createSiteRequest(data, company, user, project)
        if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
        request = createdRequest;
    }
    return res.json(request);
};


