import { Router } from "express";
import { addNewCustomer, getCustomerById, updateCustomer, deleteCustomer, allCustomers, allCustomersForOwner } from "../controller/CustomerController";

const router = Router();

// when adding new owner That should have owner id 
router.route("/:ownerId").post(addNewCustomer);

// get or update or delete customer by Customer id and ownerId to make sure that the customer is created by the owner
router.route("/:ownerId/:id").get(getCustomerById).put(updateCustomer).delete(deleteCustomer);

// get all customers that created by single owner
router.route("/:ownerId").get(allCustomersForOwner);

// get all customers for single store
router.route("/:ownerId/:storeId").get(allCustomers);

export { router as CustomerRouter };