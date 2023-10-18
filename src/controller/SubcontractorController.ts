import { Request, Response } from 'express';
import { createSubcontractor, getAllByCompanyId, getById } from '../repositories/SubcontractorRepository';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { validateUUID } from '../utils/validateUUID';
import { CreateSubcontractorInfo } from 'src/types/CreateSubcontractorType';
import { processNumber } from '../utils/checkAndParse';

export const addSubcontractor = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    // const createData: CreateSubcontractorInfo = req.body;
    const { subcontractor_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
    try {
        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });

        let toCheckType: { [key: string]: number | string | undefined } = {
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
            vat: vat_on && processNumber('Vat', vat_on!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }

        let createData = {
            subcontractor_type,
            company_name,
            vat_on: toCheckType.vat_on as number,
            representative,
            phone_number,
            email,
            country,
            city,
            area,
            street,
            building_number,
            postal_code: toCheckType.postal_code as number
        }

        const subcontractor = await createSubcontractor(createData, company);
        if (!subcontractor) return res.status(409).json({ msg: "Subcontractor already exists" });
        else return res.status(200).json(subcontractor);
    } catch (error) {
        // Handle the error
        console.error("Error Creating Subcontractor:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getSubcontractorById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const subcontractor = await getById(id);
        if (subcontractor) {
            return res.status(200).json(subcontractor);
        }
        return res.status(404).json({ msg: "Subcontractor not found" });
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Subcontractor:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateSubcontractor = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const { subcontractor_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
    try {
        let toCheckType: { [key: string]: number | string | undefined } = {
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
            vat: vat_on && processNumber('Vat', vat_on!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }
        const subcontractor = await getById(id);
        if (!subcontractor) return res.status(404).json({ msg: "Subcontractor not found" });
        if (toCheckType.postal_code) subcontractor.postal_code = toCheckType.postal_code as number;
        if (toCheckType.vat_on) subcontractor.vat_on = toCheckType.vat as number;
        subcontractor.subcontractor_type = subcontractor_type ? subcontractor_type : subcontractor.subcontractor_type;
        subcontractor.company_name = company_name ? company_name : subcontractor.company_name;
        subcontractor.representative = representative ? representative : subcontractor.representative;
        subcontractor.phone_number = phone_number ? phone_number : subcontractor.phone_number;
        subcontractor.email = email ? email : subcontractor.email;
        subcontractor.country = country ? country : subcontractor.country;
        subcontractor.city = city ? city : subcontractor.city;
        subcontractor.area = area ? area : subcontractor.area;
        subcontractor.street = street ? street : subcontractor.street;
        subcontractor.building_number = building_number ? building_number : subcontractor.building_number;
        await subcontractor.save();
        return res.status(200).json(subcontractor);
    } catch (error) {
        // Handle the error
        console.error("Error Updating Subcontractor:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const deleteSubcontractor = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const subcontractor = await getById(id);
        if (!subcontractor) {
            return res.status(404).json({ msg: "Subcontractor not found" });
        }
        await subcontractor.remove();
        return res.status(404).json({ msg: "Subcontractor deleted" });
    } catch (error) {
        // Handle the error
        console.error("Error Deleting Subcontractor:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

export const getAllCompanySubcontractors = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const subcontractors = await getAllByCompanyId(companyId);
        return res.status(200).json(subcontractors);
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Subcontractors:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
