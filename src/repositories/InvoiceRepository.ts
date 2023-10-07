import { getRepository } from "typeorm";
import { Project } from "../entities/Project";
import { Status } from "../enums/enums";
import { Contract } from "../entities/Contract";
import { Invoice } from "../entities/Invoice";
import { processNumber } from "../utils/checkAndParse";


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

    try {
        let toCheckType: { [key: string]: number | string | undefined } = {
            total_amount: total_amount && processNumber('Total Amount', total_amount!),
            paid_amount: paid_amount && processNumber('Paid Amount', paid_amount!),
            remaining_amount: remaining_amount && processNumber('Remaining Amount', remaining_amount!),
            vat: vat && processNumber('Vat', vat!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        const invoiceRepository = getRepository(Invoice);
        const invoice = new Invoice();
        if (toCheckType.total_amount) invoice.total_amount = toCheckType.total_amount as number;
        if (toCheckType.paid_amount) invoice.paid_amount = toCheckType.paid_amount as number;
        if (toCheckType.remaining_amount) invoice.remaining_amount = toCheckType.remaining_amount as number;
        if (toCheckType.vat) invoice.vat = toCheckType.vat as number;

        invoice.items = items;
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
    } catch (error) {
        // Handle the error
        console.error("Error Creating Invoice:", error);
        return;
    }
}

export const getAllContractInvoices = async (id: string,) => {
    try {
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
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Invoice:", error);
        return;
    }
};

export const getAllCompany_pending_Invoices = async (companyId: string,) => {
    try {
        const ContractRepository = getRepository(Invoice);
        const invoices = await ContractRepository
            .createQueryBuilder("invoice")
            .where("invoice.companyId = :companyId", { companyId: companyId })
            .andWhere('invoice.status = :status', { status: Status.PENDING })
            .getMany();
        return invoices;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Invoices:", error);
        return;
    }
};

export const getAllProjectInvoices = async (id: string,) => {
    try {
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
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Invoices:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const ContractRepository = getRepository(Invoice);
        const contract = await ContractRepository
            .createQueryBuilder("invoice")
            .where("invoice.id = :id", { id: id })
            .getOne();
        return contract;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Invoices:", error);
        return;
    }
}



