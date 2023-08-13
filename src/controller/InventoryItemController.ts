import { Request, Response } from 'express';
import { getById as getInventoryById } from '../repositories/InventoryRepository';
import { createInventoryItem, getAllByInventoryId, getById } from '../repositories/InventoryItemRepository';
import { CreateInventoryItemInfo } from 'src/types/CreateInventoryItemInfo';

// DONE
export const addInventoryItem = async (req: Request, res: Response) => {
    const { inventoryId } = req.params;
    const createData: CreateInventoryItemInfo = req.body;
    // first get inventory by id
    if (inventoryId) return res.status(400).json({ msg: "Inventory id is required" });
    const inventory = await getInventoryById(inventoryId);
    if (!inventory) return res.status(404).json({ msg: "Company not found" });
    // then create Inventory Item
    const inventoryItem = await createInventoryItem(createData, inventory);
    if (!inventoryItem) return res.status(409).json({ msg: "Field To Create Inventory Item" });
    else return res.json(inventoryItem);
};

// DONE
export const getInventoryItemById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inventoryItem = await getById(id);
    if (inventoryItem) {
        return res.json(inventoryItem);
    }
    return res.status(404).json({ msg: "Inventory Item Is not found" });
};

// DONE
export const updateInventoryItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inventoryItem = await getById(id);
    if (!inventoryItem) {
        return res.status(404).json({ msg: "Inventory Item Is not found" });
    }
    const { name, price, count, thumbnail } = req.body;
    inventoryItem.name = name ? name : inventoryItem.name;
    inventoryItem.price = price ? price : inventoryItem.price;
    inventoryItem.count = count ? count : inventoryItem.count;
    inventoryItem.thumbnail = thumbnail ? thumbnail : inventoryItem.thumbnail;
    await inventoryItem.save();
    return res.json(inventoryItem);
};

// DONE
export const deleteInventoryItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inventoryItem = await getById(id);
    if (!inventoryItem) {
        return res.status(404).json({ msg: "Inventory Item I not found" });
    }
    await inventoryItem.remove();
    return res.json({ msg: "Inventory Item deleted" });
}

// DONE
export const allInventoryItems = async (req: Request, res: Response) => {
    const { inventoryId } = req.params;
    const inventoryItems = await getAllByInventoryId(inventoryId);
    if (!inventoryItems) {
        return res.status(404).json({ msg: "Inventory Items not found" });
    }
    return res.json(inventoryItems);
};
