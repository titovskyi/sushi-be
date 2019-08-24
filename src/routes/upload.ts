import {Router} from "express";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";
import * as multer from "multer";
import * as path from "path";

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

// Edit Info hardcode in Controller ID=1 || req.params.infoId
router.post(
    "/",
    [checkJwt],
    (req, res) => {
        upload(req, res, (err) => {
            if(err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(imgName, 'path to image');
                res.send({filePath: imgName});
            }
        });
});

export default router;
