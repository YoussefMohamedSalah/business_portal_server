import { Request, Response } from 'express';
import { getAllCompany_PoReq, getAllCompany_PcReq, getAllCompany_SiteReq, getAllCompany_MaterialReq, getPcById, getPoById, getMaterialById, getSiteById, getById, createPoRequest, createPcRequest, createMaterialRequest, createSiteRequest } from '../repositories/RequestsRepository';
import { getCompanyWithWorkflow } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { RequestType } from '../enums/enums';
import { validateUUID } from '../utils/validateUUID';
import { processNumber } from '../utils/checkAndParse';

// ** This Is Getting All Requests For The Company **
export const getAllPoRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const requests = await getAllCompany_PoReq(companyId);
        if (!requests) return res.status(404).json({ msg: "Requests not found" });
        return res.status(200).json(requests);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Requests:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getAllPcRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const requests = await getAllCompany_PcReq(companyId);
        if (!requests) return res.status(404).json({ msg: "Requests not found" });
        return res.status(200).json(requests);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Requests:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getAllMaterialRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const requests = await getAllCompany_MaterialReq(companyId);
        if (!requests) return res.status(404).json({ msg: "Requests not found" });
        return res.status(200).json(requests);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Requests:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getAllSiteRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const requests = await getAllCompany_SiteReq(companyId);
        if (!requests) return res.status(404).json({ msg: "Requests not found" });
        return res.status(200).json(requests);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Requests:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// ** This Is Getting One Requests For The Company By Id **
export const getRequestById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const { companyId } = req.userData!;
        const request = await getById(companyId, id);
        if (!request) return res.status(404).json({ msg: "Request not found" });
        return res.status(200).json(request);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// ** This Is Update And Delete One Requests For The Company By Id **
export const deleteRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const { companyId } = req.userData!;
        const request = await getById(companyId, id);
        if (!request) return res.status(404).json({ msg: "Request not found" });
        await request.remove();
        return res.status(404).json({ msg: "Request deleted" });
    } catch (error) {
        // Handle the error
        console.error("Error Deleting Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updatePcRequest = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { transaction_date, paid_amount, balance_payment, subject, description, status, vat, total } = req.body;
    try {
        let toCheckType: { [key: string]: number | string | undefined } = {
            balance_payment: balance_payment && processNumber('Balance Payment', balance_payment!),
            paid_amount: paid_amount && processNumber('Paid Amount', paid_amount!),
            vat: vat && processNumber('Vat', vat!),
            total: total && processNumber('Total', total!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        const request = await getPcById(companyId, id);
        if (!request) return res.status(404).json({ msg: "Request not found" });

        if (toCheckType.balance_payment) request.balance_payment = toCheckType.balance_payment as number;
        if (toCheckType.paid_amount) request.paid_amount = toCheckType.paid_amount as number;
        if (toCheckType.total) request.total = toCheckType.total as number;
        if (toCheckType.vat) request.vat = toCheckType.vat as number;

        request.transaction_date = transaction_date || request.transaction_date;
        request.subject = subject || request.subject;
        request.description = description || request.description;
        request.status = status || request.status;

        await request.save();
        return res.status(200).json(request);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updatePoRequest = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { subject, description, status, vat, total } = req.body;
    try {
        let toCheckType: { [key: string]: number | string | undefined } = {
            vat: vat && processNumber('Vat', vat!),
            total: total && processNumber('Total', total!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        const request = await getPoById(companyId, id);
        if (!request) return res.status(404).json({ msg: "Request not found" });
        if (toCheckType.total) request.total = toCheckType.total as number;
        if (toCheckType.vat) request.vat = toCheckType.vat as number;
        request.subject = subject || request.subject;
        request.description = description || request.description;
        request.status = status || request.status;
        await request.save();
        return res.status(200).json(request);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateMaterialRequest = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { items, subject, description, status } = req.body;
    try {
        const request = await getMaterialById(companyId, id);
        if (!request) return res.status(404).json({ msg: "Request not found" });
        request.items = items || request.items;
        request.subject = subject || request.subject;
        request.description = description || request.description;
        request.status = status || request.status;
        await request.save();
        return res.status(200).json(request);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateSiteRequest = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { items, subject, description, status } = req.body;
    try {
        const request = await getSiteById(companyId, id);
        if (!request) return res.status(404).json({ msg: "Request not found" });
        request.items = items || request.items;
        request.subject = subject || request.subject;
        request.description = description || request.description;
        request.status = status || request.status;
        await request.save();
        return res.status(200).json(request);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// ** This Is Creating New Requests For The Company By Request Type In Params **
export const createRequest = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { companyId, userId } = req.userData!;
    const { type, subject, description, vat, total, items } = req.body;
    try {

        let toCheckType: { [key: string]: number | string | undefined } = {
            total: total && processNumber('Total', total!),
            vat: vat && processNumber('Vat', vat!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        let createInput = {
            type,
            subject,
            description,
            total: toCheckType.total && toCheckType.total as number,
            vat: toCheckType.vat && toCheckType.vat as number,
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
            const createdRequest = await createPoRequest(createInput, company, user, project)
            if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
            request = createdRequest;
        } else if (type === RequestType.PETTY_CASH) {
            const createdRequest = await createPcRequest(createInput, company, user, project)
            if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
            request = createdRequest;
        } else if (type === RequestType.MATERIAL) {
            const createdRequest = await createMaterialRequest(createInput, company, user, project)
            if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
            request = createdRequest;
        } else if (type === RequestType.SITE) {
            const createdRequest = await createSiteRequest(createInput, company, user, project)
            if (!createdRequest) return res.status(404).json({ msg: "Field To Create Request" });
            request = createdRequest;
        }
        return res.status(200).json(request);
    } catch (error) {
        // Handle the error
        console.error("Error Creating Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};


