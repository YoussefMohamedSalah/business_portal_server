import { Request, Response } from 'express';
import { getCompanyWithWorkflow } from '../repositories/CompanyRepository';
import { getById as getUserById } from '../repositories/UserRepository';
import { getById as getProjectById } from '../repositories/ProjectRepository';
import { validateUUID } from '../utils/validateUUID';
import { createInvoice, getAllCompanySubcontractorInvoices, getById, getAllProjectSubcontractorInvoices } from '../repositories/SubcontractorInvoiceRepository';


export const addInvoice = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    let isValidUUID = validateUUID(projectId);
    if (!isValidUUID) return res.status(400).json({ msg: "project Id is not valid" });
    const { companyId, userId } = req.userData!;
    const { subcontractor, items, conditions, date, vat, total_value, filesNameSet } = req.body;

    const invoiceFiles = req.files!;

    let conditionsObj;
    let itemsObj;
    let subcontractorObj;
    let filesNameSetArray;

    if (invoiceFiles) {
        conditionsObj = JSON.parse(conditions);
        itemsObj = JSON.parse(items);
        subcontractorObj = JSON.parse(subcontractor);
        if (filesNameSet) filesNameSetArray = filesNameSet.split(',')
    } else {
        conditionsObj = conditions;
        itemsObj = items;
        subcontractorObj = subcontractor;
        filesNameSetArray = []
    }

    let createInput = {
        subcontractor: subcontractorObj,
        items: itemsObj,
        conditions: conditionsObj,
        date,
        vat,
        total_value,
        filesNameSetArray
    }

    const company = await getCompanyWithWorkflow(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const project = await getProjectById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const invoice = await createInvoice(createInput, company, project, user)
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





