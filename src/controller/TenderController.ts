import { Request, Response } from 'express';
import { createTender, getAllByCompanyId, getById } from '../repositories/TenderRepository';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { CreateTender } from '../types/CreateTender';
import { validateUUID } from '../utils/validateUUID';

// DONE
export const addTender = async (req: Request, res: Response) => {
    const { companyId, userId, userName } = req.userData!;
    const createData: CreateTender = req.body;
    // first get company by id
    const company = await getCompanyById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    // then create Tender
    let user = { id: userId, name: userName };
    const tender = await createTender(createData, company, user);
    if (!tender) return res.status(409).json({ msg: "Field To Create Tender" });
    else return res.json(tender);
};

// DONE
export const getTenderById = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const tender = await getById(id);
    if (tender) {
        return res.json(tender);
    }
    return res.status(404).json({ msg: "Tender not found" });
};

// DONE
export const updateTender = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const tender = await getById(id);
    if (!tender) return res.status(404).json({ msg: "Tender not found" });

    const { description, date, hand_over, files, comments, status } = req.body;
    tender.description = description;
    tender.date = date ? date : tender.date;
    tender.hand_over = hand_over ? hand_over : tender.hand_over;
    tender.files = files ? files : tender.files;
    tender.comments = comments ? comments : tender.comments;
    tender.status = status ? status : tender.status;
    await tender.save();
    return res.json(tender);
};

// DONE
export const deleteTender = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const tender = await getById(id);
    if (!tender) {
        return res.status(404).json({ msg: "Tender not found" });
    }
    await tender.remove();
    return res.json({ msg: "Tender deleted" });
}

// DONE
export const getCompanyTenders = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const tenders = await getAllByCompanyId(companyId);
    return res.json(tenders);
};
