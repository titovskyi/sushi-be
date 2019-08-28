import {getRepository} from "typeorm";
import {Comment} from "../entity/Comment";
import {Request, Response} from "express";
import {validate} from "class-validator";

class CommentController {
    static listAll = async (req: Request, res: Response) => {
        const commentRepository = getRepository(Comment);
        const comments = await commentRepository.find({
            select: ["id", "name", "header", "comment", "createdAt"]
        });

        res.send(comments);
    };

    static newComment = async (req: Request, res: Response) => {
        // Get parameters from body
        let {name, comment, header} = req.body;
        let newComment = new Comment();

        newComment.header = header;
        newComment.name = name;
        newComment.comment = comment;
        // Validate if parameters are ok
        const errors = await validate(newComment);

        if(errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Try to save. If fails, the username is already in use
        const commentRepository = getRepository(Comment);

        try {
            await commentRepository.save(newComment);
        } catch (err) {
            res.status(409).send("Не повторяйне коментарий!");
            return;
        }

        res.send(newComment);
    };

    static deleteComment = async (req: Request, res: Response) => {
        const id = req.params.id;
        const commentRepository = getRepository(Comment);
        let comment: Comment;
        console.log(id);
        try {
            comment = await commentRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Коментарий не найден!")
        }

        await commentRepository.delete(id);

        res.status(204).send();
    };

}

export default CommentController
