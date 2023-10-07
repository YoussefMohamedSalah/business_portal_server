import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateInventoryInfo } from "src/types/CreateInventory";
import { Inventory } from "../entities/Inventory";
import { InventoryType } from "../enums/enums";
import { Project } from "../entities/Project";

export const createInventory = async (
    createData: CreateInventoryInfo,
    company: Company,
    project?: Project
) => {
    const { type, items_count, items_value } = createData;
    try {
        const inventoryRepository = getRepository(Inventory);
        const inventory = new Inventory();
        inventory.type = type ? type : InventoryType.MASTER;
        inventory.items_count = items_count ? items_count : 0;
        inventory.items_value = items_value ? items_value : 0;
        if (project) {
            inventory.project = project;
            inventory.project_info = { id: project.id, name: project.name }
        };
        inventory.company = company;
        await inventoryRepository.save(inventory);
        return inventory;
    } catch (error) {
        // Handle the error
        console.error("Error Adding Inventory:", error);
        return;
    }
};

export const getById = async (id: string) => {
    try {
        const inventoryRepository = getRepository(Inventory);
        const inventory = await inventoryRepository
            .createQueryBuilder("inventory")
            .where("inventory.id = :id", { id: id })
            .getOne();
        return inventory;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Inventory:", error);
        return;
    }
};

export const getWithItemsById = async (id: string) => {
    try {
        const inventoryRepository = getRepository(Inventory);
        const inventory = await inventoryRepository
            .createQueryBuilder("inventory")
            .where("inventory.id = :id", { id: id })
            .leftJoinAndSelect(
                "inventory.items",
                "items"
            )
            .getOne();
        return inventory;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Inventory Items:", error);
        return;
    }
};

export const getAllByCompanyId = async (companyId: string) => {
    try {
        const inventoryRepository = getRepository(Inventory);
        const inventory = await inventoryRepository
            .createQueryBuilder("inventory")
            .where("inventory.companyId = :companyId", { companyId: companyId })
            .orderBy("inventory.createdAt", "ASC")
            .getMany();
        return inventory;
    } catch (error) {
        // Handle the error
        console.error("Error Retrieving Inventories:", error);
        return;
    }
};

