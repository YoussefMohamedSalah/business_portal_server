import { Router } from "express";
import { addSupplier, getSupplierById, updateSupplier, deleteSupplier } from "../controller/SupplierController";

const router = Router();

router.route("/:companyId").post(addSupplier);
router.route("/:id").get(getSupplierById).put(updateSupplier).delete(deleteSupplier);

export { router as SupplierRouter };

// TWO GET ROUTES ERROR