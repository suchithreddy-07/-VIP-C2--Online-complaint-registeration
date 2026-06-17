import express from "express";

import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import AssignedComplaint from "../models/AssignedComplaint.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Admin Middleware
const adminOnly = (req, res, next) => {

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Admin Access Only"
        });
    }

    next();
};

//get all complaints
router.get(
    "/complaints",
    authMiddleware,
    adminOnly,
    async (req, res) => {
        try {

            const complaints = await Complaint.find()
                .populate("user", "name email")
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
    }
);

//get all agents
router.get(
    "/agents",
    authMiddleware,
    adminOnly,
    async (req, res) => {
        try {

            const agents = await User.find({
                role: "AGENT"
            }).select("-password");

            res.status(200).json({
                success: true,
                agents
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
);

//get all users
router.get(
    "/users",
    authMiddleware,
    adminOnly,
    async (req, res) => {
        try {

            const users = await User.find({
                role: "USER"
            }).select("-password");

            res.status(200).json({
                success: true,
                users
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
);

//Assign Agent
router.put(
    "/assign/:complaintId",
    authMiddleware,
    adminOnly,
    async (req, res) => {

        try {

            const { agentId } = req.body;

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

            complaint.assignedAgent = agentId;
            complaint.status = "ASSIGNED";

            await complaint.save();

            await AssignedComplaint.create({
                complaint: complaint._id,
                agent: agentId,
                assignedBy: req.user._id
            });

            res.status(200).json({
                success: true,
                message: "Agent Assigned Successfully"
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
);

//Dashboard Statistics
router.get(
    "/stats",
    authMiddleware,
    adminOnly,
    async (req, res) => {

        try {

            const totalUsers =
                await User.countDocuments({
                    role: "USER"
                });

            const totalAgents =
                await User.countDocuments({
                    role: "AGENT"
                });

            const totalComplaints =
                await Complaint.countDocuments();

            const pendingComplaints =
                await Complaint.countDocuments({
                    status: "PENDING"
                });

            const resolvedComplaints =
                await Complaint.countDocuments({
                    status: "RESOLVED"
                });

            const inProgressComplaints =
                await Complaint.countDocuments({
                    status: { $in: ["ASSIGNED", "IN_PROGRESS"] }
                });

            const rejectedComplaints =
                await Complaint.countDocuments({
                    status: "REJECTED"
                });

            res.status(200).json({
                success: true,
                stats: {
                    totalUsers,
                    totalAgents,
                    totalComplaints,
                    pendingComplaints,
                    resolvedComplaints,
                    inProgressComplaints,
                    rejectedComplaints
                }
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
);

// Approve Agent Account
router.put(
    "/agents/approve/:agentId",
    authMiddleware,
    adminOnly,
    async (req, res) => {
        try {
            const agent = await User.findById(req.params.agentId);
            if (!agent || agent.role !== "AGENT") {
                return res.status(404).json({
                    success: false,
                    message: "Agent Not Found"
                });
            }
            agent.isApproved = true;
            await agent.save();
            res.status(200).json({
                success: true,
                message: "Agent Account Approved Successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

// Reject Agent Account
router.put(
    "/agents/reject/:agentId",
    authMiddleware,
    adminOnly,
    async (req, res) => {
        try {
            const agent = await User.findById(req.params.agentId);
            if (!agent || agent.role !== "AGENT") {
                return res.status(404).json({
                    success: false,
                    message: "Agent Not Found"
                });
            }
            await agent.deleteOne();
            res.status(200).json({
                success: true,
                message: "Agent Account Rejected & Deleted Successfully"
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