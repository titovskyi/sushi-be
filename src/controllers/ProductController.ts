import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Product} from "../entity/Product";
import {validate} from "class-validator";
import * as fs from "fs";
import * as PATH from "path";

class ProductController {
    static listAll = async (req: Request, res: Response) => {
        const productRepository = getRepository(Product);
        const products = await productRepository.find({
            select: ["id", "name", "category", "sub_category", "product_image", "price", "consist"]
        });
        res.send(products);
    };

    static getProductById = async (req: Request, res: Response) => {
        const id = req.params.id;
        const productRepository = getRepository(Product);
        let product: Product;

        try {
            product = await productRepository.findOneOrFail(id, {
                select: ["id", "name", "category", "sub_category", "product_image", "price", "consist"]
            });
        } catch (err) {
            res.status(404).send("Продукт не найден!");
        }

        res.send(product);
    };

    static newProduct = async (req: Request, res: Response) => {
        let {name, category, sub_category, product_image, price, consist} = req.body;
        let newProduct = new Product();

        newProduct.name = name;
        newProduct.category = category;
        newProduct.sub_category = sub_category;
        newProduct.product_image = product_image;
        newProduct.price = price;
        newProduct.consist = consist;

        const errors = await validate(newProduct);
        if(errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const productRepository = getRepository(Product);

        try {
            await productRepository.save(newProduct);
        } catch (err) {
            res.status(409).send("Товар с таким названием уже существует!");
            return;
        }

        res.send(newProduct);
    };

    static editProduct = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {name, category, sub_category, product_image, prev_product_image, price, consist} = req.body;
        const productRepository = getRepository(Product);
        let product: Product;

        try {
            product = await productRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Продукт не найден!");
        }

        product.name = name;
        product.category = category;
        product.sub_category = sub_category;
        if(product_image) {
            product.product_image = product_image;
        }
        product.price = price;
        product.consist = consist;

        const errors = await validate(product);
        if(errors.length > 0) {
            res.status(409).send(errors);
            return;
        }

        try {
            await productRepository.save(product);
        } catch (err) {
            res.status(409).send("Продукт с таким названием уже существует!");
        }

        if (sub_category && sub_category !== prev_product_image) {
            fs.unlinkSync(PATH.resolve(`public\\uploads\\${prev_product_image}`));
        }

        res.send(product);
    };

    static deleteProduct  = async (req: Request, res: Response) => {
        const id = req.params.id;
        const productRepository = getRepository(Product);
        let product: Product;

        try {
            product = await productRepository.findOneOrFail(id);
        } catch (err) {
            res.status(404).send("Продукт не найден!");
        }

        await productRepository.delete(id);

        fs.unlinkSync(PATH.resolve(`public\\uploads\\${product.product_image}`))

        res.status(204).send();
    }
}

export default ProductController;
