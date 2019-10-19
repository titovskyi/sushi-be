import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";

export class CreateAdminUser1565809645761 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.login = '';
        user.name = '';
        user.sername = '';
        user.phone = '';
        user.password = "";
        user.hashPassword();
        user.role = "";
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
