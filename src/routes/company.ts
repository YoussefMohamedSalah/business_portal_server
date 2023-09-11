import { Router } from "express";
import { addCompany, getCompanyById, updateCompany, deleteCompany } from "../controller/CompanyController";
import { allCompanyInventories } from "../controller/InventoryController";
import { allCompanySuppliers } from "../controller/SupplierController";
import { getAllCompanyCustomers } from "../controller/CustomerController";
import { allCompanyProjects } from "../controller/ProjectController";
import { checkAuth } from "../middleware/checkAuth";
import { getCompanyUsers } from "../controller/UserController";
import { getCompanyDepartments } from "../controller/DepartmentController";
import { getAllTasksByCompanyId } from "../controller/TaskController";
import { getCompanyTenders } from "../controller/TenderController";
import { allCompanyGroups } from "../controller/GroupController";

const router = Router();
router.route("/").post(checkAuth, addCompany);
router.route("/").get(checkAuth, getCompanyById).put(checkAuth, updateCompany).delete(checkAuth, deleteCompany);
// **************************************************
router.route("/customer/").get(checkAuth, getAllCompanyCustomers);
router.route("/inventory/").get(checkAuth, allCompanyInventories);
router.route("/supplier/").get(checkAuth, allCompanySuppliers);
router.route("/task/").get(checkAuth, getAllTasksByCompanyId)
router.route("/project/").get(checkAuth, allCompanyProjects);
router.route("/department/").get(checkAuth, getCompanyDepartments)
router.route("/user/").get(checkAuth, getCompanyUsers);
router.route("/tender/").get(checkAuth, getCompanyTenders);
router.route("/group/").get(checkAuth, allCompanyGroups);

export { router as CompanyRouter };