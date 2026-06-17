import express from "express";

import Message from "../models/Message.js";
import Complaint from "../models/Complaint.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const {
                complaintId,
                receiverId,
                message
            } = req.body;

            const complaint =
                await Complaint.findById(
                    complaintId
                );

            if (!complaint) {
                return res.status(404).json({
                    success: false,
                    message: "Complaint Not Found"
                });
            }

            // Check authorization: must be creator, assigned agent, or admin
            const isCreator = complaint.user.toString() === req.user._id.toString();
            const isAssignedAgent = complaint.assignedAgent && complaint.assignedAgent.toString() === req.user._id.toString();
            const isAdmin = req.user.role === "ADMIN";

            if (!isCreator && !isAssignedAgent && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: You are not authorized to message in this room."
                });
            }

            if (complaint.status === "REJECTED" && req.user.role === "AGENT") {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: You cannot send messages for a rejected complaint."
                });
            }

            const newMessage =
                await Message.create({
                    complaint: complaintId,
                    sender: req.user._id,
                    receiver: receiverId,
                    message
                });

            res.status(201).json({
                success: true,
                message: "Message Sent",
                data: newMessage
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
    "/:complaintId",
    authMiddleware,
    async (req, res) => {

        try {

            const complaint = await Complaint.findById(req.params.complaintId);
            if (!complaint) {
                return res.status(404).json({
                    success: false,
                    message: "Complaint Not Found"
                });
            }

            // Check authorization: must be creator, assigned agent, or admin
            const isCreator = complaint.user.toString() === req.user._id.toString();
            const isAssignedAgent = complaint.assignedAgent && complaint.assignedAgent.toString() === req.user._id.toString();
            const isAdmin = req.user.role === "ADMIN";

            if (!isCreator && !isAssignedAgent && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied: You are not authorized to view these messages."
                });
            }

            const messages =
                await Message.find({
                    complaint: req.params.complaintId
                })
                .populate(
                    "sender",
                    "name role"
                )
                .populate(
                    "receiver",
                    "name role"
                )
                .sort({ createdAt: 1 });

            res.status(200).json({
                success: true,
                messages
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
    "/read/:complaintId",
    authMiddleware,
    async (req, res) => {

        try {

            await Message.updateMany(
                {
                    complaint:
                        req.params.complaintId,
                    receiver: req.user._id,
                    isRead: false
                },
                {
                    isRead: true
                }
            );

            res.status(200).json({
                success: true,
                message:
                    "Messages Marked As Read"
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }
);

router.delete(
    "/:messageId",
    authMiddleware,
    async (req, res) => {

        try {

            const message =
                await Message.findById(
                    req.params.messageId
                );

            if (!message) {
                return res.status(404).json({
                    success: false,
                    message: "Message Not Found"
                });
            }

            if (
                message.sender.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied"
                });
            }

            await message.deleteOne();

            res.status(200).json({
                success: true,
                message: "Message Deleted"
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