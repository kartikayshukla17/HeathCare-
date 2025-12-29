import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        specialization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Specialization",
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        // Using loose schema for availability to match JSON structure exactly:
        // [{ day: "Monday", slots: ["09:00-11:00", "11:30-13:30"] }]
        availability: [
            {
                day: { type: String, required: true },
                slots: [{ type: String }],
            },
        ],
        // Removed fees and experience as they are not in the provided JSON
        // Removed department in favor of specialization (or mapped appropriately)
    },
    { timestamps: true }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);
export default Doctor;
