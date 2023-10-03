import { getRepository } from "typeorm";
import { CreateInventoryItemInfo } from "src/types/CreateInventoryItemInfo";
import { InventoryItem } from "../entities/InventoryItem";
import { Inventory } from "../entities/Inventory";
import { calculateItemValue } from "../utils/inventoryUtils";

// DONE
export const createInventoryItem = async (
    createData: CreateInventoryItemInfo,
    itemThumbnail: any,
    inventory: Inventory
) => {
    const { name, price, count } = createData;
    // create inventoryItem
    const inventoryItemRepository = getRepository(InventoryItem);
    const inventoryItem = new InventoryItem();
    inventoryItem.name = name;
    inventoryItem.price = price;
    inventoryItem.count = count;
    inventoryItem.total_value = calculateItemValue(count, price);
    inventoryItem.thumbnail = itemThumbnail ? itemThumbnail.path : '';
    inventoryItem.inventory = inventory;
    await inventoryItemRepository.save(inventoryItem);
    return inventoryItem;
};

// DONE
export const getById = async (id: string) => {
    const inventoryItemRepository = getRepository(InventoryItem);
    const inventoryItem = await inventoryItemRepository
        .createQueryBuilder("inventory_item")
        .where("inventory_item.id = :id", { id: id })
        .leftJoinAndSelect('inventory_item.inventory', 'inventory')
        .getOne();
    return inventoryItem;
};

// DONE
export const getAllByInventoryId = async (inventoryId: string) => {
    const inventoryItemRepository = getRepository(InventoryItem);
    const inventoryItem = await inventoryItemRepository
        .createQueryBuilder("inventory_item")
        .where("inventory_item.inventoryId = :inventoryId", { inventoryId: inventoryId })
        .getMany();
    return inventoryItem;
};

