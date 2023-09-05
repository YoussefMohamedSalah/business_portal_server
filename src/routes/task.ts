import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import { addTask, updateTask, deleteTask, getTaskById } from "../controller/TaskController";

const router = Router();

router.route("/").post(checkAuth, addTask);
router.route("/:id").get(checkAuth, getTaskById).put(checkAuth, updateTask).delete(checkAuth, deleteTask);


export { router as TaskRouter };