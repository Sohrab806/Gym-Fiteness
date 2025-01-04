import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const DailyExerciseSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Use ISO date string (e.g., "YYYY-MM-DD")
  exercises: [ExerciseSchema],
});

const ExerciseStateSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  dailyExercises: [DailyExerciseSchema],
});

const Exercisestate = mongoose.model("Exercisestate", ExerciseStateSchema);
export default Exercisestate;
