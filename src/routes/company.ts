import { Router } from "express";
import { addCompany, getCompanyById, updateCompany, deleteCompany } from "../controller/CompanyController";
import { allCompanyInventories } from "../controller/InventoryController";
import { allCompanySuppliers } from "../controller/SupplierController";
import { getAllCompanyCustomers } from "../controller/CustomerController";
import { getAllCompanySubcontractors } from "../controller/SubcontractorController";
import { allCompanyProjects } from "../controller/ProjectController";
import { checkAuth } from "../middleware/checkAuth";
import { getCompanyUsers } from "../controller/UserController";
import { getCompanyDepartments } from "../controller/DepartmentController";
import { getTasksByCompanyId } from "../controller/TaskController";
import { getCompanyTenders } from "../controller/TenderController";
import { allCompanyGroups } from "../controller/GroupController";
import { getAllInvoicesByCompany } from "../controller/SubcontractorInvoiceController";

const router = Router();
router.route("/").post(checkAuth, addCompany);
router.route("/").get(checkAuth, getCompanyById).put(checkAuth, updateCompany).delete(checkAuth, deleteCompany);
// **************************************************
router.route("/customer/").get(checkAuth, getAllCompanyCustomers);
router.route("/subcontractor/").get(checkAuth, getAllCompanySubcontractors);
router.route("/subcontractor_invoice/").get(checkAuth, getAllInvoicesByCompany);
router.route("/inventory/").get(checkAuth, allCompanyInventories);
router.route("/supplier/").get(checkAuth, allCompanySuppliers);
router.route("/department/").get(checkAuth, getCompanyDepartments)
router.route("/employee/").get(checkAuth, getCompanyUsers);
router.route("/tender/").get(checkAuth, getCompanyTenders);


router.route("/project/").get(checkAuth, allCompanyProjects);
router.route("/group/").get(checkAuth, allCompanyGroups);
router.route("/task/").get(checkAuth, getTasksByCompanyId)

export { router as CompanyRouter };