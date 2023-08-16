import { Router } from "express";
import { addCustomer, getCustomerById, updateCustomer, deleteCustomer } from "../controller/CustomerController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

router.route("/").post(checkAuth, addCustomer);
router.route("/:id").get(checkAuth, getCustomerById).put(checkAuth, updateCustomer).delete(checkAuth, deleteCustomer);

export { router as CustomerRouter };