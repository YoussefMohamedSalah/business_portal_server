import { Request, Response } from 'express';
import { getById as getCompanyById } from '../repositories/CompanyRepository';
import { CreateInventoryInfo } from 'src/types/CreateInventory';
import { createInventory, getAllByCompanyId, getById } from '../repositories/InventoryRepository';

// DONE
export const addInventory = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const createData: CreateInventoryInfo = req.body;
    // first get company by id
    if (companyId) return res.status(400).json({ msg: "Company id is required" });
    const company = await getCompanyById(companyId);
    if (!company) return res.status(404).json({ msg: "Company not found" });
    // then create Inventory
    const inventory = await createInventory(createData, company);
    if (!inventory) return res.status(409).json({ msg: "Field To Create Inventory" });
    else return res.json(inventory);
};

// DONE
export const getInventoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inventory = await getById(id);
    if (inventory) {
        return res.json(inventory);
    }
    return res.status(404).json({ msg: "Inventory not found" });
};

// DONE
// export const updateInventoryItems = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const inventory = await getInventoryItemsById(id);
//     if (!inventory) {
//         return res.status(404).json({ msg: "Inventory not found" });
//     }
//     const { name, supplier_type, company_name, vat_on, representative, phone_number, email, country, city, area, street, building_number, postal_code } = req.body;
//     customer.name = name ? name : customer.name;
//     await customer.save();
//     return res.json(customer);
// };

// DONE
export const deleteInventory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const inventory = await getById(id);
    if (!inventory) {
        return res.status(404).json({ msg: "Inventory not found" });
    }
    await inventory.remove();
    return res.json({ msg: "Inventory deleted" });
}

// DONE
export const allCompanyInventories = async (req: Request, res: Response) => {
    const { companyId } = req.userData!;
    const inventories = await getAllByCompanyId(companyId);
    if (!inventories) {
        return res.status(404).json({ msg: "Inventories not found" });
    }
    return res.json(inventories);
};
