import { Request, Response } from 'express';
import { getAllCompany_PoReq, getAllCompany_PcReq, getAllCompany_SiteReq, getAllCompany_MaterialReq, getPcById, getPoById, getMaterialById, getSiteById, getById } from '../repositories/RequestsRepository';


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
    const company = await getAllCompany_PcReq(companyId);
    if (company) {
        return res.json(company);
    }
    return res.status(404).json({ msg: "company not found" });
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

export const getRequestById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { companyId } = req.userData!;
    const request = await getById(companyId, id);
    if (!request) {
        return res.status(404).json({ msg: "Request not found" });
    }
    return res.json(request);
};












export const deleteRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { companyId } = req.userData!;
    const request = await getById(companyId, id);
    if (!request) return res.status(404).json({ msg: "Request not found" });
    await request.remove();
    return res.json({ msg: "Request deleted" });
};



// DONE
export const updatePcRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
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