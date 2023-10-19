import { Router } from "express";
import { updatePosition } from "../../controller/PositionController";

const router = Router();

router.route("/user/").put(updatePosition);

export { router as BusinessRouter };
