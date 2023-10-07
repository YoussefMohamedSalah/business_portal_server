import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { addInitialData } from "./InitialDataRepository";
import { createInventory } from "./InventoryRepository";
import { InventoryType } from "../enums/enums";

// with company create, inventory, departments, permissions, work flow.
export const createCompany = async (name: string) => {
    // First make sure that initial data exists.
    // Then create the company and add the initial data to it 
    try {
        const data = await addInitialData();
        const { departmentsList, workflow } = data;
        if (!departmentsList || !workflow) return console.log('Error, Initial data does not exists');
        // Create the company
        const companyRepository = getRepository(Company);
        const company = new Company();
        company.name = name;
        company.departments = departmentsList;
        company.workFlow = workflow;
        await companyRepository.save(company);
        // Create the inventory for the company
        const createInventoryData = { type: InventoryType.MASTER, items_count: 0, items_value: 0 }
        await createInventory(createInventoryData, company);
        return company;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving contracts:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const companyRepository = getRepository(Company);
        const company = await companyRepository
            .createQueryBuilder("company")
            .where("company.id = :id", { id: id })
            .getOne();
        return company;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving contracts:", error);
        return;
    }
};

export const getCompanyWithWorkflow = async (id: string) => {
    try {
        const companyRepository = getRepository(Company);
        const company = await companyRepository
            .createQueryBuilder("company")
            .leftJoinAndSelect("company.workFlow", "workFlow")
            .where("company.id = :id", { id: id })
            .getOne();
        return company;
    } catch (error) {
        // Handle the error
        console.error("Error retrieving contracts:", error);
        return;
    }
}
