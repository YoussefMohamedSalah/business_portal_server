import { Router } from "express";
import { addProject, getProjectById, updateProject, deleteProject } from "../controller/ProjectController";

const router = Router();

router.route("/:companyId").post(addProject);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

export { router as ProjectRouter };