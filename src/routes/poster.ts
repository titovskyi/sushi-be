import {Router} from "express";
import PosterController from "../controllers/PosterController";


const router = Router();

router.get('/categories', PosterController.getCategories);

router.get('/products', PosterController.getProducts);

export default router;
