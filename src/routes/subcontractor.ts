import { Router } from "express";
import { addSubcontractor, getSubcontractorById, updateSubcontractor, deleteSubcontractor } from "../controller/SubcontractorController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").post(checkAuth, addSubcontractor);
router.route("/:id").get(checkAuth, getSubcontractorById).put(checkAuth, updateSubcontractor).delete(checkAuth, deleteSubcontractor);

export { router as SubcontractorRouter };