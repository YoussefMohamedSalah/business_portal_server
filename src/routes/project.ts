import { Router } from "express";
import { addProject, getProjectById, deleteProject, allCompanyProjects } from "../controller/ProjectController";

const router = Router();

router.route("/:companyId").post(addProject);
router.route("/:id").get(getProjectById).delete(deleteProject);
router.route("/:companyId").get(allCompanyProjects);

export { router as ProjectRouter };