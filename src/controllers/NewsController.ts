import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {News} from "../entity/News";
import {validate} from "class-validator";

class NewsController {
    static listAll = async (req: Request, res: Response) => {
        const newsRepository = getRepository(News);
        const news = await newsRepository.find({
            select: ["id", "header", "description", "image"]
        });

        res.send(news);
    };

    static getOneById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const newsRepository = getRepository(News);
        let news: News;

        try {
            news = await newsRepository.findOneOrFail(id, {
                select: ["id", "header", "description", "image"]
            });
        } catch (err) {
            res.status(404).send("Новость не найдена!");
        }

        res.send(news);
    }

    static newNews = async (req: Request, res: Response) => {
        let {header, description, image} = req.body;
        let newNews = new News();

        newNews.header = header;
        newNews.description = description;
        newNews.image = image;

        const errors = await validate(newNews);
        if(errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const newsRepository = getRepository(News);

        try {
            await newsRepository.save(newNews);
        } catch (err) {
            res.status(409).send("Новость с таким заголовком уже существует!");
            return;
        }

        res.send(newNews);
    };

    static editNews = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {header, description, image} = req.body;
        const newsRepository = getRepository(News);
        let news: News;

        try {
            news = await newsRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Новость не найдена!");
        }

        news.header = header;
        news.description = description;
        news.image = image;

        const errors = await validate(news);
        if(errors.length > 0) {
            res.status(409).send(errors);
            return;
        }

        try {
            await newsRepository.save(news);
        } catch(err) {
            res.status(409).send("Новость с таким заголовком уже существует!");
        }

        res.send(news);
    };

    static deleteNews = async (req: Request, res: Response) => {
        const id = req.params.id;
        const newsRepository = getRepository(News);
        let news: News;

        try {
            news = await newsRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Новость не найдена!");
        }

        await newsRepository.delete(id);

        res.status(204).send();
    };
}

export default NewsController;
