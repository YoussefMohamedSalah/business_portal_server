import { Router } from "express";
import { addInventory, getInventoryById, deleteInventory } from "../controller/InventoryController";
import { allInventoryItems } from "../controller/InventoryItemController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").post(checkAuth, addInventory);
router.route("/:id").get(checkAuth, getInventoryById).delete(checkAuth, deleteInventory);
// ******************************************************
router.route("/inventory_item/:inventoryId").get(checkAuth, allInventoryItems);

export { router as InventoryRouter };