import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import { addTender, updateTender, deleteTender, getTenderById } from "../controller/TenderController";

const router = Router();

router.route("/").post(checkAuth, addTender);
router.route("/:id").get(checkAuth, getTenderById).put(checkAuth, updateTender).delete(checkAuth, deleteTender);


export { router as TenderRouter };