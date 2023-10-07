import { getRepository } from "typeorm";
import { Department } from "../entities/Department";
import { Company } from "../entities/Company";


export const getById = async (id: string) => {
    try {
        const departmentRepository = getRepository(Department);
        const department = await departmentRepository
            .createQueryBuilder("department")
            .where("department.id = :id", { id: id })
            .getOne();
        return department;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Department:", error);
        return;
    }
};

export const getAllDepartments = async (id: string) => {
    try {
        const companyRepository = getRepository(Company);
        const company = await companyRepository
            .createQueryBuilder("company")
            .where("company.id = :id", { id: id })
            .leftJoinAndSelect(
                "company.departments",
                "department"
            )
            .getOne();
        return company?.departments;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Departments:", error);
        return;
    }
}
