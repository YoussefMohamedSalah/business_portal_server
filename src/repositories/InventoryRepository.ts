import { getRepository } from "typeorm";
import { Company } from "../entities/Company";
import { CreateInventoryInfo } from "src/types/CreateInventory";
import { Inventory } from "../entities/Inventory";
import { InventoryType } from "../enums/enums";

// DONE
export const createInventory = async (
    createData: CreateInventoryInfo,
    company: Company
) => {
    const { type, items_count, items_value } = createData;
    // create inventory
    const inventoryRepository = getRepository(Inventory);
    const inventory = new Inventory();
    inventory.type = type ? type : InventoryType.Master;
    inventory.items_count = items_count ? items_count : 0;
    inventory.items_value = items_value ? items_value : 0;
    inventory.company = company;
    await inventoryRepository.save(inventory);
    return inventory;
};

// DONE
export const getById = async (id: string) => {
    const inventoryRepository = getRepository(Inventory);
    const inventory = await inventoryRepository
        .createQueryBuilder("inventory")
        .where("inventory.id = :id", { id: id })
        .getOne();
    return inventory;
};

// DONE
export const getAllByCompanyId = async (companyId: string) => {
    const inventoryRepository = getRepository(Inventory);
    const inventory = await inventoryRepository
        .createQueryBuilder("inventory")
        .where("inventory.companyId = :companyId", { companyId: companyId })
        .getMany();
    return inventory;
};



// export const getInventoryItemsById = async (id: string) => {
//     const inventoryRepository = getRepository(Inventory);
//     const inventory = await inventoryRepository
//         .createQueryBuilder("inventory")
//         .where("inventory.id = :id", { id: id })
//         .leftJoinAndSelect(
//             "inventory.items",
//             "items"
//         )
//         .getOne();
//     return inventory;
// };

