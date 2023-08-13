import { Router } from "express";
import { addSupplier, getSupplierById, updateSupplier, deleteSupplier, allCompanySuppliers } from "../controller/SupplierController";

const router = Router();

router.route("/:companyId").post(addSupplier);
router.route("/:id").get(getSupplierById).put(updateSupplier).delete(deleteSupplier);
router.route("/:companyId").get(allCompanySuppliers);

export { router as SupplierRouter };