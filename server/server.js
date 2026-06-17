// Trigger nodemon restart to load updated MONGO_URI from .env
import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

const logs = [];
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
    logs.push({ type: 'log', time: new Date().toISOString(), message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
    if (logs.length > 500) logs.shift();
    originalLog(...args);
};

console.error = (...args) => {
    logs.push({ type: 'error', time: new Date().toISOString(), message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
    if (logs.length > 500) logs.shift();
    originalError(...args);
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err);
});

import authRoutes from "./Routes/Auth.js";
import complaintRoutes from "./Routes/Complaint.js";
import adminRoutes from "./Routes/Admin.js";
import agentRoutes from "./Routes/Agent.js";
import messageRoutes from "./Routes/Message.js";
import feedbackRoutes from "./Routes/Feedback.js";

const app = express();

connectDB();

app.use(cors({
    origin: ["https://vip-c2-online-complaint-registerati.vercel.app", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());

app.get("/api/debug/logs", (req, res) => {
    res.json(logs);
});

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
        origin: "https://vip-c2-online-complaint-registerati.vercel.app"
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
