import { Router } from "express";
import { addContract, getContractById, updateContract, deleteContract } from "../controller/SubcontractorContractController";
import { checkAuth } from "../middleware/checkAuth";
import uploadFiles from "../middleware/upload/uploadMultiFiles";

const router = Router();

router.route("/:projectId").post(checkAuth, uploadFiles.array('files'), addContract);
router.route("/:id").get(checkAuth, getContractById).put(checkAuth, updateContract).delete(checkAuth, deleteContract);

export { router as SubcontractorContractRouter };