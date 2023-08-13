import { Router } from "express";
import { addInventoryItem, getInventoryItemById, updateInventoryItem, deleteInventoryItem, allInventoryItems } from "../controller/InventoryItemController";

const router = Router();

router.route("/:inventoryId").post(addInventoryItem);
router.route("/:id").get(getInventoryItemById).put(updateInventoryItem).delete(deleteInventoryItem);
router.route("/:inventoryId").get(allInventoryItems);

export { router as InventoryItemRouter };