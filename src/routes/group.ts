import { Router } from "express";
import { getGroupById, createGroup, updateGroup, deleteGroup, addUserToGroup, removeUserFromGroup, addUserToGroupByProjectId, removeUserFromGroupByProjectId } from "../controller/GroupController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();


router.route("/").post(checkAuth, createGroup);

router.route("/add/:id").put(checkAuth, addUserToGroup);
router.route("/remove/:id").put(checkAuth, removeUserFromGroup);

router.route("/project/add/:id").put(checkAuth, addUserToGroupByProjectId);
router.route("/project/remove/:id").put(checkAuth, removeUserFromGroupByProjectId);



router.route("/:id").get(checkAuth, getGroupById).put(checkAuth, updateGroup).delete(checkAuth, deleteGroup);

export { router as GroupRouter };