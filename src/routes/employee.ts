import { Router } from "express";
import { getUserById, getCurrentUser, updateUser, deleteUser, getManagers, getDepartmentUsers, addUser, getAllWithGroups } from "../controller/UserController";
import { checkAuth } from "../middleware/checkAuth";
import { getAllTasksByUserId } from "../controller/TaskController";

const router = Router();
router.route("/").post(checkAuth, addUser);
router.route("/").get(checkAuth, getCurrentUser);
router.route("/groups/").get(checkAuth, getAllWithGroups);


router.route("/task/").get(checkAuth, getAllTasksByUserId)
router.route("/manager").get(checkAuth, getManagers);
router.route("/department/:id").get(checkAuth, getDepartmentUsers);
router.route("/:id").get(checkAuth, getUserById).put(checkAuth, updateUser).delete(checkAuth, deleteUser);



export { router as EmployeeRouter };