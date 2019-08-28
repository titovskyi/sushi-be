import {Router} from "express";
import NewsController from "../controllers/NewsController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router();

router.get("/", NewsController.listAll);

router.get(
    "/:id([0-9]+)",
    NewsController.getOneById
);

router.post(
    "/",
    [checkJwt, checkRole(["ADMIN"])],
    NewsController.newNews
);

router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    NewsController.editNews
);

router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])]
);

export default router;
