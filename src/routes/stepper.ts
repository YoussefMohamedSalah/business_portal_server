import { Router } from "express";

import { updateUserPosition, verifyOtp, updateCompany, sendOtp } from "../controller/StepperController";

const router = Router();

// this is for user position.. in stepper
router.route("/user/:id").put(updateUserPosition);

// this is for user verification otp get and post
// post for user to send otp and we i will response with success or field
router.route("/otp/:token").post(verifyOtp);
router.route("/otp").post(sendOtp);

// this is for company info.. in stepper
router.route("/company/:id").post(updateCompany);





export { router as StepperRouter };