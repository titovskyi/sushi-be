import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from "typeorm";
import {IsNotEmpty} from "class-validator";

@Entity()
@Unique(['comment'])
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    header: string;

    @Column()
    @IsNotEmpty()
    comment: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAd: Date;
}
