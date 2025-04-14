import { RequestHandler } from "express";
import { Server } from "../server";
import fs from "fs";
import path from "path";
import { lookup } from "mime-types";

export default class FileController {
    /**
     * FileController Constructor
     * @param server The server instance
     * @param workdir The working directory
     */
    constructor(protected server: Server, protected workdir: string) {}

    /**
     * Handle incoming requests
     * This function serves static files and intercepts HTML files to inject custom content.
     * @param req Incoming HTTP request
     * @param res HTTP response utilities
     * @param next Middleware chain
     */
    public handleRequest: RequestHandler = (req, res, next) => {
        try {
            // Define the folder containing static files
            const requestedPath = path.join(
                this.workdir,
                req.path === "/" ? "/index.html" : req.path
            );

            // Check if the requested file exists
            if (!fs.existsSync(requestedPath)) {
                return next(); // File doesn't exist, pass control to the next middleware
            }

            // Get the MIME type using mime-types
            const mimeType = lookup(requestedPath) || "application/octet-stream";

            // Intercept HTML files to modify their content
            if (mimeType === "text/html") {
                fs.readFile(requestedPath, "utf8", (err, data) => {
                    if (err) {
                        return next(err); // Handle file reading errors
                    }

                    let modifiedHtml: string;
                    
                    // Check if </body> exists and inject the script accordingly
                    if (data.includes("</body>")) {
                        modifiedHtml = data.replace(
                            "</body>",
                            `<script src="/custom-script.js"></script></body>`
                        );
                    } else {
                        // If </body> doesn't exist, append the tag and the script
                        modifiedHtml = `${data}<script src="/custom-script.js"></script></body>`;
                    }

                    res.setHeader("Content-Type", "text/html");
                    res.send(modifiedHtml);
                });
            } else {
                // Serve other files directly
                res.setHeader("Content-Type", mimeType);
                fs.createReadStream(requestedPath).pipe(res);
            }
        } catch (err) {
            next(err); // Forward errors to the next middleware
        }
    };
}
