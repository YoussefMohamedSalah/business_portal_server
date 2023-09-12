import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { CreateSupplierInfo } from 'src/types/CreateSupplier';
import { createSupplier, getAllByCompanyId, getById } from '../repositories/SupplierRepository';
import { validateUUID } from '../utils/validateUUID';

// DONE
export const addSupplier = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const createData: CreateSupplierInfo = req.body;
    // first get company by id
    if (companyId) return res.status(400).json({ msg: "Company id is required" });
    const company = await getCompanyById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    // then create project
    const project = await createSupplier(createData, company);
    if (!project) return res.status(409).json({ msg: "Field To Create Project" });
    else return res.json(project);
};

// DONE
export const getSupplierById = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const supplier = await getById(id);
    if (supplier) {
        return res.json(supplier);
    }
    return res.status(404).json({ msg: "Supplier not found" });
};

// DONE
export const updateSupplier = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const supplier = await getById(id);
    if (!supplier) {
        return res.status(404).json({ msg: "Supplier not found" });
    }
    const {
        name,
        supplier_type,
        company_name,
        vat_on,
        representative,
        phone_number,
        email,
        country,
        city,
        area,
        street,
        building_number,
        postal_code
    } = req.body;
    supplier.name = name ? name : supplier.name;
    supplier.supplier_type = supplier_type ? supplier_type : supplier.supplier_type;
    supplier.company_name = company_name ? company_name : supplier.company_name;
    supplier.vat_on = vat_on ? vat_on : supplier.vat_on;
    supplier.representative = representative ? representative : supplier.representative;
    supplier.phone_number = phone_number ? phone_number : supplier.phone_number;
    supplier.email = email ? email : supplier.email;
    supplier.country = country ? country : supplier.country;
    supplier.city = city ? city : supplier.city;
    supplier.area = area ? area : supplier.area;
    supplier.street = street ? street : supplier.street;
    supplier.building_number = building_number ? building_number : supplier.building_number;
    supplier.postal_code = postal_code ? postal_code : supplier.postal_code;
    await supplier.save();
    return res.json(supplier);
};

// DONE
export const deleteSupplier = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const supplier = await getById(id);
    if (!supplier) {
        return res.status(404).json({ msg: "Supplier not found" });
    }
    await supplier.remove();
    return res.json({ msg: "Supplier deleted" });
}

// DONE
export const allCompanySuppliers = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const suppliers = await getAllByCompanyId(companyId);
    if (!suppliers) {
        return res.status(404).json({ msg: "No suppliers Exists" });
    }
    return res.json(suppliers);
};
