import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Info {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    city: string;

    @Column()
    phone: string;

    @Column()
    delivery_time: string;

    @Column()
    delivery_info: string;

    @Column()
    logo: string;

    @Column()
    map: string;
}
