import { Router } from "express";
import { createGroup, getGroupById, updateGroup, deleteGroup, addUserToGroup, removeUserFromGroup } from "../controller/GroupController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").post(checkAuth, createGroup);
router.route("/add/:id").put(checkAuth, addUserToGroup);
router.route("/remove/:id").put(checkAuth, removeUserFromGroup);
router.route("/:id").get(checkAuth, getGroupById).put(checkAuth, updateGroup).delete(checkAuth, deleteGroup);

export { router as GroupRouter };