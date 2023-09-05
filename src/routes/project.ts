import { Router } from "express";
import {
    addProject,
    getProjectById,
    updateProject,
    deleteProject,
    getAllProjectPoRequests,
    getAllProjectPcRequests,
    getAllProjectMaterialRequests,
    getAllProjectSiteRequests,
} from "../controller/ProjectController";
import { checkAuth } from "../middleware/checkAuth";
import { getAllTasksByProjectId } from "../controller/TaskController";

const router = Router();

router.route("/").post(checkAuth, addProject);
router.route("/tasks/:id").get(checkAuth, getAllTasksByProjectId);
router.route("/:id").get(checkAuth, getProjectById).patch(checkAuth, updateProject).delete(checkAuth, deleteProject);

// ** requests **
router.route("/purchase_order/:projectId").get(checkAuth, getAllProjectPoRequests);
router.route("/petty_cash/:projectId").get(checkAuth, getAllProjectPcRequests);
router.route("/material/:projectId").get(checkAuth, getAllProjectMaterialRequests);
router.route("/site/:projectId").get(checkAuth, getAllProjectSiteRequests);

export { router as ProjectRouter };