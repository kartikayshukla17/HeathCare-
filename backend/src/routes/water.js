import express from "express";
import WaterLog from "../models/WaterLog.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get today's water log (or specific date)
// @route   GET /api/water/today
// @access  Private (Patient)
router.get("/today", protect, authorize("patient"), async (req, res, next) => {
    try {
        // Use provided date or fallback to server UTC (though frontend should always provide it now)
        const dateParam = req.query.date || new Date().toISOString().split("T")[0];

        let log = await WaterLog.findOne({
            patientId: req.user.id,
            date: dateParam
        });

        // If no log exists for this date, return 0 intake (Resets for new day)
        if (!log) {
            return res.status(200).json({
                date: dateParam,
                intakeAmount: 0,
                dailyGoal: req.user.gender === 'Female' ? 2700 : 3700
            });
        }

        res.status(200).json(log);
    } catch (error) {
        next(error);
    }
});

// @desc    Add water intake
// @route   POST /api/water/add
// @access  Private (Patient)
router.post("/add", protect, authorize("patient"), async (req, res, next) => {
    try {
        const { amount, date } = req.body;
        // Use provided date or fallback
        const dateParam = date || new Date().toISOString().split("T")[0];

        // Determine goal based on gender (can be overridden later)
        const goal = req.user.gender === 'Female' ? 2700 : 3700;

        let log = await WaterLog.findOne({
            patientId: req.user.id,
            date: dateParam
        });

        if (log) {
            log.intakeAmount += amount;
            await log.save();
        } else {
            log = new WaterLog({
                patientId: req.user.id,
                date: dateParam,
                intakeAmount: amount,
                dailyGoal: goal
            });
            await log.save();
        }

        res.status(200).json(log);
    } catch (error) {
        next(error);
    }
});

export default router;
