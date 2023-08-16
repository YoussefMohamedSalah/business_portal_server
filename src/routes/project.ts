import { Router } from "express";
import { addProject, getProjectById, updateProject, deleteProject } from "../controller/ProjectController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").post(checkAuth, addProject);
router.route("/:id").get(checkAuth, getProjectById).put(checkAuth, updateProject).delete(checkAuth, deleteProject);

export { router as ProjectRouter };