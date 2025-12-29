import express from "express";
import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Specialization from "../models/Specialization.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all doctors (with optional specialization filter)
// @route   GET /api/appointments/doctors
// @access  Private (Patient protected, or Public?) - typically protected
router.get("/doctors", protect, async (req, res, next) => {
    try {
        const { specialization } = req.query;
        let query = {};

        if (specialization && specialization !== 'All') {
            const specDoc = await Specialization.findOne({ name: specialization });
            if (specDoc) {
                query.specialization = specDoc._id;
            } else {
                // If specialization name provided but not found in DB, return empty list
                return res.status(200).json([]);
            }
        }

        const doctors = await Doctor.find(query).select("-password").populate("specialization");
        res.status(200).json(doctors);
    } catch (error) {
        next(error);
    }
});

// @desc    Get doctor by ID
// @route   GET /api/appointments/doctors/:id
// @access  Private
router.get("/doctors/:id", protect, async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select("-password").populate("specialization");
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.status(200).json(doctor);
    } catch (error) {
        next(error);
    }
});

// @desc    Book an appointment
// @route   POST /api/appointments/book
// @access  Private (Patient)
router.post("/book", protect, authorize("patient"), async (req, res, next) => {
    try {
        const { doctorId, date, time, symptoms, paymentMethod } = req.body;

        // 1. Check if doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // 2. Check if slot is available
        // We assume 'date' is a YYYY-MM-DD string or Date object. 
        // We need to match precise slot booking.
        // Simple check: Is there an appointment for this doctor at this date & time that is NOT cancelled?

        // Normalize date to start of day for broader check if necessary, or exact match if passed as ISO string
        // Assuming frontend sends date as "2023-12-25" string. 
        // Backend stores as Date. 
        // Ideally we compare day and time string.

        // Let's rely on exact Date match if frontend sends strictly.
        // But better: construct a range for the day.

        // For simplicity in this hackathon context: 
        // We expect `date` to be passed as YYYY-MM-DD string.
        // We store it as Date object (midnight UTC).

        const appointmentDate = new Date(date);

        const existingAppointment = await Appointment.findOne({
            doctorId,
            date: appointmentDate,
            time,
            status: { $ne: "cancelled" }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "Slot already booked" });
        }

        // 3. Create Appointment
        let paymentStatus = "Pending";
        if (paymentMethod === "Razorpay") {
            paymentStatus = "Paid"; // Simulating immediate success
        }

        const appointment = new Appointment({
            patientId: req.user.id,
            doctorId,
            date: appointmentDate,
            time,
            symptoms,
            amount: 500, // Fixed fee for now, or fetch from doctor if added
            paymentMethod,
            paymentStatus,
            status: "confirmed" // Auto-confirm for now
        });

        await appointment.save();

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });

    } catch (error) {
        next(error);
    }
});

export default router;
