import { Router } from "express";
import { addInventoryItem, getInventoryItemById, updateInventoryItem, deleteInventoryItem } from "../controller/InventoryItemController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/:inventoryId").post(checkAuth, addInventoryItem);
router.route("/:id").get(checkAuth, getInventoryItemById).put(checkAuth, updateInventoryItem).delete(checkAuth, deleteInventoryItem);

export { router as InventoryItemRouter };