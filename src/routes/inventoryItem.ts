import { Router } from "express";
import { addInventoryItem, getInventoryItemById, updateInventoryItem, deleteInventoryItem } from "../controller/InventoryItemController";

const router = Router();

router.route("/:inventoryId").post(addInventoryItem);
router.route("/:id").get(getInventoryItemById).put(updateInventoryItem).delete(deleteInventoryItem);

export { router as InventoryItemRouter };