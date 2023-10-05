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
    addProjectComment,
    removeProjectComment,
    getAllEmployeesByProjectId
} from "../controller/ProjectController";
import { checkAuth } from "../middleware/checkAuth";
import { getAllTasksByProjectId } from "../controller/TaskController";
import uploadThumbnail from "../middleware/upload/thumbnailUpload";
import { getAllContractsByProject } from "../controller/ContractController";

const router = Router();

router.route("/").post(checkAuth, uploadThumbnail.single('thumbnail'), addProject);
// TASK
router.route("/tasks/:id").get(checkAuth, getAllTasksByProjectId);
// COMMENTS
router.route("/comment/add/:id").put(checkAuth, addProjectComment);
router.route("/comment/remove/:id").put(checkAuth, removeProjectComment);
// EMPLOYEES
router.route('/employees/:id').get(checkAuth, getAllEmployeesByProjectId)


// ** requests **
router.route("/purchase_order/:projectId").get(checkAuth, getAllProjectPoRequests);
router.route("/petty_cash/:projectId").get(checkAuth, getAllProjectPcRequests);
router.route("/material/:projectId").get(checkAuth, getAllProjectMaterialRequests);
router.route("/site/:projectId").get(checkAuth, getAllProjectSiteRequests);
router.route("/contract/:projectId").get(checkAuth, getAllContractsByProject);


router.route("/:id").get(checkAuth, getProjectById).patch(checkAuth, updateProject).delete(checkAuth, deleteProject);

export { router as ProjectRouter };