import { Router } from "express";
import { addCompany, getCompanyById, updateCompany, deleteCompany } from "../controller/CompanyController";
import { allCompanyInventories } from "../controller/InventoryController";
import { allCompanySuppliers } from "../controller/SupplierController";
import { getAllCompanyCustomers } from "../controller/CustomerController";
import { allCompanyProjects } from "../controller/ProjectController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();
router.route("/").post(checkAuth,addCompany);
router.route("/").get(checkAuth,getCompanyById).put(checkAuth,updateCompany).delete(checkAuth,deleteCompany);
// **************************************************
router.route("/customer").get(checkAuth, getAllCompanyCustomers);
router.route("/inventory").get(checkAuth, allCompanyInventories);
router.route("/supplier").get(checkAuth, allCompanySuppliers);
router.route("/project").get(checkAuth, allCompanyProjects);




export { router as CompanyRouter };