import app from "./app.js";
import ConnectDb from "./db/ConnectDb.js";
import http from "http"
import { Server } from "socket.io"
import setupSocketIo from "../socket/socket.js"
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT


// Create a http Server 

const server = http.createServer(app);

// Initialize Socket.io with the HTTP server

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
})

ConnectDb()

    .then(() => {
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    })
    .catch((error) => {
        console.log(`Server is not listening on port ${port}`, error);
    })


// Use the Socket.io setup function
setupSocketIo(io)

// for Exporting the io instance
app.set("io", io);
