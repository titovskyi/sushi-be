import {Router} from "express";
import InfoController from "../controllers/InfoController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router();

// Get Info hardcode in Controller ID=1 || req.params.infoId
router.get("/", InfoController.getOneById);

// Edit Info hardcode in Controller ID=1 || req.params.infoId
router.patch(
    "/",
    [checkJwt, checkRole(["ADMIN"])],
    InfoController.editInfo
);

export default router;
