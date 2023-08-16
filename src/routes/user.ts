import { Router } from "express";
import { getUserById, updateUser, deleteUser, getCompanyUsers, getDepartmentUsers } from "../controller/UserController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
// router.route("/").post(addUser);
router.route("/:id").get(checkAuth, getUserById).put(checkAuth, updateUser).delete(checkAuth, deleteUser);
router.route("/company").get(checkAuth, getCompanyUsers);
router.route("/department/:id").get(checkAuth, getDepartmentUsers);



export { router as UserRouter };