import { Request, Response } from 'express';
import { createSubcontractor, getAllByCompanyId, getById } from '../repositories/SubcontractorRepository';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { validateUUID } from '../utils/validateUUID';
import { CreateSubcontractorInfo } from 'src/types/CreateSubContractorInfo';

// DONE
export const addSubcontractor = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const createData: CreateSubcontractorInfo = req.body;
    // first get company by id
    const company = await getCompanyById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    // then create Subcontractor
    const subcontractor = await createSubcontractor(createData, company);
    if (!subcontractor) return res.status(409).json({ msg: "Subcontractor already exists" });
    else return res.json(subcontractor);
};

// DONE
export const getSubcontractorById = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const subcontractor = await getById(id);
    if (subcontractor) {
        return res.json(subcontractor);
    }
    return res.status(404).json({ msg: "Subcontractor not found" });
};

// DONE
export const updateSubcontractor = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const subcontractor = await getById(id);
    if (!subcontractor) {
        return res.status(404).json({ msg: "Subcontractor not found" });
    }
    const { subcontractor_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
    subcontractor.subcontractor_type = subcontractor_type ? subcontractor_type : subcontractor.subcontractor_type;
    subcontractor.company_name = company_name ? company_name : subcontractor.company_name;
    subcontractor.vat_on = vat_on ? vat_on : subcontractor.vat_on;
    subcontractor.representative = representative ? representative : subcontractor.representative;
    subcontractor.phone_number = phone_number ? phone_number : subcontractor.phone_number;
    subcontractor.email = email ? email : subcontractor.email;
    subcontractor.country = country ? country : subcontractor.country;
    subcontractor.city = city ? city : subcontractor.city;
    subcontractor.area = area ? area : subcontractor.area;
    subcontractor.street = street ? street : subcontractor.street;
    subcontractor.building_number = building_number ? building_number : subcontractor.building_number;
    subcontractor.postal_code = postal_code ? postal_code : subcontractor.postal_code;
    await subcontractor.save();
    return res.json(subcontractor);
};

// DONE
export const deleteSubcontractor = async (req: Request, res: Response) => {
    const { id } = req.params; 
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const subcontractor = await getById(id);
    if (!subcontractor) {
        return res.status(404).json({ msg: "Subcontractor not found" });
    }
    await subcontractor.remove();
    return res.json({ msg: "Subcontractor deleted" });
}

// DONE
export const getAllCompanySubcontractors = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const subcontractors = await getAllByCompanyId(companyId);
    return res.json(subcontractors);
};
