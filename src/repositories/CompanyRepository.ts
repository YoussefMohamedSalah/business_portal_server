import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { addInitialData } from "./InitialDataRepository";

export const createCompany = async (
    name: string,
) => {
    // first make sure that initial data exists.
    // then create the company and add the initial data to it 
    const data = await addInitialData();
    const { departmentsList, workflow } = data;
    if (!departmentsList || !workflow) return console.log('Error, Initial data does not exists');
    // create the company
    const companyRepository = getRepository(Company);
    const company = new Company();
    company.name = name;
    company.departments = departmentsList;
    company.workFlow = workflow;
    await companyRepository.save(company);
    return company;
};

export const getById = async (id: string) => {
    const companyRepository = getRepository(Company);
    const company = await companyRepository
        .createQueryBuilder("company")
        .where("company.id = :id", { id: id })
        .getOne();
    return company;
};
