import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Status } from "../enums/enums";
import { Contract } from "../entities/Contract";
import { Invoice } from "../entities/Invoice";


//** Create New Request **
export const createInvoice = async (data: any, contract: Contract,) => {
    const {
        total_amount,
        paid_amount,
        remaining_amount,
        subject,
        description,
        items,
        vat,
    } = data;
    const invoiceRepository = getRepository(Invoice);
    const invoice = new Invoice();
    invoice.total_amount = total_amount;
    invoice.paid_amount = paid_amount;
    invoice.remaining_amount = remaining_amount;
    invoice.items = items;
    invoice.vat = vat;
    invoice.subject = subject;
    invoice.description = description;
    invoice.status = Status.PENDING;
    invoice.user = contract.user;
    invoice.project_details = contract.project_details;
    invoice.company = contract.company;
    invoice.project = contract.project;
    invoice.subcontractor = contract.subcontractor;
    await invoiceRepository.save(invoice);
    return invoice;
}

export const getAllContractInvoices = async (id: string,) => {
    const ContractRepository = getRepository(Contract);
    const contract = await ContractRepository
        .createQueryBuilder("contract")
        .where("contract.id = :id", { id: id })
        .leftJoinAndSelect(
            "contract.invoices",
            "invoice"
        )
        .getOne();
    return contract?.invoices;
};

export const getAllCompany_pending_Invoices = async (companyId: string,) => {
    const ContractRepository = getRepository(Invoice);
    const invoices = await ContractRepository
        .createQueryBuilder("invoice")
        .where("invoice.companyId = :companyId", { companyId: companyId })
        .andWhere('invoice.status = :status', { status: Status.PENDING })
        .getMany();
    return invoices;
};

export const getAllProjectInvoices = async (id: string,) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .leftJoinAndSelect(
            "project.invoices",
            "invoice"
        )
        .getOne();
    return project?.invoices;
};

export const getById = async (id: string) => {
    const ContractRepository = getRepository(Invoice);
    const contract = await ContractRepository
        .createQueryBuilder("invoice")
        .where("invoice.id = :id", { id: id })
        .getOne();
    return contract;
}



