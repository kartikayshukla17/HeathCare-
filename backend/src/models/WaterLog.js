import mongoose from "mongoose";

const WaterLogSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        date: {
            type: String, // YYYY-MM-DD
            required: true,
        },
        intakeAmount: {
            type: Number, // in ml
            default: 0,
            required: true,
        },
        dailyGoal: {
            type: Number, // in ml
            default: 3000,
        }
    },
    { timestamps: true }
);

// Ensure unique log per patient per day
WaterLogSchema.index({ patientId: 1, date: 1 }, { unique: true });

const WaterLog = mongoose.model("WaterLog", WaterLogSchema);
export default WaterLog;
