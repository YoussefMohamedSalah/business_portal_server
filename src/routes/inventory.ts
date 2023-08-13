import { Router } from "express";
import { addInventory, getInventoryById, deleteInventory, allCompanyInventories } from "../controller/InventoryController";

const router = Router();

router.route("/:companyId").post(addInventory);
router.route("/:id").get(getInventoryById).delete(deleteInventory);
router.route("/:companyId").get(allCompanyInventories);

export { router as InventoryRouter };