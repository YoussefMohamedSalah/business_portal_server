import { getRepository } from "typeorm";
import { Company } from "../entities/Company";


// NOT DONE
export const getAllPoReq = async (id: string,) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .leftJoinAndSelect(
            "company.PurchaseOrderRequests",
            "purchase_order_request"
        )
        .getOne();
    return company?.PurchaseOrderRequests;
};

// DONE
export const getAllPcReq = async (id: string,) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .leftJoinAndSelect(
            "company.PettyCashRequests",
            "petty_cash_request"
        )
        .getOne();
    return company?.PettyCashRequests;
};

// DONE
export const getAllSiteReq = async (id: string,) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .leftJoinAndSelect(
            "company.SiteRequests",
            "site_request"
        )
        .getOne();
    return company?.SiteRequests;
};

// DONE
export const getAllMaterialReq = async (id: string,) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .leftJoinAndSelect(
            "company.MaterialRequests",
            "material_request"
        )
        .getOne();
    return company?.MaterialRequests;
};