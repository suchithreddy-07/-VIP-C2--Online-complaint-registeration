import express from "express";

import Feedback from "../models/Feedback.js";
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
                rating,
                comment
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

            if (
                complaint.user.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message: "Access Denied"
                });
            }

            if (
                complaint.status !== "RESOLVED"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Feedback can only be submitted after resolution"
                });
            }

            const existingFeedback =
                await Feedback.findOne({
                    complaint: complaintId,
                    user: req.user._id
                });

            if (existingFeedback) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Feedback already submitted"
                });
            }

            const feedback =
                await Feedback.create({
                    complaint: complaintId,
                    user: req.user._id,
                    rating,
                    comment
                });

            res.status(201).json({
                success: true,
                message:
                    "Feedback Submitted Successfully",
                feedback
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

            const feedback =
                await Feedback.find({
                    complaint:
                        req.params.complaintId
                })
                .populate(
                    "user",
                    "name email"
                );

            res.status(200).json({
                success: true,
                feedback
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
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const feedbacks =
                await Feedback.find()
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "complaint",
                    "title status"
                );

            res.status(200).json({
                success: true,
                feedbacks
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
    "/:id",
    authMiddleware,
    async (req, res) => {

        try {

            const feedback =
                await Feedback.findById(
                    req.params.id
                );

            if (!feedback) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Feedback Not Found"
                });
            }

            if (
                feedback.user.toString() !==
                req.user._id.toString()
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Access Denied"
                });
            }

            await feedback.deleteOne();

            res.status(200).json({
                success: true,
                message:
                    "Feedback Deleted"
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