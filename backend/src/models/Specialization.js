import mongoose from "mongoose";

const SpecializationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        image: {
            type: String, // Optional icon/image for the UI
            default: "",
        },
    },
    { timestamps: true }
);

const Specialization = mongoose.model("Specialization", SpecializationSchema);
export default Specialization;
