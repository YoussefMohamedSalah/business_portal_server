import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateTender } from "../types/CreateTender";
import { Tender } from "../entities/Tender";

// DONE
export const createTender = async (
    createData: CreateTender,
    company: Company,
    user: { id: string, name: string }
) => {
    const { description, date, hand_over, files, comments } = createData;
    // create tender
    const tenderRepository = getRepository(Tender);
    const tender = new Tender();
    tender.description = description;
    tender.date = date;
    tender.hand_over = hand_over;
    tender.files = files;
    tender.comments = comments;
    tender.company = company;
    tender.user = user;
    await tenderRepository.save(tender);
    return tender;
};

// DONE
export const getById = async (id: string) => {
    const tenderRepository = getRepository(Tender);
    const tender = await tenderRepository
        .createQueryBuilder("tender")
        .where("tender.id = :id", { id: id })
        .getOne();
    return tender;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const tenderRepository = getRepository(Tender);
    const tenders = await tenderRepository
        .createQueryBuilder("tender")
        .where("tender.companyId = :companyId", { companyId: companyId })
        .orderBy("tender.createdAt", "DESC")
        .getMany();
    return tenders;
};