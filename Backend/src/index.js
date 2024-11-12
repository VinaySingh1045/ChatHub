import app from "./app.js";
import ConnectDb from "./db/ConnectDb.js";
import http from "http"
import { Server } from "socket.io"
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
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    })
    .catch((error) => {
        console.log(`Server is not listening on port ${port}`, error);
    })

io.on("connection", (socket) => {
    console.log("Connected Suuccessfully ", socket.id);

    io.on("disconnect", (socket) => {
        console.log("Disconnected Suuccessfully ", socket.id);
    })

})

// for Exporting the io 
app.set("io", io);


