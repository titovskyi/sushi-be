import {Router} from "express";
import UserController from "../controllers/UserController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router();

// GET ALL USERS
router.get("/", [checkJwt, checkRole(["ADMIN"])], UserController.listAll);

// GET ONE USER
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.getOneById
);

// CREATE A NEW USER
router.post(
    "/",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.newUser
);

// EDIT ONE USER
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.editUser
);

// DELETE ONE USER
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    UserController.deleteUser
);

export default router;
