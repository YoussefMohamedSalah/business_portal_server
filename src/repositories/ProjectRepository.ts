import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateProjectInfo } from "src/types/CreateProject";
import { Project } from "../entities/Project";
import { InventoryType } from "../enums/enums";
import { createInventory } from "./InventoryRepository";

// DONE
export const createProject = async (
    createData: CreateProjectInfo,
    company: Company
) => {
    const {
        name, description, latitude, longitude,
        bid_value, duration, delivery_date,
        contract_number, contract_date, po_budget,
        pc_budget, subcontractor_budget, staff_budget,
        total_budget, project_managers, sites_count,
        buildings_count, floors_count, project_status,
        customer
    } = createData;
    // create Project
    const projectRepository = getRepository(Project);
    const project = new Project();
    project.name = name;
    project.description = description;
    project.latitude = latitude;
    project.longitude = longitude;
    project.bid_value = bid_value;
    project.duration = duration;
    project.delivery_date = delivery_date;
    project.contract_number = contract_number;
    project.contract_date = contract_date;
    project.po_budget = po_budget;
    project.pc_budget = pc_budget;
    project.subcontractor_budget = subcontractor_budget;
    project.staff_budget = staff_budget;
    project.total_budget = total_budget;
    project.project_managers = project_managers;
    project.sites_count = sites_count;
    project.buildings_count = buildings_count;
    project.floors_count = floors_count;
    project.project_status = project_status;
    project.company = company;
    project.customer = customer;
    await projectRepository.save(project);

    // Create the inventory for the company
    const createInventoryData = { type: InventoryType.PROJECT, items_count: 0, items_value: 0 }
    await createInventory(createInventoryData, company, project);
    return project;
};

// DONE
export const getById = async (id: string) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.id = :id", { id: id })
        .getOne();
    return project;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository
        .createQueryBuilder("project")
        .where("project.companyId = :companyId", { companyId: companyId })
        .leftJoinAndSelect('project.group', 'group')
        .orderBy("project.createdAt", "DESC")
        .getMany();
    return project;
};