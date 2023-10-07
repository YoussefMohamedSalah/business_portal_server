import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { CreateSupplierInfo } from 'src/types/CreateSupplier';
import { createSupplier, getAllByCompanyId, getById } from '../repositories/SupplierRepository';
import { validateUUID } from '../utils/validateUUID';
import { processNumber } from '../utils/checkAndParse';

export const addSupplier = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
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
    try {
        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });
        let toCheckType: { [key: string]: number | string | undefined } = {
            vat_on: vat_on && processNumber('Vat', vat_on!),
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }
        let createData: CreateSupplierInfo = {
            name,
            supplier_type,
            company_name,
            vat_on: toCheckType.vat_on ? toCheckType.vat_on as number : 0,
            representative,
            phone_number,
            email,
            country,
            city,
            area,
            street,
            building_number,
            postal_code: toCheckType.postal_code ? toCheckType.postal_code as number : 0
        };

        const supplier = await createSupplier(createData, company);
        if (!supplier) return res.status(409).json({ msg: "Field To Create Supplier" });
        else return res.json(supplier);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Request:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getSupplierById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const supplier = await getById(id);
        if (!supplier) return res.status(404).json({ msg: "Supplier not found" });
        return res.json(supplier);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Supplier:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const supplier = await getById(id);
        if (!supplier) return res.status(404).json({ msg: "Supplier not found" });
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

        let toCheckType: { [key: string]: number | string | undefined } = {
            vat_on: vat_on && processNumber('Vat', vat_on!),
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        if (toCheckType.vat_on) supplier.vat_on = toCheckType.vat as number;
        if (toCheckType.postal_code) supplier.postal_code = toCheckType.postal_code as number;
        supplier.name = name ? name : supplier.name;
        supplier.supplier_type = supplier_type ? supplier_type : supplier.supplier_type;
        supplier.company_name = company_name ? company_name : supplier.company_name;
        supplier.representative = representative ? representative : supplier.representative;
        supplier.phone_number = phone_number ? phone_number : supplier.phone_number;
        supplier.email = email ? email : supplier.email;
        supplier.country = country ? country : supplier.country;
        supplier.city = city ? city : supplier.city;
        supplier.area = area ? area : supplier.area;
        supplier.street = street ? street : supplier.street;
        supplier.building_number = building_number ? building_number : supplier.building_number;
        await supplier.save();
        return res.json(supplier);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Supplier:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const supplier = await getById(id);
        if (!supplier) return res.status(404).json({ msg: "Supplier not found" });
        await supplier.remove();
        return res.json({ msg: "Supplier deleted" });
    } catch (error) {
        // Handle the error
        console.error("Error Deleting Supplier:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

export const allCompanySuppliers = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const suppliers = await getAllByCompanyId(companyId);
        if (!suppliers) return res.status(404).json({ msg: "No suppliers Exists" });
        return res.json(suppliers);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Suppliers:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
