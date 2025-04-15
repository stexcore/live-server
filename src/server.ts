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
     * Workdir
     */
    protected workdirs: string[];

    /**
     * Server constructor
     */
    constructor(workdir: string | string[]) {
        this.app = express();
        this.server = http.createServer(this.app);

        // Set workdirs
        this.workdirs = workdir instanceof Array ? workdir : [workdir];

        // Create controller instance
        const fileController = new FileController(this, this.workdirs);
        
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