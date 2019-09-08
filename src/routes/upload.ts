import {Router} from "express";
import {checkJwt} from "../middlewares/checkJwt";
import * as multer from "multer";

const router = Router();
let imgName: string;

const storage = multer.diskStorage({
    // destination: './public/uploads',
    destination: "./public/uploads",
    filename: function(req, file, cb){
        imgName = file.originalname;
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
}).single('upload');

router.post(
    "/",
    [checkJwt],
    (req, res) => {
        upload(req, res, (err) => {
            if(err) {
                res.send(err);
            } else {
                res.send({filePath: imgName});
            }
        });
});

export default router;
