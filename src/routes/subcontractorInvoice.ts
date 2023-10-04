import { Router } from "express";
import { addInvoice, getInvoiceById, updateInvoice, deleteInvoice } from "../controller/SubcontractorInvoiceController";
import { checkAuth } from "../middleware/checkAuth";
import uploadFiles from "../middleware/upload/uploadMultiFiles";

const router = Router();

router.route("/:projectId").post(checkAuth, uploadFiles.array('files'), addInvoice);
router.route("/:id").get(checkAuth, getInvoiceById).put(checkAuth, updateInvoice).delete(checkAuth, deleteInvoice);

export { router as SubcontractorInvoiceRouter };