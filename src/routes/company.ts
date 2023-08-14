import { Router } from "express";
import { addCompany, getCompanyById, updateCompany, deleteCompany } from "../controller/CompanyController";
import { allCompanyInventories } from "../controller/InventoryController";
import { allCompanySuppliers } from "../controller/SupplierController";
import { getAllCompanyCustomers } from "../controller/CustomerController";
import { allCompanyProjects } from "../controller/ProjectController";

const router = Router();
router.route("/").post(addCompany);
router.route("/:id").get(getCompanyById).put(updateCompany).delete(deleteCompany);
// **************************************************
router.route("/customer/:companyId").get(getAllCompanyCustomers);
router.route("/inventory/:companyId").get(allCompanyInventories);
router.route("/supplier/:companyId").get(allCompanySuppliers);
router.route("/project/:companyId").get(allCompanyProjects);




export { router as CompanyRouter };