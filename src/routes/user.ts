import { Router } from "express";

import { addUser, getUserById, updateUser, deleteUser, getAllUsers } from "../controller/UserController";

const router = Router();
router.route("/").post(addUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.route("/").get(getAllUsers);



export { router as StoreRouter };