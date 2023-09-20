import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { RequestWorkFlow } from "../entities/RequestWorkFlow";


// DONE
export const getById = async (id: string) => {
    const workflowRepository = getRepository(RequestWorkFlow);
    const workflow = await workflowRepository
        .createQueryBuilder("request_work_flow")
        .where("request_work_flow.id = :id", { id: id })
        .getOne();
    return workflow;
}

// DONE
export const getByCompanyId = async (companyId: string) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: companyId })
        .leftJoinAndSelect(
            "company.workFlow",
            "request_work_flow"
        )
        .getOne();
    return company;
}













// // ** This Is Getting All Requests For The Company **
// // NOT DONE
// export const getAllCompany_PoReq = async (id: string,) => {
//     const companyRepository = getRepository(Company);
//     const company = await companyRepository
//         .createQueryBuilder("company")
//         .where("company.id = :id", { id: id })
//         .leftJoinAndSelect(
//             "company.PurchaseOrderRequests",
//             "purchase_order_request"
//         )
//         .getOne();
//     return company?.PurchaseOrderRequests;
// };

// // DONE
// export const getAllCompany_PcReq = async (id: string,) => {
//     const companyRepository = getRepository(Company);
//     const company = await companyRepository
//         .createQueryBuilder("company")
//         .where("company.id = :id", { id: id })
//         .leftJoinAndSelect(
//             "company.PettyCashRequests",
//             "petty_cash_request"
//         )
//         .getOne();
//     return company?.PettyCashRequests;
// };

// // DONE
// export const getAllCompany_SiteReq = async (id: string,) => {
//     const companyRepository = getRepository(Company);
//     const company = await companyRepository
//         .createQueryBuilder("company")
//         .where("company.id = :id", { id: id })
//         .leftJoinAndSelect(
//             "company.SiteRequests",
//             "site_request"
//         )
//         .getOne();
//     return company?.SiteRequests;
// };

// // DONE
// export const getAllCompany_MaterialReq = async (id: string,) => {
//     const companyRepository = getRepository(Company);
//     const company = await companyRepository
//         .createQueryBuilder("company")
//         .where("company.id = :id", { id: id })
//         .leftJoinAndSelect(
//             "company.MaterialRequests",
//             "material_request"
//         )
//         .getOne();
//     return company?.MaterialRequests;
// };

