import {Response, Request} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";

import {User} from "../entity/User";

class UserController {
    static listAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: [
                "id",
                "username",
                "role"
            ]
        });

        res.send(users);
    }

    // TODO remove res.send(user)
    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: number = req.params.userid;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "role"] //We dont want to send the password on response
            });
        } catch (err) {
            res.status(404).send("User not found.");
        }

        res.send(user)
    }

    static newUser = async (req: Request, res: Response) => {

        // Get parameters from body
        let {username, password, role} = req.body;
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        // Validate if parameters are ok
        const errors = await validate(user);

        if(errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Hash password for secure store on DB
        user.hashPassword();

        // Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);

        try {
            await userRepository.save(user);
        } catch (err) {
            res.status(409).send("username already in use");
            return;
        }

        // If all ok, send 201 res
        res.status(201).send("User created!");
    }

    static editUser = async (req: Request, res: Response) => {

        // Get the ID from the URL
        const id = req.params.id;

        // Get values from the body
        const {username, role} = req.body;

        // Try to find user on DB
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("User not found!");
            return;
        }

        // Valid a new values of model
        user.username = username;
        user.role = role;
        const errors = await validate(user);
        if(errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Try to save, if fails, username already in use
        try {
            await userRepository.save(user);
        } catch (err) {
            res.status(409).send("username already in use!");
        }

        res.status(204).send();
    }

    static deleteUser = async (req: Request, res: Response) => {

        // Get user Id from URL
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("User not found!");
            return;
        }

        await userRepository.delete(id);

        res.status(204).send();
    }
}

export default UserController;

