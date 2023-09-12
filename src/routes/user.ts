import { Router } from "express";
import { getUserById, updateUser, deleteUser, getManagers, getDepartmentUsers, addUser } from "../controller/UserController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
router.route("/").post(checkAuth, addUser);
router.route("/manager").get(checkAuth, getManagers);
router.route("/department/:id").get(checkAuth, getDepartmentUsers);
router.route("/:id").get(checkAuth, getUserById).put(checkAuth, updateUser).delete(checkAuth, deleteUser);



export { router as UserRouter };