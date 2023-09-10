import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Project } from "../entities/Project";
import { PurchaseOrderRequest } from "../entities/PurchaseOrderRequest";
import { MaterialRequest } from "../entities/MaterialRequest";
import { SiteRequest } from "../entities/SiteRequest";
import { PettyCashRequest } from "../entities/PettyCashRequest";
import { User } from "../entities/User";
import { Status } from "../enums/enums";

// ** This Is Getting All Requests For The Company **
// NOT DONE
export const getAllCompany_PoReq = async (id: string,) => {
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
export const getAllCompany_PcReq = async (id: string,) => {
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
export const getAllCompany_SiteReq = async (id: string,) => {
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
export const getAllCompany_MaterialReq = async (id: string,) => {
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

// -------------------------------------------------------

// ** This Is Getting All Requests For The Project **
// NOT DONE
export const getAllProject_PoReq = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.PurchaseOrderRequests",
            "purchase_order_request"
        )
        .getOne();
    return project?.PurchaseOrderRequests;
};

// DONE
export const getAllProject_PcReq = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.PettyCashRequests",
            "petty_cash_request"
        )
        .getOne();
    return project?.PettyCashRequests;
};

// DONE
export const getAllProject_SiteReq = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.SiteRequests",
            "site_request"
        )
        .getOne();
    return project?.SiteRequests;
};

// DONE
export const getAllProject_MaterialReq = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.MaterialRequests",
            "material_request"
        )
        .getOne();
    return project?.MaterialRequests;
};

// ** Get By Id **
export const getById = async (companyId: string, id: string) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: companyId })
        .leftJoinAndSelect(
            "company.PurchaseOrderRequests",
            "purchase_order_request"
        )
        .leftJoinAndSelect(
            "company.PettyCashRequests",
            "petty_cash_request"
        )
        .leftJoinAndSelect(
            "company.SiteRequests",
            "site_request"
        )
        .leftJoinAndSelect(
            "company.MaterialRequests",
            "material_request"
        )
        .getOne();
    if (!company) return null;
    const allRequests = [...company?.PurchaseOrderRequests, ...company?.PettyCashRequests, ...company?.SiteRequests, ...company?.MaterialRequests];
    let selectedRequest = allRequests.find(request => request.id === id);
    return selectedRequest;
}
export const getPcById = async (companyId: string, id: string) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: companyId })
        .leftJoinAndSelect(
            "company.PettyCashRequests",
            "petty_cash_request"
        )
        .getOne();
    if (!company) return null;
    const allRequests = [...company?.PettyCashRequests];
    let selectedRequest = allRequests.find(request => request.id === id);
    return selectedRequest;
};
export const getPoById = async (companyId: string, id: string) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: companyId })
        .leftJoinAndSelect(
            "company.PurchaseOrderRequests",
            "purchase_order_request"
        )
        .getOne();
    if (!company) return null;
    const allRequests = [...company?.PurchaseOrderRequests];
    let selectedRequest = allRequests.find(request => request.id === id);
    return selectedRequest;
};
export const getMaterialById = async (companyId: string, id: string) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: companyId })
        .leftJoinAndSelect(
            "company.MaterialRequests",
            "material_request"
        )
        .getOne();
    if (!company) return null;
    const allRequests = [...company?.MaterialRequests];
    let selectedRequest = allRequests.find(request => request.id === id);
    return selectedRequest;
};
export const getSiteById = async (companyId: string, id: string) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: companyId })
        .leftJoinAndSelect(
            "company.SiteRequests",
            "site_request"
        )
        .getOne();
    if (!company) return null;
    const allRequests = [...company?.SiteRequests];
    let selectedRequest = allRequests.find(request => request.id === id);
    return selectedRequest;
};

//** Create New Request **
export const createPoRequest = async (data: any, company: Company, user: User, project: Project) => {
    const { type, subject, description, vat, total } = data;
    const requestRepository = getRepository(PurchaseOrderRequest);
    const request = new PurchaseOrderRequest();
    request.type = type;
    request.subject = subject;
    request.description = description;
    request.vat = vat;
    request.total = total;
    request.status = Status.PENDING;
    request.work_flow = company.workFlow.purchase_order_flow;
    request.user = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
    };
    request.project_details = {
        id: project.id,
        name: project.name,
    };
    request.project = project;
    request.company = company;
    await requestRepository.save(request);
    return request;
}
export const createPcRequest = async (data: any, company: Company, user: User, project: Project) => {
    const { type, subject, description, vat, total } = data;
    const requestRepository = getRepository(PettyCashRequest);
    const request = new (PettyCashRequest);
    request.type = type;
    request.subject = subject;
    request.description = description;
    request.vat = vat;
    request.total = total;
    request.status = Status.PENDING;
    request.work_flow = company.workFlow.petty_cash_request_flow;
    request.user = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
    };
    request.project_details = {
        id: project.id,
        name: project.name,
    };
    request.project = project;
    request.company = company;
    await requestRepository.save(request);
    return request;
}
export const createMaterialRequest = async (data: any, company: Company, user: User, project: Project) => {
    const { subject, description } = data;
    const requestRepository = getRepository(MaterialRequest);
    const request = new MaterialRequest();
    request.subject = subject;
    request.description = description;
    request.status = Status.PENDING;
    request.work_flow = company.workFlow.material_request_flow;
    request.user = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
    };
    request.project_details = {
        id: project.id,
        name: project.name,
    };
    request.project = project;
    request.company = company;

    await requestRepository.save(request);
    return request;
}
export const createSiteRequest = async (data: any, company: Company, user: User, project: Project) => {
    const requestRepository = getRepository(SiteRequest);
    const request = new SiteRequest();
    request.subject = data.subject ? data.subject : request.subject;
    request.description = data.description ? data.description : request.description;
    request.status = Status.PENDING;
    request.items = data.items ? data.items : request.items;
    request.work_flow = company.workFlow.site_request_flow;
    request.user = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
    };
    request.project = project;
    request.company = company;
    await requestRepository.save(request);
    return request;
}