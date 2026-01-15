/** @format */

import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import mongodbconnection from "./config.js";
import messagemodel from "./schema.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
let users = [];
io.on("connection", async (socket) => {
    console.log("New client connected:", socket.id);


    // Send last 50 messages once when the client connects
    const msg = await messagemodel.find({}).sort({ _id: 1 }).limit(50);
    socket.emit("db-r", msg);


    socket.on("setUsername", (username) => {
        socket.username = username; //add user name  to socket object
        users.push({ id: socket.id, name: username });

        // Send updated users list to all clients
        io.emit("updateUsers", users);//io means for all sockets 
    });

    
    // Listen for "send-message" from client
    socket.on("send-message", async (data) => {
        // Save message using schema field names
        const receive = new messagemodel({
            sender: data.username,
            message: data.text,
        });

        await receive.save();

        if (!data.username || !data.text) return;

        // Broadcast
        socket.broadcast.emit("receive-message", {
            username: data.username,
            text: data.text,
        });
    });
});

// Start server
server.listen(process.env.PORT, () => {
    const connect = mongodbconnection();
    console.log(connect);

    console.log(`Server running on port ${process.env.PORT}`);
});
