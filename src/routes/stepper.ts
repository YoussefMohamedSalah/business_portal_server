import { Router } from "express";
import { updateUserPosition, verifyOtp, updateCompany, sendOtp } from "../controller/StepperController";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

// this is for user position.. in stepper
router.route("/user").put(checkAuth, updateUserPosition);

// this is for user verification otp get and post
// post for user to send otp and we i will response with success or field
router.route("/otp/:token").post(checkAuth, verifyOtp);
router.route("/otp").post(checkAuth, sendOtp);

// this is for company info.. in stepper
router.route("/company").put(checkAuth, updateCompany);


export { router as StepperRouter };