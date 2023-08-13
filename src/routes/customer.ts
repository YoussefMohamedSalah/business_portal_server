import { Router } from "express";
import { addCustomer, getCustomerById, updateCustomer, deleteCustomer, getAllCompanyCustomers } from "../controller/CustomerController";

const router = Router();

router.route("/:companyId").post(addCustomer);

router.route("/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

router.route("/:companyId").get(getAllCompanyCustomers);

export { router as CustomerRouter };