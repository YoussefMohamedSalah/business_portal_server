import { Router } from "express";

import { getUserById, updateUser, deleteUser, getCompanyUsers, getDepartmentUsers } from "../controller/UserController";

const router = Router();
// router.route("/").post(addUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.route("/company/:id").get(getCompanyUsers);
router.route("/department/:id").get(getDepartmentUsers);



export { router as UserRouter };