import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import authRoutes from "./Routes/Auth.js";
import complaintRoutes from "./Routes/Complaint.js";
import adminRoutes from "./Routes/Admin.js";
import agentRoutes from "./Routes/Agent.js";
import messageRoutes from "./Routes/Message.js";
import feedbackRoutes from "./Routes/Feedback.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => {
    res.send("Complaint Management API Running");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("joinRoom", (complaintId) => {
        socket.join(complaintId);
        console.log(`Joined Room: ${complaintId}`);
    });

    socket.on("sendMessage", (messageData) => {

        io.to(messageData.complaintId)
            .emit("receiveMessage", messageData);

    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
