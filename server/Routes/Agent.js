import express from "express";

import Complaint from "../models/Complaint.js";
import AssignedComplaint from "../models/AssignedComplaint.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const agentOnly = (req, res, next) => {

    if (req.user.role !== "AGENT") {
        return res.status(403).json({
            success: false,
            message: "Agent Access Only"
        });
    }

    if (!req.user.isApproved) {
        return res.status(403).json({
            success: false,
            message: "Your agent account is pending administrator approval."
        });
    }

    next();
};

router.get(
    "/complaints",
    authMiddleware,
    agentOnly,
    async (req, res) => {
        try {

            const complaints = await Complaint.find({
                assignedAgent: req.user._id
            })
            .populate("user", "name email phone");

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
    }
);

router.get(
    "/complaints/:id",
    authMiddleware,
    agentOnly,
    async (req, res) => {

        try {

            const complaint =
                await Complaint.findById(req.params.id)
                .populate("user", "name email phone");

            if (!complaint) {
                return res.status(404).json({
                    success: false,
                    message: "Complaint Not Found"
                });
            }

            if (
                complaint.assignedAgent?.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Not Your Complaint"
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
    }
);

router.put(
    "/status/:complaintId",
    authMiddleware,
    agentOnly,
    async (req, res) => {

        try {

            const { status } = req.body;

            const complaint =
                await Complaint.findById(
                    req.params.complaintId
                );

            if (!complaint) {
                return res.status(404).json({
                    success: false,
                    message: "Complaint Not Found"
                });
            }

            if (
                complaint.assignedAgent?.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Not Your Complaint"
                });
            }

            // Enforce progression check: once changed, cannot undo / transition backward
            const allowedTransitions = {
                "ASSIGNED": ["IN_PROGRESS", "RESOLVED", "REJECTED"],
                "IN_PROGRESS": ["RESOLVED", "REJECTED"],
                "RESOLVED": [],
                "REJECTED": []
            };

            const currentStatus = complaint.status || "ASSIGNED";
            if (!allowedTransitions[currentStatus]?.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Status transition from ${currentStatus} to ${status} is not allowed.`
                });
            }

            complaint.status = status;

            await complaint.save();

            res.status(200).json({
                success: true,
                message: "Status Updated",
                complaint
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
);

router.get(
    "/history",
    authMiddleware,
    agentOnly,
    async (req, res) => {

        try {

            const history =
                await AssignedComplaint.find({
                    agent: req.user._id
                })
                .populate("complaint")
                .populate("assignedBy", "name email");

            res.status(200).json({
                success: true,
                history
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
);

export default router;