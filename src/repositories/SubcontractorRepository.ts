import { getRepository } from "typeorm";
import { Subcontractor } from "../entities/Subcontractor";
import { Company } from "../entities/Company";
import { CreateSubcontractorInfo } from "../types/CreateSubcontractorType";
import { processNumber } from "../utils/checkAndParse";

export const createSubcontractor = async (
    createData: CreateSubcontractorInfo,
    company: Company
) => {
    const { subcontractor_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = createData;
    if (!email) return null;
    try {
        const existingSubcontractor = await getByEmail(email);
        if (existingSubcontractor) return null;

        let toCheckType: { [key: string]: number | string | undefined } = {
            postal_code: postal_code && processNumber('Postal Code', postal_code!),
            vat: vat_on && processNumber('Vat', vat_on!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }
        const subcontractorRepository = getRepository(Subcontractor);
        const subcontractor = new Subcontractor();
        if (toCheckType.postal_code) subcontractor.postal_code = toCheckType.postal_code as number;
        if (toCheckType.vat_on) subcontractor.vat_on = toCheckType.vat as number;
        if (subcontractor_type) subcontractor.subcontractor_type = subcontractor_type;
        if (company_name) subcontractor.company_name = company_name;
        if (representative) subcontractor.representative = representative;
        if (phone_number) subcontractor.phone_number = phone_number;
        if (email) subcontractor.email = email;
        if (country) subcontractor.country = country;
        if (city) subcontractor.city = city;
        if (area) subcontractor.area = area;
        if (street) subcontractor.street = street;
        if (building_number) subcontractor.building_number = building_number;
        subcontractor.company = company;
        await subcontractorRepository.save(subcontractor);
        return subcontractor;
    } catch (error) {
        // Handle the error
        console.error("Error Creating Subcontractor:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const subcontractorRepository = getRepository(Subcontractor);
        const subcontractor = await subcontractorRepository
            .createQueryBuilder("subcontractor")
            .where("subcontractor.id = :id", { id: id })
            .getOne();
        return subcontractor;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Subcontractor:", error);
        return;
    }
};

export const getByEmail = async (email: string) => {
    try {
        const subcontractorRepository = getRepository(Subcontractor);
        const subcontractor = await subcontractorRepository
            .createQueryBuilder("subcontractor")
            .where("subcontractor.email = :email", { email: email })
            .getOne();
        return subcontractor;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Subcontractor:", error);
        return;
    }
};

export const getAllByCompanyId = async (companyId: string) => {
    try {
        const subcontractorRepository = getRepository(Subcontractor);
        const subcontractors = await subcontractorRepository
            .createQueryBuilder("subcontractor")
            .where("subcontractor.companyId = :companyId", { companyId: companyId })
            .orderBy("subcontractor.createdAt", "DESC")
            .getMany();
        return subcontractors;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Subcontractors:", error);
        return;
    }
};