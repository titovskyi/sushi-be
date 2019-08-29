import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Unique(["name", "product_image"])
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    category: string;

    @Column()
    sub_category: string;

    @Column()
    product_image: string;

    @Column()
    price: number;

    @Column()
    consist: string;

}
