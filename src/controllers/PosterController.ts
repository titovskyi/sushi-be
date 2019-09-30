import {Request, Response} from "express";
let request = require('request');

class PosterController {
    static getCategories = async (req: Request, res: Response) => {
        request('https://joinposter.com/api/menu.getCategories?token=612708:96672081f48bbf408f75fde0526488f2', function(error, response, body) {
            res.send(body)
        });
    };

    static getProducts = async (req: Request, res: Response) => {
        request('https://joinposter.com/api/menu.getProducts?token=612708:96672081f48bbf408f75fde0526488f2', function(error, response, body) {
            console.log(body);
            res.send(body)
        });
    }
}


export default PosterController;
