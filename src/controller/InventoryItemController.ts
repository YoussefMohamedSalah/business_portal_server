import { Request, Response } from 'express';
import { getById as getInventoryById } from '../repositories/InventoryRepository';
import { createInventoryItem, getAllByInventoryId, getById } from '../repositories/InventoryItemRepository';
import { CreateInventoryItemInfo } from '../types/CreateInventoryItemInfo';
import { validateUUID } from '../utils/validateUUID';
import { calculateItemValue, handleCalculateItemValue, handleInventoryCountAndValue } from '../utils/inventoryUtils';

// DONE
export const addInventoryItem = async (req: Request, res: Response) => {
    const { inventoryId } = req.params;
    const createData: CreateInventoryItemInfo = req.body;
    const itemThumbnail = req.file!;

    if (!inventoryId) return res.status(400).json({ msg: "Inventory id is required" });
    let isValidUUID = validateUUID(inventoryId);
    if (!isValidUUID) return res.status(400).json({ msg: "Inventory id is not valid" });
    // first get inventory by id
    const inventory = await getInventoryById(inventoryId);
    if (!inventory) return res.status(404).json({ msg: "Inventory not found" });
    // then create Inventory Item
    const inventoryItem = await createInventoryItem(createData, itemThumbnail, inventory);
    if (inventoryItem) {
        let updatedInventory = handleInventoryCountAndValue(inventory, inventoryItem, 'add')
        inventory.items_count = updatedInventory.items_count;
        inventory.items_value = updatedInventory.items_value;
        await inventory.save();
        return res.status(200).json(inventoryItem)
    }
    else return res.status(409).json({ msg: "Field To Create Inventory Item" });
};

// DONE
export const getInventoryItemById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const inventoryItem = await getById(id);
    if (inventoryItem) {
        return res.status(200).json(inventoryItem);
    }
    return res.status(404).json({ msg: "Inventory Item Is not found" });
};

// DONE
export const updateInventoryItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const itemThumbnail = req.file!;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const inventoryItem = await getById(id);
    if (!inventoryItem) {
        return res.status(404).json({ msg: "Inventory Item Is not found" });
    }
    const { name, price, count } = req.body;

    const inventory = await getInventoryById(inventoryItem.inventory.id);
    if (!inventory) return res.status(404).json({ msg: "Inventory not found" });

    let itemTotalValue = inventoryItem.total_value;
    if (price || count) {
        itemTotalValue = handleCalculateItemValue(inventoryItem, { price, count })
        let newTempCount = Number(inventory.items_count) - Number(inventoryItem.count);
        let newInventoryItemsCount = Number(newTempCount) + Number(count);
        inventory.items_count = newInventoryItemsCount;
        // ----
        let tempInventoryItemsValue = Number(inventory.items_value) - Number(inventoryItem.total_value);
        let newInventoryItemsValue = Number(tempInventoryItemsValue) + Number(itemTotalValue);
        inventory.items_value = newInventoryItemsValue;
        await inventory.save()
    }

    inventoryItem.name = name ? name : inventoryItem.name;
    inventoryItem.price = price ? price : inventoryItem.price;
    inventoryItem.count = count ? count : inventoryItem.count;
    inventoryItem.thumbnail = itemThumbnail ? itemThumbnail.path : inventoryItem.thumbnail;
    inventoryItem.total_value = itemTotalValue ? itemTotalValue : inventoryItem.total_value;
    await inventoryItem.save();

    return res.status(200).json(inventoryItem);
};

// DONE
export const deleteInventoryItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    const inventoryItem = await getById(id);
    if (!inventoryItem) {
        return res.status(404).json({ msg: "Inventory Item I not found" });
    }

    const inventory = await getInventoryById(inventoryItem.inventory.id);
    if (!inventory) return res.status(404).json({ msg: "Inventory not found" });

    let updatedInventory = handleInventoryCountAndValue(inventory, inventoryItem, 'remove')
    inventory.items_count = updatedInventory.items_count;
    inventory.items_value = updatedInventory.items_value;
    await inventory.save();

    await inventoryItem.remove();
    return res.status(404).json({ msg: "Inventory Item deleted" });
}

// DONE
export const allInventoryItems = async (req: Request, res: Response) => {
    const { inventoryId } = req.params;
    const inventoryItems = await getAllByInventoryId(inventoryId);
    if (!inventoryItems) {
        return res.status(404).json({ msg: "Inventory Items not found" });
    }
    return res.status(200).json(inventoryItems);
};
