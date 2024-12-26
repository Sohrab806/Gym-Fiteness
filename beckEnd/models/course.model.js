import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    trainerEmail: { type: String, required: true }, // Trainer's email
    duration: { type: Number, required: true }, // Duration in hours
    price: { type: Number, required: true }, // Price of the course
    category: { type: String, required: true }, // e.g., Fitness, Nutrition, etc.
    approval: { type: String,  default: "pending" }, // Default approval is pending
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
