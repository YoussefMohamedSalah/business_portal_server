import { Router } from "express";
import { addSupplier, getSupplierById, updateSupplier, deleteSupplier } from "../controller/SupplierController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").post(checkAuth, addSupplier);
router.route("/:id").get(checkAuth, getSupplierById).put(checkAuth, updateSupplier).delete(checkAuth, deleteSupplier);

export { router as SupplierRouter };

// TWO GET ROUTES ERROR