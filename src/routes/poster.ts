import {Router} from "express";
import PosterController from "../controllers/PosterController";


const router = Router();

router.get('/categories', PosterController.getCategories);

router.get('/products', PosterController.getProducts);

router.post('/order', PosterController.sendOrder);

export default router;
