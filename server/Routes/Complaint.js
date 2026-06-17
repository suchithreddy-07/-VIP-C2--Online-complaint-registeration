import express from "express";

import Complaint from "../models/Complaint.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Create Complaint
router.post("/", authMiddleware, async (req, res) => {
    try {

        const {
            title,
            description,
            category,
            address,
            city,
            state,
            pincode,
            priority
        } = req.body;

        const complaint = await Complaint.create({
            title,
            description,
            category,
            address,
            city,
            state,
            pincode,
            priority,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Complaint Created",
            complaint
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});


// Get My Complaints
router.get("/", authMiddleware, async (req, res) => {
    try {

        const complaints = await Complaint.find({
            user: req.user._id
        })
        .populate("assignedAgent", "name email");

        res.status(200).json({
            success: true,
            complaints
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});


// Get Single Complaint
router.get("/:id", authMiddleware, async (req, res) => {
    try {

        const complaint = await Complaint.findById(
            req.params.id
        )
        .populate("user", "name email")
        .populate("assignedAgent", "name email");

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint Not Found"
            });
        }

        // Check authorization: must be creator, assigned agent, or admin
        const isCreator = complaint.user._id.toString() === req.user._id.toString();
        const isAssignedAgent = complaint.assignedAgent && complaint.assignedAgent._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "ADMIN";

        if (!isCreator && !isAssignedAgent && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access Denied: You are not authorized to view this complaint."
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});


// Update Complaint
router.put("/:id", authMiddleware, async (req, res) => {
    try {

        const complaint = await Complaint.findById(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint Not Found"
            });
        }

        if (
            complaint.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        const updatedComplaint =
            await Complaint.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

        res.status(200).json({
            success: true,
            message: "Complaint Updated",
            complaint: updatedComplaint
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});


// Delete Complaint
router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        const complaint = await Complaint.findById(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint Not Found"
            });
        }

        if (
            complaint.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access Denied"
            });
        }

        await complaint.deleteOne();

        res.status(200).json({
            success: true,
            message: "Complaint Deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

export default router;