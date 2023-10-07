import { Request, Response } from 'express';
import { validateUUID } from '../utils/validateUUID';
import { createInvoice, getAllContractInvoices, getById } from '../repositories/InvoiceRepository';
import { getById as getContractById } from '../repositories/ContractRepository'
import { processNumber } from '../utils/checkAndParse';

export const addInvoice = async (req: Request, res: Response) => {
    const { contractId } = req.params;
    let isValidUUID = validateUUID(contractId);
    if (!isValidUUID) return res.status(400).json({ msg: "contract Id is not valid" });
    const {
        total_amount,
        paid_amount,
        remaining_amount,
        subject,
        description,
        items,
        vat,
    } = req.body;
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
        let createInput = {
            total_amount,
            paid_amount,
            remaining_amount,
            subject,
            description,
            items,
            vat,
        }
        const contract = await getContractById(contractId);
        if (!contract) return res.status(404).json({ msg: "Contract not found" });
        const invoice = await createInvoice(createInput, contract)
        if (!invoice) return res.status(404).json({ msg: "Field To Create Invoice" });
        return res.json(invoice);
    } catch (error) {
        console.error("Error Adding Invoice:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getAllInvoicesByContract = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const invoices = await getAllContractInvoices(id);
        if (!invoices) return res.status(404).json({ msg: "Invoices not found" });
        return res.json(invoices);
    } catch (error) {
        console.error("Error Retrieving Invoice:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getInvoiceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const invoice = await getById(id);
        if (!invoice) {
            return res.status(404).json({ msg: "Invoice not found" });
        }
        return res.json(invoice);
    } catch (error) {
        console.error("Error Retrieving Invoice:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateInvoice = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });

    const {
        total_amount,
        paid_amount,
        remaining_amount,
        subject,
        description,
        items,
        vat,
    } = req.body;

    try {
        const invoice = await getById(id);
        if (!invoice) return res.status(404).json({ msg: "Invoice not found" });

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

        if (toCheckType.total_amount) invoice.total_amount = toCheckType.total_amount as number;
        if (toCheckType.paid_amount) invoice.paid_amount = toCheckType.paid_amount as number;
        if (toCheckType.remaining_amount) invoice.remaining_amount = toCheckType.remaining_amount as number;
        if (toCheckType.vat) invoice.vat = toCheckType.vat as number;

        invoice.subject = subject ? subject : invoice.subject;
        invoice.description = description ? description : invoice.description;
        invoice.items = items ? items : invoice.items;

        await invoice.save();
        return res.json(invoice);
    } catch (error) {
        console.error("Error Update Invoice:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const invoice = await getById(id);
        if (!invoice) return res.status(404).json({ msg: "Invoice not found" });
        await invoice.remove();
        return res.json({ msg: "Invoice deleted" });
    } catch (error) {
        console.error("Error Deleting Invoice:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};