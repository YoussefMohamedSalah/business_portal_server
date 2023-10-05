import { Router } from "express";
import { addInvoice, getInvoiceById, updateInvoice, deleteInvoice } from "../controller/InvoiceController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/:contractId").post(checkAuth, addInvoice);
router.route("/:id").get(checkAuth, getInvoiceById).put(checkAuth, updateInvoice).delete(checkAuth, deleteInvoice);

export { router as InvoiceRouter };