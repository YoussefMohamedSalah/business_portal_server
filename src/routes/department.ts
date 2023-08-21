import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import { getDepartmentById } from "../controller/DepartmentController";

const router = Router();
router.route("/:id").get(checkAuth, getDepartmentById);

export { router as DepartmentRouter };