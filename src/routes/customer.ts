import { Router } from "express";
import { addCustomer, getCustomerById, updateCustomer, deleteCustomer } from "../controller/CustomerController";

const router = Router();

router.route("/:companyId").post(addCustomer);
router.route("/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

export { router as CustomerRouter };