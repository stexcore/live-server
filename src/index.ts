import { Server } from "./server";

// Create instance server
const server = new Server(process.cwd());

// Initialise listen server
server.initialize(9000)
    .then(() => {
        console.log("Server listening on: http://localhost:9000");
    })
    .catch((err) => {
        console.log(err);
    });