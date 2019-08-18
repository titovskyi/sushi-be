import {Router} from "express";
import CommentController from "../controllers/CommentController";

import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router();

// Get All Comments
router.get(
    '/',
    CommentController.listAll
);

// Create New Comment
router.post('/', CommentController.newComment);

// Remove Comment
router.delete(
    '/:id([0-9]+)',
    [checkJwt, checkRole(['ADMIN'])],
     CommentController.deleteComment
);

export default router;
