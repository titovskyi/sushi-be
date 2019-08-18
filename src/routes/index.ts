import {Router, Request, Response} from "express";
import auth from "./auth";
import user from "./user";
import comment from "./comment";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/comment", comment);

export default routes;
