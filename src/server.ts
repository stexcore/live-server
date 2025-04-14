import express from "express";
import http from "http";
import FileController from "./controllers/file.controller";

export class Server {

    /**
     * Express application
     */
    protected app: express.Application;

    /**
     * Http Server
     */
    protected server: http.Server;

    /**
     * Server constructor
     */
    constructor(protected workdir: string) {
        this.app = express();
        this.server = http.createServer(this.app);

        // Create controller instance
        const fileController = new FileController(this, workdir);
        
        // append controller
        this.app.use(fileController.handleRequest);
    }

    public initialize(port: number) {
        return new Promise<void>((resolve, reject) => {
            try {
                this.server.listen(port, () => {
                    resolve();
                });
            }
            catch(err) {
                reject(err);
            }
        });
    }

    public destroy() {
        return new Promise<void>((resolve, reject) => {
            try {
                this.server.close((err) => {
                    if(err) return reject(err);
                    return resolve();
                });
            }
            catch(err) {
                reject(err);
            }
        });
    }
    
}