import { RequestHandler } from "express";
import { createReadStream } from "fs";
import path from "path";

export default class p404Controller {

    handleRequest: RequestHandler = (_req, res, next) => {
        try {
            const stream = createReadStream(path.join(__dirname, "../../public/@stexcore/__404/404.html"));

            res.setHeader("Content-Type", "text/html");
            stream.pipe(res);
        }
        catch(err) {
            next(err);
        }
    }
    
}