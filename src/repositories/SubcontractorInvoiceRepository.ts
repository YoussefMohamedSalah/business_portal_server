import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Status } from "../enums/enums";
import { SubcontractorInvoice } from "../entities/SubcontractorInvoice";


//** Create New Request **
export const createInvoice = async (data: any, company: Company, project: Project, user: User) => {
    const { items, conditions, date, total_value, vat, subcontractor, filesNameSetArray } = data;
    const invoiceRepository = getRepository(SubcontractorInvoice);
    const invoice = new SubcontractorInvoice();
    invoice.date = date;
    invoice.conditions = conditions;
    invoice.items = items;
    invoice.total_value = total_value;
    invoice.vat = vat;
    invoice.status = Status.PENDING;
    invoice.work_flow = company.workFlow.subcontractor_invoice_flow;
    if (filesNameSetArray) invoice.files = filesNameSetArray;
    invoice.user = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
    };
    invoice.project_details = {
        id: project.id,
        name: project.name,
    };
    invoice.subcontractor_details = {
        id: subcontractor.id,
        name: subcontractor.representative ? subcontractor.representative : subcontractor.company_name,
    };
    invoice.company = company;
    invoice.project = project;
    invoice.subcontractor = subcontractor;
    await invoiceRepository.save(invoice);
    return invoice;
}

export const getAllCompanySubcontractorInvoices = async (id: string,) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .leftJoinAndSelect(
            "company.subcontractorInvoices",
            "subcontractor_invoice"
        )
        .getOne();
    return company?.subcontractorInvoices;
};

export const getAllCompany_pending_subcontractorInvoices = async (companyId: string,) => {
    const subcontractorInvoiceRepository = getRepository(SubcontractorInvoice);
    const invoices = await subcontractorInvoiceRepository
        .createQueryBuilder("subcontractor_invoice")
        .where("subcontractor_invoice.companyId = :companyId", { companyId: companyId })
        .andWhere('subcontractor_invoice.status = :status', { status: Status.PENDING })
        .getMany();
    return invoices;
};

export const getAllProjectSubcontractorInvoices = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.subcontractorInvoices",
            "subcontractor_invoice"
        )
        .getOne();
    return project?.subcontractorInvoices;
};

export const getById = async (id: string) => {
    const subcontractorInvoiceRepository = getRepository(SubcontractorInvoice);
    const invoice = await subcontractorInvoiceRepository
        .createQueryBuilder("subcontractor_invoice")
        .where("subcontractor_invoice.id = :id", { id: id })
        .getOne();
    return invoice;
}



