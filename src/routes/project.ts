import { Router } from "express";
import { addProject, getProjectById, updateProject, deleteProject, getAllProjectPoRequests, getAllProjectPcRequests, getAllProjectMaterialRequests, getAllProjectSiteRequests } from "../controller/ProjectController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").post(checkAuth, addProject);
// requests
router.route("/purchase_order/:projectId").get(checkAuth, getAllProjectPoRequests);
router.route("/petty_cash/:projectId").get(checkAuth, getAllProjectPcRequests);
router.route("/material/:projectId").get(checkAuth, getAllProjectMaterialRequests);
router.route("/site/:projectId").get(checkAuth, getAllProjectSiteRequests);

router.route("/:id").get(checkAuth, getProjectById).put(checkAuth, updateProject).delete(checkAuth, deleteProject);

export { router as ProjectRouter };