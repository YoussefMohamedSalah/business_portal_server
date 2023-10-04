import { getRepository } from "typeorm";
import { Subcontractor } from "../entities/Subcontractor";
import { Company } from "../entities/Company";
import { CreateSubcontractorInfo } from "../types/CreateSubContractorInfo";

// DONE
export const createSubcontractor = async (
    createData: CreateSubcontractorInfo,
    company: Company
) => {
    const { subcontractor_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = createData;
    // check if subcontractor already exists
    if (!email) return null;
    const existingSubcontractor = await getByEmail(email);
    if (existingSubcontractor) return null;
    // create subcontractor
    const subcontractorRepository = getRepository(Subcontractor);
    const subcontractor = new Subcontractor();
    if (subcontractor_type) {
        subcontractor.subcontractor_type = subcontractor_type;
    }
    subcontractor.company_name = company_name ? company_name : '';
    subcontractor.vat_on = vat_on ? vat_on : '';
    subcontractor.representative = representative ? representative : '';
    subcontractor.phone_number = phone_number ? phone_number : '';
    subcontractor.email = email ? email : '';
    subcontractor.country = country ? country : '';
    subcontractor.city = city ? city : '';
    subcontractor.area = area ? area : '';
    subcontractor.street = street ? street : '';
    subcontractor.building_number = building_number ? building_number : '';
    subcontractor.postal_code = postal_code ? postal_code : '';
    subcontractor.company = company;
    await subcontractorRepository.save(subcontractor);
    return subcontractor;
};

// DONE
export const getById = async (id: string) => {
    const subcontractorRepository = getRepository(Subcontractor);
    const subcontractor = await subcontractorRepository
        .createQueryBuilder("subcontractor")
        .where("subcontractor.id = :id", { id: id })
        .getOne();
    return subcontractor;
};

// DONE
export const getByEmail = async (email: string) => {
    const subcontractorRepository = getRepository(Subcontractor);
    const subcontractor = await subcontractorRepository
        .createQueryBuilder("subcontractor")
        .where("subcontractor.email = :email", { email: email })
        .getOne();
    return subcontractor;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const subcontractorRepository = getRepository(Subcontractor);
    const subcontractors = await subcontractorRepository
        .createQueryBuilder("subcontractor")
        .where("subcontractor.companyId = :companyId", { companyId: companyId })
        .orderBy("subcontractor.createdAt", "DESC")
        .getMany();
    return subcontractors;
};