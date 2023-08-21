import { Router } from "express";
import { getAllPcRequests, getAllPoRequests, getAllMaterialRequests, getAllSiteRequests } from "../controller/RequestsController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
// **************************************************
router.route("/purchase_order/").get(checkAuth, getAllPoRequests);
router.route("/petty_cash").get(checkAuth, getAllPcRequests);
router.route("/material/").get(checkAuth, getAllMaterialRequests);
router.route("/site/").get(checkAuth, getAllSiteRequests);

export { router as RequestRouter };