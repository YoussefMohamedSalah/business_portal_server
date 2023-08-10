import { Router } from "express";

import { addCompany, getCompanyById, updateCompany, deleteCompany } from "../controller/CompanyController";

const router = Router();
router.route("/").post(addCompany);
router.route("/:id").get(getCompanyById).put(updateCompany).delete(deleteCompany);



export { router as CompanyRouter };