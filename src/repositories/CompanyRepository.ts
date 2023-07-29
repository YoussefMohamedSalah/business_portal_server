import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { addInitialData } from "./InitialDataRepository";

export const createCompany = async (
    name: string,
) => {
    // first make sure that initial data exists.
    // then create the company and add the initial data to it 
    const departmentsList = await addInitialData(name)
    if (!departmentsList) return console.log('Error, Initial data does not exists');
    const companyRepository = getRepository(Company);
    const company = new Company();
    company.name = name;
    company.departments = departmentsList;
    await companyRepository.save(company);
    return company;
};

export const getById = async (id: number) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .getOne();
    return company;
};
