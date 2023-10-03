import { Router } from "express";
import { addInventoryItem, getInventoryItemById, updateInventoryItem, deleteInventoryItem } from "../controller/InventoryItemController";
import { checkAuth } from "../middleware/checkAuth";
import uploadThumbnail from "../middleware/upload/thumbnailUpload";

const router = Router();

router.route("/:inventoryId").post(checkAuth, uploadThumbnail.single('thumbnail'), addInventoryItem);
router.route("/:id").get(checkAuth, getInventoryItemById).put(checkAuth, uploadThumbnail.single('thumbnail'), updateInventoryItem).delete(checkAuth, deleteInventoryItem);

export { router as InventoryItemRouter };