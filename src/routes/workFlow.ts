import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import { getAllWorkFlow , updateWorkFlow} from "../controller/WorkflowController";

const router = Router();
// router.route("/:projectId").post(checkAuth, createRequest)
router.route('/').get(checkAuth, getAllWorkFlow).put(checkAuth, updateWorkFlow);

// **************************************************
// router.route("/purchase_order").get(checkAuth, getAllPoRequests);
// router.route("/petty_cash").get(checkAuth, getAllPcRequests);
// router.route("/material").get(checkAuth, getAllMaterialRequests);
// router.route("/site").get(checkAuth, getAllSiteRequests);
// // UPDATE
// router.route('/petty_cash_request/:id').put(checkAuth, updatePcRequest);
// router.route('/purchase_order_request/:id').put(checkAuth, updatePoRequest);
// router.route('/material_request/:id').put(checkAuth, updateMaterialRequest);
// router.route('/site_request/:id').put(checkAuth, updateSiteRequest);
// // GetById, DELETE
// router.route('/:id').get(checkAuth, getRequestById).delete(checkAuth, deleteRequest);

export { router as WorkFlowRouter };