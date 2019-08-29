import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import {IsNotEmpty} from "class-validator";

@Entity()
@Unique(["header", "image"])
export class News {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    header: string;

    @Column()
    @IsNotEmpty()
    description: string;

    @Column()
    @IsNotEmpty()
    image: string;
}
