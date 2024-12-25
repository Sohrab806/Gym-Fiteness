import mongoose from "mongoose";

const trainerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    certifications: { type: String, required: true },
    experience: { type: String, required: true },
    trainingAreas: { type: [String], required: true },
    startDate: { type: Date, required: true },
    coverLetter: { type: String, required: true },
    role: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // Default role is "pending"
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const TrainerApplication = mongoose.model("TrainerApplication", trainerApplicationSchema);

export default TrainerApplication;
