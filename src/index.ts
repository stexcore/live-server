#!/usr/bin/env node

import path from "path";
import { Server } from "./server";
import argsUtil from "./utils/args.util";
import colors from "colors";
import { readFileSync } from "fs";

// Load package.json to extract name and version
const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageName = packageJson.name || "live-server";
const packageVersion = packageJson.version || "unknown";

// Display package name and version

console.log("=============================================".green);
console.log(colors.green.bold(` ${packageName}`), `v${packageVersion}`.magenta.bold);
console.log("=============================================\n".green);

// Parse arguments from CLI
const { flags, defaults } = argsUtil.parseArgs(process.argv.slice(2)); // Remove `node` and script path

// Handle --help or -h
if (flags.help || flags.h) {
    console.log(colors.cyan(`
Usage: live-server [paths...] [options]

Options:
  paths            One or more directories or files to serve (default: current working directory)
  --port=<number>  Specify the port for the server (default: 3000)
  -p <number>      Alias for --port
  --help, -h       Show this help message
`));
    process.exit(0);
}

// Extract port number
const port = flags.port || flags.p || 3000;
if (isNaN(Number(port)) || Number(port) <= 0 || Number(port) > 65535) {
    console.error(colors.red("Error: Invalid port number. Please specify a number between 1 and 65535."));
    process.exit(1);
}

// Use provided paths or default to current directory
const paths = defaults.length > 0 ? defaults : ["."];

// Initialise and start servers for each path
const server = new Server(paths);

server.initialize(Number(port))
    .then(() => {
        console.log(colors.green(` Server listening on:`), `http://localhost:${port}\n`.cyan);

        console.log(colors.green(" Paths serving:\n"));
        paths.forEach((pathItem) => {
            console.log(`  - ${path.resolve(pathItem)}`.cyan);
        });
        console.log("");
    })
    .catch(err => {
        console.error(colors.red(`Error initializing server:`), err);
    });
