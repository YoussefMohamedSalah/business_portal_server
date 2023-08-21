import { Request, Response } from 'express';
import { getAllPoReq, getAllPcReq, getAllSiteReq, getAllMaterialReq } from '../repositories/RequestsRepository';

// DONE
export const getAllPoRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const requests = await getAllPoReq(companyId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};

// DONE
export const getAllPcRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const company = await getAllPcReq(companyId);
    if (company) {
        return res.json(company);
    }
    return res.status(404).json({ msg: "company not found" });
};

// DONE
export const getAllMaterialRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const requests = await getAllSiteReq(companyId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};

// DONE
export const getAllSiteRequests = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const requests = await getAllMaterialReq(companyId);
    if (!requests) return res.status(404).json({ msg: "Requests not found" });
    return res.json(requests);
};
