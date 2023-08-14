import { Router } from "express";
import { addInventory, getInventoryById, deleteInventory } from "../controller/InventoryController";
import { allInventoryItems } from "src/controller/InventoryItemController";

const router = Router();

router.route("/:companyId").post(addInventory);
router.route("/:id").get(getInventoryById).delete(deleteInventory);
// ******************************************************
router.route("/inventory_item/:inventoryId").get(allInventoryItems);

export { router as InventoryRouter };