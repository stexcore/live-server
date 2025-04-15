import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import fs from "fs";

/**
 * WebSocketController is responsible for managing WebSocket connections and monitoring file changes.
 */
export default class WebSocketController {
    private wss: WebSocketServer;
    private serverDynamicToken: number;

    /**
     * Initializes the WebSocketController with an HTTP server.
     * @param httpServer The HTTP server to bind WebSocket to.
     */
    constructor(httpServer: Server, serverDynamicToken: number) {
        // Append server dynamic token
        this.serverDynamicToken = serverDynamicToken;
        // Create a WebSocket server bound to the provided HTTP server
        this.wss = new WebSocketServer({ server: httpServer });

        // Set up the WebSocket connection event
        this.wss.on("connection", (socket: WebSocket) => {

            socket.on("ping", () => {
                console.log("PING!!!!!!!!");
            })

            // Handle incoming messages from the client
            socket.on("message", (message) => {
                // Handle Message
                try {
                    const data = JSON.parse(message.toString());
                    const ev: { event: string, data: any } = data["@stexcore"]["live-server"];

                    switch(ev.event) {
                        case "handshake":
                            if(String(ev.data) !== String(this.serverDynamicToken)) {
                                socket.send(this.createEventStexcore("refresh", "Token invalid!"));
                            }
                            break;

                        case "ping":
                            socket.send(this.createEventStexcore("pong", "Pong from server"));
                            break;
                    }
                }
                catch(err) {
                    console.error(err);
                }
            });
        });
    }

    /**
     * Broadcasts a message to all connected WebSocket clients.
     * @param message The message to send to all clients.
     */
    public broadcast(event: string, data: unknown) {
        // Iterate over all connected clients
        this.wss.clients.forEach(client => {
            // Only send to clients with an open connection
            if (client.readyState === WebSocket.OPEN) {
                client.send(this.createEventStexcore(event, data));
            }
        });
    }

    /**
     * Create event stexcore
     * @param event Event
     * @param data Data
     */
    private createEventStexcore(event: string, data: any) {
        return JSON.stringify({
            "@stexcore": {
                "live-server": { event, data }
            }
        });
    }

    /**
     * Monitors specified directories for file changes and notifies clients of updates.
     * @param workdirs An array of directory paths to monitor for file changes.
     */
    public monitorFileChanges(workdirs: string[]) {
        // Watch each directory for changes
        workdirs.forEach(workdir => {
            // Use fs.watch to monitor directory changes (recursive for subdirectories)
            fs.watch(workdir, { recursive: true }, (eventType, filename) => {                
                if (filename) {
                    this.ApplyRefresh(filename);
                }
            });
        });
    }

    private timerRefreshing: NodeJS.Timeout | null = null;

    private ApplyRefresh(filename: string) {
        // Validate another refresing
        if(!this.timerRefreshing) {
            process.stdout.write("\x1Bc");
            console.log("Changes detected! Refreshing...".cyan);

            this.timerRefreshing = setTimeout(() => {
                this.broadcast("updated", {
                    filename: filename
                });
                this.timerRefreshing = null;
            }, 200);
        }
    }
}
