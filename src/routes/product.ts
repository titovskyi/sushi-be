import {Router} from "express";
import ProductController from "../controllers/ProductController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router();

router.get("/", ProductController.listAll);

router.get("/:id([0-9]+)", ProductController.getProductById);

router.post(
    "/",
    [checkJwt, checkRole(["ADMIN"])],
    ProductController.newProduct
);

router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    ProductController.editProduct
);

router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    ProductController.deleteProduct
);

export default router;
