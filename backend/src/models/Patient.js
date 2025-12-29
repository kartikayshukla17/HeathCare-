import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
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
        role: {
            type: String,
            default: "patient",
        },
        gender: {
            type: String,
            required: true,
        },
        bloodGroup: {
            type: String,
            default: "",
        },
        // phone field removed as per request
        DOB: {
            type: Date,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;
