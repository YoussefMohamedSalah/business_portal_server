import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
// import { uploadTest } from "../controller/UploadTest";

const router = Router();

// router.route("/").post(uploadTest);


export { router as UploadTestRouter };
