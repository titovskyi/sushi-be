import {Response, Request} from "express";
import {getRepository} from "typeorm";
import {validate} from "class-validator";
import {User} from "../entity/User";

class UserController {
    static listAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "login", "name", "sername", "phone", "role" ]
        });
        const filteredUsers =  users.filter((user) => user.login !== 'admin');

        res.send(filteredUsers);
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: any = req.params.userid;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id, {
                select: ["id", "login", "name", "sername", "phone", "role" ] //We dont want to send the password on response
            });
        } catch (err) {
            res.status(404).send("Пользователь не найден!");
        }

        res.send(user)
    };

    static newUser = async (req: Request, res: Response) => {

        // Get parameters from body
        let {login, name, sername, phone, password, role} = req.body;
        let user = new User();
        user.login = login;
        user.name = name;
        user.sername = sername;
        user.phone = phone;
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
            res.status(409).send("Телефон уже используется!");
            return;
        }

        res.send(user);
    };

    static editUser = async (req: Request, res: Response) => {

        // Get the ID from the URL
        const id: any = req.params.id;
        // Get values from the body
        const {login, name, sername, phone, role} = req.body;
        // Try to find user on DB
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Пользователь не найден!");
            return;
        }

        // Valid a new values of model
        user.login = login;
        user.name = name;
        user.sername = sername;
        user.phone = phone;
        user.role = role;

        const errors = await validate(user);

        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        // Try to save, if fails, username already in use
        try {
            await userRepository.save(user);
        } catch (err) {
            res.status(409).send("Имя пользователя уже используется!");
        }

        res.send(user);
    };

    static deleteUser = async (req: Request, res: Response) => {

        // Get user Id from URL
        const id = req.params.id;
        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Пользователь не найден!");
            return;
        }

        await userRepository.delete(id);

        res.status(204).send();
    };
}

export default UserController;

