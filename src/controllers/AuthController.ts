import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {User} from "../entity/User";
import config from "../config/config";

class AuthController {
    static login = async (req: Request, res: Response) => {

        // Check if username and password are set
        let {login, password} = req.body;
        console.log(login);
        console.log(password);
        if(!(login && password)) {
            res.status(400).send();
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail({where: {login} });
        } catch (err) {
            res.status(401).send();
        }

        // Check if encrypted password match
        if(!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        // Sign JWT, valid for 1h
        const token = jwt.sign(
            {userId: user.id, name: login},
             config.jwtSecret,
            {expiresIn: "1h"}
        );

        const userInfo = {
            role: user.role,
            token: token,
            expire: Date.now().toString()
        };

        res.send(userInfo);
    };

    static changePassword = async (req: Request, res: Response) => {

        // Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        // Get parameters from the body
        const {oldPassword, newPassword} = req.body;

        if(!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        // Get user from the db
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (err) {
            res.status(401).send();
        }

        // Check if old password matchs
        if(!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        // Validate model (password length)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Hash the new password and save
        user.hashPassword();
        await userRepository.save(user);
        res.status(204).send("Password Changed!");
    }
}

export default AuthController;
