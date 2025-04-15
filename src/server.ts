import express from "express";
import http from "http";
import FileController from "./controllers/file.controller";
import WebSocketController from "./controllers/websocket.controller";
import path from "path";
import morgan from "morgan";

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
     * WebSocket controller to manage WebSocket communication
     */
    private websocketController: WebSocketController;
    
    /**
     * Id server
     */
    public readonly serverDynamicToken: number;

    /**
     * Server constructor
     */
    constructor(workdir: string | string[]) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.serverDynamicToken = Date.now();

        // Set workdirs
        this.workdirs = workdir instanceof Array ? workdir : [workdir];

        // Create file controller instance
        const fileController = new FileController(this, this.workdirs);

        // Append file controller middleware
        this.app.use(express.static(path.join(__dirname, "../public")));
        this.app.use(morgan("dev"));
        this.app.use(fileController.handleRequest);

        // Create WebSocketController instance
        this.websocketController = new WebSocketController(this.server, this.serverDynamicToken);

        // Start monitoring file changes and notify WebSocket clients
        this.websocketController.monitorFileChanges(this.workdirs);
    }

    public initialize(port: number) {
        return new Promise<void>((resolve, reject) => {
            try {
                // Start the HTTP server on the specified port
                this.server.listen(port, () => {
                    resolve();
                });
            } catch (err) {
                reject(err); // Handle errors during server startup
            }
        });
    }

    public destroy() {
        return new Promise<void>((resolve, reject) => {
            try {
                // Stop the HTTP server
                this.server.close((err) => {
                    if (err) return reject(err); // Handle errors during shutdown
                    return resolve();
                });
            } catch (err) {
                reject(err); // Handle unexpected errors during shutdown
            }
        });
    }
}
