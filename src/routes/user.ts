import { Router } from "express";
import { getUserById, updateUser, deleteUser, getManagers, getDepartmentUsers } from "../controller/UserController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
// router.route("/").post(addUser);
router.route("/manager/").get(checkAuth, getManagers);
// router.route("/company").get(checkAuth, getCompanyUsers);
router.route("/department/:id").get(checkAuth, getDepartmentUsers);
router.route("/:id").get(checkAuth, getUserById).put(checkAuth, updateUser).delete(checkAuth, deleteUser);



export { router as UserRouter };