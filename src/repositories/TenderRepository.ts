import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateTender } from "../types/CreateTender";
import { Tender } from "../entities/Tender";

export const createTender = async (
    createData: CreateTender,
    company: Company,
    user: { id: string, name: string }
) => {
    const { description, date, hand_over, files, comments } = createData;
    try {
        const tenderRepository = getRepository(Tender);
        const tender = new Tender();
        if (files) tender.files = files;
        tender.description = description;
        tender.date = date;
        tender.hand_over = hand_over;
        tender.comments = comments;
        tender.company = company;
        tender.user = user;
        await tenderRepository.save(tender);
        return tender;
    } catch (error) {
        // Handle the error
        console.error("Error Creating Tender:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const tenderRepository = getRepository(Tender);
        const tender = await tenderRepository
            .createQueryBuilder("tender")
            .where("tender.id = :id", { id: id })
            .getOne();
        return tender;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tender:", error);
        return;
    }
};

export const getAllByCompanyId = async (companyId: string) => {
    try {
        const tenderRepository = getRepository(Tender);
        const tenders = await tenderRepository
            .createQueryBuilder("tender")
            .where("tender.companyId = :companyId", { companyId: companyId })
            .orderBy("tender.createdAt", "DESC")
            .getMany();
        return tenders;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Tenders:", error);
        return;
    }
};