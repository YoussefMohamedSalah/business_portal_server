import { Request, Response } from 'express';
import { getCompanyWithWorkflow } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { validateUUID } from '../utils/validateUUID';
import { createInvoice, getAllCompanySubcontractorInvoices, getById, getAllProjectSubcontractorInvoices } from '../repositories/SubcontractorInvoiceRepository';


export const addInvoice = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const { companyId, userId } = req.userData!;
    const { items, conditions, date, total_value, vat } = req.body;
    let data = {
        date,
        total_value,
        items,
        conditions,
        vat
    }
    const company = await getCompanyWithWorkflow(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const project = await getProjectById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const invoice = await createInvoice(data, company, user, project)
    if (!invoice) return res.status(404).json({ msg: "Field To Create Invoice" });
    return res.json(invoice);
};

// DONE
export const getAllInvoicesByCompany = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const invoices = await getAllCompanySubcontractorInvoices(companyId);
    if (!invoices) return res.status(404).json({ msg: "Invoices not found" });
    return res.json(invoices);
};

// DONE
export const getAllInvoicesByProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const invoices = await getAllProjectSubcontractorInvoices(projectId);
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
export const deleteInvoice = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const invoice = await getById(id);
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });
    await invoice.remove();
    return res.json({ msg: "Invoice deleted" });
};

// DONE
export const updateInvoice = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });

    const invoice = await getById(id);
    if (!invoice) return res.status(404).json({ msg: "Invoice not found" });
    const { date, conditions, items, total_value, status, work_flow, vat } = req.body;
    invoice.date = date ? date : invoice.date;
    invoice.conditions = conditions ? conditions : invoice.conditions;
    invoice.items = items ? items : invoice.items;
    invoice.total_value = total_value ? total_value : invoice.total_value;
    invoice.status = status ? status : invoice.status;
    invoice.status = status ? status : invoice.status;
    invoice.work_flow = work_flow ? work_flow : invoice.work_flow;
    invoice.vat = vat ? vat : invoice.vat;

    await invoice.save();
    return res.json(invoice);
};





