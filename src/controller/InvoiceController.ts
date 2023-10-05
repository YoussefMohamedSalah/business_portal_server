import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { validateUUID } from '../utils/validateUUID';
import { createInvoice, getAllContractInvoices, getById } from '../repositories/InvoiceRepository';
import { getById as getContractById } from '../repositories/ContractRepository'

export const addInvoice = async (req: Request, res: Response) => {
    const { contractId } = req.params;
    let isValidUUID = validateUUID(contractId);
    if (!isValidUUID) return res.status(400).json({ msg: "contract Id is not valid" });

    // const { companyId } = req.userData!;
    const {
        total_amount,
        paid_amount,
        remaining_amount,
        subject,
        description,
        items,
        vat,
    } = req.body;

    // const user = await getUserById(userId);
    // if (!user) return res.status(404).json({ msg: "User not found" });

    const contract = await getContractById(contractId);
    if (!contract) return res.status(404).json({ msg: "Contract not found" });

    // const company = await getCompanyById(companyId);
    // if (!company) return res.status(404).json({ msg: "Company not found" });

    let createInput = {
        total_amount,
        paid_amount,
        remaining_amount,
        subject,
        description,
        items,
        vat,
    }

    const invoice = await createInvoice(createInput, contract)
    if (!invoice) return res.status(404).json({ msg: "Field To Create Invoice" });
    return res.json(invoice);
};

// DONE
export const getAllInvoicesByContract = async (req: Request, res: Response) => {
    const { id } = req.params;
    const invoices = await getAllContractInvoices(id);
    if (!invoices) return res.status(404).json({ msg: "Invoices not found" });
    return res.json(invoices);
};

// DONE
export const getInvoiceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const invoice = await getById(id);
    if (!invoice) {
        return res.status(404).json({ msg: "Invoice not found" });
    }
    return res.json(invoice);
};

// DONE
export const updateInvoice = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });


    const invoice = await getById(id);
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });
    const {
        total_amount,
        paid_amount,
        remaining_amount,
        subject,
        description,
        items,
        vat,
    } = req.body;

    invoice.total_amount = total_amount ? total_amount : invoice.total_amount;
    invoice.paid_amount = paid_amount ? paid_amount : invoice.paid_amount;
    invoice.remaining_amount = remaining_amount ? remaining_amount : invoice.remaining_amount;
    invoice.subject = subject ? subject : invoice.subject;
    invoice.description = description ? description : invoice.description;
    invoice.items = items ? items : invoice.items;
    invoice.vat = vat ? vat : invoice.vat;

    await invoice.save();
    return res.json(invoice);
};

// DONE
export const deleteInvoice = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const invoice = await getById(id);
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });
    await invoice.remove();
    return res.json({ msg: "Invoice deleted" });
};