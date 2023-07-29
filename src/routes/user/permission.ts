import { Router } from "express";
import { addPermission, getBusinessById, updatePermission, deletePermission, allPermissions } from "../controller/PermissionController";

const router = Router();

router.route("/").post(addNewBusiness);
router.route("/:storeId/:id").get(getBusinessById).put(updateBusiness).delete(deleteBusiness);
router.route("/:ownerId").get(allBusinesses);

export { router as BusinessRouter };
