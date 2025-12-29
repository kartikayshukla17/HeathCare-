import express from "express";
import Specialization from "../models/Specialization.js";

const router = express.Router();

// @desc    Get all specializations
// @route   GET /api/specializations
// @access  Public
router.get("/", async (req, res, next) => {
    try {
        const specs = await Specialization.find().sort({ name: 1 });
        res.status(200).json(specs);
    } catch (error) {
        next(error);
    }
});

export default router;
