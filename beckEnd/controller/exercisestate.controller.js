import Exercisestate from "../models/exercisestate.model.js";

export const state = async (req, res) => {
    try {
      const { email, exercise, date } = req.body;
  
      // Validate email and exercise
      if (!email || !exercise || !exercise.name) {
        return res.status(400).json({ success: false, message: "Invalid data provided." });
      }
  
      const exerciseData = {
        name: exercise.name,
        description: exercise.description || "",
      };
  
      const formattedDate = new Date(date || Date.now()).toISOString().split("T")[0]; // Get "YYYY-MM-DD"
  
      // Check if the user and date already exist
      const userEntry = await Exercisestate.findOne({ email, "dailyExercises.date": formattedDate });
  
      if (userEntry) {
        // Find the specific day's exercises
        const dailyExercise = userEntry.dailyExercises.find((de) => de.date === formattedDate);
  
        // Check if the exercise already exists
        const isDuplicate = dailyExercise.exercises.some((ex) => ex.name === exerciseData.name);
  
        if (isDuplicate) {
          return res.status(400).json({
            success: false,
            message: `Exercise "${exerciseData.name}" already exists for ${formattedDate}.`,
          });
        }
  
        // Add the exercise if not a duplicate
        await Exercisestate.updateOne(
          { email, "dailyExercises.date": formattedDate },
          { $push: { "dailyExercises.$.exercises": exerciseData } }
        );
      } else {
        // If no entry exists for the user or date, create a new dailyExercises entry
        await Exercisestate.findOneAndUpdate(
          { email },
          {
            $push: {
              dailyExercises: {
                date: formattedDate,
                exercises: [exerciseData],
              },
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      }
  
      res.json({ success: true, message: "Exercise saved successfully." });
    } catch (error) {
      console.error("Error saving exercise:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };





  export const showstatistic= async (req, res) => {
    const { email } = req.query;
     console.log('email :',email)
    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }
  
    try {
      // Find exercise state by email
      const exerciseData = await Exercisestate.findOne({ email }).exec();
  
      // If no data is found, send an error
      if (!exerciseData) {
        return res.status(404).json({ message: "No exercise data found." });
      }
  
      // Filter and return the last 7 days of exercise data
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);  // Set time to midnight for consistent comparison
  
      const today = new Date();
      today.setHours(23, 59, 59, 999);  // Set time to the end of today (23:59:59.999)
  
      const recentExerciseData = exerciseData.dailyExercises.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= sevenDaysAgo && entryDate <= today; // Ensure the date is within the last 7 days
      });
  
      // Send back the filtered data as JSON
      res.json({ data: recentExerciseData });
    } catch (err) {
      console.error("Error fetching exercise data:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  }
  
  