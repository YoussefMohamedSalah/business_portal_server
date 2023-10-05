import { Router } from "express";
import { addContract, getContractById, updateContract, deleteContract } from "../controller/ContractController";
import { checkAuth } from "../middleware/checkAuth";
import uploadFiles from "../middleware/upload/uploadMultiFiles";
import { getAllInvoicesByContract } from "../controller/InvoiceController";

const router = Router();

router.route("/:projectId").post(checkAuth, uploadFiles.array('files'), addContract);
router.route("/invoices/:id").get(checkAuth, getAllInvoicesByContract)
router.route("/:id").get(checkAuth, getContractById).put(checkAuth, updateContract).delete(checkAuth, deleteContract);

export { router as ContractRouter };