import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { createInventory, getAllByCompanyId, getById, getWithItemsById } from '../repositories/InventoryRepository';
import { validateUUID } from '../utils/validateUUID';
import { processNumber } from '../utils/checkAndParse';

export const addInventory = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const { type, items_count, items_value } = req.body;
    try {
        if (companyId) return res.status(400).json({ msg: "Company id is required" });
        const company = await getCompanyById(companyId);
        if (!company) return res.status(404).json({ msg: "Company not found" });
        let toCheckType: { [key: string]: number | string | undefined } = {
            items_count: items_count && processNumber('Items Count', items_count!),
            items_value: items_value && processNumber('Items Value', items_value!),
        };
        for (const property in toCheckType) {
            if (typeof toCheckType[property] === 'string') {
                return { msg: toCheckType[property] };
            }
        }
        const createInput = {
            type,
            items_count,
            items_value
        }
        const inventory = await createInventory(createInput, company);
        if (!inventory) return res.status(409).json({ msg: "Field To Create Inventory" });
        else return res.status(200).json(inventory);
    } catch (error) {
        console.error("Error Adding Inventory:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const getInventoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const inventory = await getById(id);
        if (!inventory) return res.status(404).json({ msg: "Inventory not found" });
        return res.status(200).json(inventory);
    } catch (error) {
        console.error("Error Retrieving Inventory:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const allInventoryItems = async (req: Request, res: Response) => {
    const { inventoryId } = req.params;
    let isValidUUID = validateUUID(inventoryId);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const inventory = await getWithItemsById(inventoryId);
        if (!inventory) return res.status(404).json({ msg: "Inventory not found" });
        return res.status(200).json(inventory);
    } catch (error) {
        console.error("Error Retrieving Inventory Items:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

// DONE
// export const updateInventoryItems = async (req: Request, res: Response) => {
//     const { id } = req.params; if(!id) return res.status(400).json({msg: "id is required"});
//     const inventory = await getInventoryItemsById(id);
//     if (!inventory) {
//         return res.status(404).json({ msg: "Inventory not found" });
//     }
//     const { name, supplier_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
//     customer.name = name ? name : customer.name;
//     await customer.save();
//     return  res.status(200).json(customer);
// };

export const deleteInventory = async (req: Request, res: Response) => {
    const { id } = req.params;
    let isValidUUID = validateUUID(id);
    if (!isValidUUID) return res.status(400).json({ msg: "id is not valid" });
    try {
        const inventory = await getById(id);
        if (!inventory) return res.status(404).json({ msg: "Inventory not found" });

        await inventory.remove();
        return res.status(404).json({ msg: "Inventory deleted" });
    } catch (error) {
        console.error("Error Deleting Inventory:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}

export const allCompanyInventories = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    try {
        const inventories = await getAllByCompanyId(companyId);
        if (!inventories) return res.status(404).json({ msg: "Inventories not found" });
        return res.status(200).json(inventories);
    } catch (error) {
        console.error("Error Retrieving Inventories:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
