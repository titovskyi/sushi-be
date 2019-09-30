import {Router, Request, Response} from "express";
import auth from "./auth";
import user from "./user";
import comment from "./comment";
import info from "./info";
import upload from "./upload";
import news from "./news";
import product from "./product";
import poster from "./poster";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/comment", comment);
routes.use("/info", info);
routes.use("/upload", upload);
routes.use("/news", news);
routes.use("/product", product);
routes.use("/poster", poster);

export default routes;
