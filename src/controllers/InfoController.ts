import {Response, Request} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import {Info} from "../entity/Info";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as PATH from "path";

class InfoController {


    static getOneById = async (req: Request, res: Response) => {

        const id: number = req.params.infoId || 1;
        const infoRepository = getRepository(Info);
        let info: Info;

        try {
            info = await infoRepository.findOneOrFail(id, {
                select: [
                    "id",
                    "city",
                    "delivery_info",
                    "delivery_time",
                    "logo",
                    "map",
                    "phone"
                ]
            });
            // console.log(info);
        } catch (err) {
            // console.log(err);
            res.status(404).send("Ошибка в получении информации!");
        }

        res.send(info);
    };

    static editInfo = async (req: Request, res: Response) => {
        const id: number = req.params.id || 1;
        const {city, delivery_info, delivery_time, logo, map, phone, prev_logo_name } = req.body;
        const infoRepository = getRepository(Info);
        let info: Info;

        try {
            info = await infoRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Ошибка изменения информации!");
            return;
        }

        info.city = city;
        info.delivery_info = delivery_info;
        info.delivery_time = delivery_time;
        if (logo) {
            info.logo = logo;
        }
        info.map = map;
        info.phone = phone;

        const errors = await validate(info);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await infoRepository.save(info);
        } catch (err) {
            res.status(409).send("Данные неверное введены!");
        }

        if (logo && logo !== prev_logo_name) {
            fs.unlinkSync(PATH.resolve(`public\\uploads\\${prev_logo_name}`));
        }

        res.send(info);
    }
}

export default InfoController;
