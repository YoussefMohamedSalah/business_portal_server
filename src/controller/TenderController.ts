import { Request, Response } from 'express';
import { createTender, getAllByCompanyId, getById } from '../repositories/TenderRepository';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { CreateTender } from '../types/CreateTender';
import { validateUUID } from '../utils/validateUUID';
import { checkAndParse } from '../utils/checkAndParse';

export const addTender = async (req: Request, res: Response) => {
    const { companyId, userId, userName } = req.userData!;
    const { description, date, hand_over, comments, filesNameSet } = req.body;

    const createData: CreateTender = {
        description: 'Tender Description',
        date: '',
        hand_over: '',
        comments: [],
        files: filesNameSet?.split(',')! || []
    };

    try {
        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });
        let user = { id: userId, name: userName };
        if (description) createData.description = description;
        if (date) createData.date = date;
        if (hand_over) createData.hand_over = hand_over;
        if (comments) createData.comments = checkAndParse(comments!);
        const tender = await createTender(createData, company, user);
        if (!tender) return res.status(409).json({ msg: "Field To Create Tender" });
        else return res.json(tender);
    } catch (error) {
        // Handle the error
        console.error("Error Adding Tender:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getTenderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const tender = await getById(id);
        if (tender) {
            return res.json(tender);
        }
        return res.status(404).json({ msg: "Tender not found" });
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tender:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateTender = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { description, date, hand_over, filesNameSet, comments, status } = req.body;

    try {
        const tender = await getById(id);
        if (!tender) return res.status(404).json({ msg: "Tender not found" });
        if (filesNameSet) tender.files = filesNameSet ? [...tender.files, ...filesNameSet] : tender.files;
        if (comments) tender.comments = checkAndParse(comments!);
        tender.description = description;
        tender.hand_over = hand_over ? hand_over : tender.hand_over;
        tender.status = status ? status : tender.status;
        tender.date = date ? date : tender.date;
        await tender.save();
        return res.json(tender);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tender:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteTender = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const tender = await getById(id);
        if (!tender) return res.status(404).json({ msg: "Tender not found" });
        await tender.remove();
        return res.json({ msg: "Tender deleted" });
    } catch (error) {
        // Handle the error
        console.error("Error Deleting Tender:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

export const getCompanyTenders = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const tenders = await getAllByCompanyId(companyId);
        return res.json(tenders);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tenders:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
