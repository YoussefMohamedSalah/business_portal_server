import { Router } from "express";
import { getAllPcRequests, getAllPoRequests, getAllMaterialRequests, getAllSiteRequests, deleteRequest, updatePoRequest, updatePcRequest, updateSiteRequest, updateMaterialRequest, getRequestById, createRequest } from "../controller/RequestsController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
router.route("/:projectId").post(checkAuth, createRequest)
// **************************************************
router.route("/purchase_order").get(checkAuth, getAllPoRequests);
router.route("/petty_cash").get(checkAuth, getAllPcRequests);
router.route("/material").get(checkAuth, getAllMaterialRequests);
router.route("/site").get(checkAuth, getAllSiteRequests);
// UPDATE
router.route('/petty_cash_request/:id').put(checkAuth, updatePcRequest);
router.route('/purchase_order_request/:id').put(checkAuth, updatePoRequest);
router.route('/material_request/:id').put(checkAuth, updateMaterialRequest);
router.route('/site_request/:id').put(checkAuth, updateSiteRequest);
// GetById, DELETE
router.route('/:id').get(checkAuth, getRequestById).delete(checkAuth, deleteRequest);

export { router as RequestRouter };