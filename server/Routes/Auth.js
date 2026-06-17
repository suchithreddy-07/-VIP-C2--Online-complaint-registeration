import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || "default_secret_jwt_key_12345",
        { expiresIn: "7d" }
    );
};

// Register
router.post("/register", async (req, res) => {
    try {

        let {
            name,
            email,
            password,
            phone,
            role
        } = req.body;

        // Do not allow Admin registration, default to USER if invalid
        if (role === "ADMIN") {
            return res.status(400).json({
                success: false,
                message: "Admin registration is not allowed"
            });
        }
        if (role !== "USER" && role !== "AGENT") {
            role = "USER";
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        const token = generateToken(
            user._id,
            user.role
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isApproved: user.isApproved
            }
        });

    } catch (error) {
        console.error("Registration endpoint error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // Check if agent is approved
        if (user.role === "AGENT" && !user.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Your agent account is pending administrator approval."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const token = generateToken(
            user._id,
            user.role
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isApproved: user.isApproved
            }
        });

    } catch (error) {
        console.error("Login endpoint error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Current User
router.get("/me", authMiddleware, async (req, res) => {
    try {

        res.status(200).json({
            success: true,
            user: req.user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

export default router;