import express from "express";
import Report from "../models/Report.js";
import Appointment from "../models/Appointment.js";
import { getIO } from "../utils/socket.js";

const router = express.Router();

// Create new report
router.post("/", async (req, res, next) => {
    try {
        const { appointmentId, doctorId, patientId, diagnosis, prescriptions } = req.body;

        const newReport = new Report({
            appointmentId,
            doctorId,
            patientId,
            diagnosis,
            prescriptions: prescriptions || []
        });

        const savedReport = await newReport.save();

        // Populate details for the frontend
        await savedReport.populate({
            path: 'doctorId',
            select: 'name specialization',
            populate: { path: 'specialization', select: 'name' }
        });
        await savedReport.populate('patientId', 'name gender DOB address');

        // Emit real-time event to the patient
        try {
            const io = getIO();
            io.to(patientId).emit("new_report", savedReport);
            console.log(`Emitted new_report to room ${patientId}`);
        } catch (socketError) {
            console.error("Socket emit failed:", socketError);
            // Don't fail the request if socket fails
        }

        res.status(201).json(savedReport);

    } catch (error) {
        next(error);
    }
});

// Get report by appointment ID
router.get("/appointment/:appointmentId", async (req, res, next) => {
    try {
        const report = await Report.findOne({ appointmentId: req.params.appointmentId })
            .populate({
                path: 'doctorId',
                select: 'name specialization',
                populate: { path: 'specialization', select: 'name' }
            })
            .populate('patientId', 'name gender DOB address');

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json(report);
    } catch (error) {
        next(error);
    }
});

// Get all reports for a patient (My Reports)
router.get("/patient/:patientId", async (req, res, next) => {
    try {
        const reports = await Report.find({ patientId: req.params.patientId })
            .populate({
                path: 'doctorId',
                select: 'name specialization',
                populate: { path: 'specialization', select: 'name' }
            })
            .populate('patientId', 'name gender DOB address') // Ensure patient details are also there if needed
            .populate('appointmentId', 'date time')
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
});

// Get all reports created by a doctor (Doctor View)
router.get("/doctor/me", async (req, res, next) => {
    try {
        const { doctorId } = req.query;

        if (!doctorId) return res.status(400).json({ message: "Doctor ID required" });

        const reports = await Report.find({ doctorId })
            .populate('patientId', 'name gender DOB address')
            .populate({
                path: 'doctorId',
                select: 'name specialization',
                populate: { path: 'specialization', select: 'name' }
            })
            .populate('appointmentId', 'date time')
            .sort({ createdAt: -1 });

        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
});

export default router;
