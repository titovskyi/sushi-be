import {Request, Response, NextFunction} from "express";
import {getRepository} from "typeorm";

import {User} from "../entity/User";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // GET THE USER ID FROM PREV MIDDLEWARE
        const id = res.locals.jwtPayload.userId;
        // GET USER ROLE FROM DB
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            res.status(401).send()
        }

        //  CHECK IF ARRAY OF AUTHIRIZED ROLES INCLUDES THE USER'S ROLE
        if(roles.indexOf(user.role) > -1) {
            next();
        } else {
            res.status(401).send('Пользователь не имеет доступа!');
        }
    };
};
