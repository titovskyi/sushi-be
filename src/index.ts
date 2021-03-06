import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes/index";
import * as path from "path";
import * as multer from "multer";

createConnection()
    .then(async connection => {
        // Create a new express application instance
        const app = express();

        // Call middlewares
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());

        // Set folder for public calls
        app.use(express.static('./public'));

        //Set all routes from routes folder
        app.use("/api", routes);

        app.all('/*', function(req, res, next) {
            const indexPath = path.join(__dirname, '../');
            res.sendFile('index.html', { root: indexPath + '/public/' });
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log("Server started on port 3000!");
        });
    })
    .catch(error => console.log(error));


