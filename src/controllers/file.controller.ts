import { RequestHandler } from "express";
import { Server } from "../server";
import fs from "fs";
import path from "path";
import { lookup } from "mime-types";

export default class FileController {

    /**
     * FileController Constructor
     * @param server The server instance
     * @param workdirs The working directories
     */
    constructor(protected server: Server, protected workdirs: string[]) {}

    /**
     * Handle incoming requests
     * This function serves static files from multiple workdirs and intercepts HTML files
     * to inject custom content.
     * @param req Incoming HTTP request
     * @param res HTTP response utilities
     * @param next Middleware chain
     */
    public handleRequest: RequestHandler = (req, res, next) => {
        try {
            let fileFound = false;
    
            // Iterate through each workdir to find the requested file
            for (const workdir of this.workdirs) {
                let requestedPath = path.join(
                    workdir,
                    req.path === "/" ? "/index.html" : req.path
                );
    
                if (fs.existsSync(requestedPath)) {
                    // Check if the requested path is a directory
                    if (fs.lstatSync(requestedPath).isDirectory()) {
                        // Try loading index.html inside the directory
                        requestedPath = path.join(requestedPath, "index.html");
    
                        if (!fs.existsSync(requestedPath)) {
                            continue; // Skip to the next workdir if no index.html is found
                        }
                    }
    
                    fileFound = true;
    
                    // Get the MIME type using mime-types
                    const mimeType = lookup(requestedPath) || "application/octet-stream";
    
                    if (mimeType === "text/html") {
                        // Intercept and modify HTML content
                        fs.readFile(requestedPath, "utf8", (err, data) => {
                            if (err) {
                                return next(err); // Handle file reading errors
                            }
    
                            let modifiedHtml: string;
                            if (data.includes("</body>")) {
                                modifiedHtml = data.replace(
                                    "</body>",
                                    `<script src="/custom-script.js"></script></body>`
                                );
                            } else {
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
                    return; // Stop searching once the file is found
                }
            }
    
            // As a fallback, try serving index.html from the base directory
            for (const workdir of this.workdirs) {
                const fallbackPath = path.join(workdir, "index.html");
    
                if (fs.existsSync(fallbackPath)) {
                    fileFound = true;
    
                    // Serve index.html as the fallback
                    fs.readFile(fallbackPath, "utf8", (err, data) => {
                        if (err) {
                            return next(err); // Handle file reading errors
                        }
    
                        let modifiedHtml: string;
                        if (data.includes("</body>")) {
                            modifiedHtml = data.replace(
                                "</body>",
                                `<script src="/custom-script.js"></script></body>`
                            );
                        } else {
                            modifiedHtml = `${data}<script src="/custom-script.js"></script></body>`;
                        }
    
                        res.setHeader("Content-Type", "text/html");
                        res.send(modifiedHtml);
                    });
                    return;
                }
            }
    
            // If no file was found at all, pass control to the next middleware
            if (!fileFound) {
                return next();
            }
        } catch (err) {
            next(err); // Forward errors to the next middleware
        }
    };
    
    
}
