import {Request, Response, NextFunction} from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // GET JWT FROM HEADER
    const token = <string>req.headers["auth"];
    let jwtPayload;

    // TRY TO VALIDATE THE TOKEN AND GET DATA
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload
    } catch (err) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send();
        return;
    }

    // THE TOKEN IS VALID FOR 1 HOUR
    // SEND TOKEN ON EVERY REQUEST
    const {userId, name} = jwtPayload;
    const newToken = jwt.sign({userId, name}, config.jwtSecret, {
        expiresIn: "1h"
    });
    res.setHeader("token", newToken);

    next();
};
