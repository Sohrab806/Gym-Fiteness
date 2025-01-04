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

  export const showstatistic=async (req, res) => {
    try {
      const { email } = req.query;  // Only email is required for this example
  
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
      }
  
      // Calculate the date for 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
      // Query the user's exercise data for the last 7 days
      const userEntry = await Exercisestate.findOne({ email });
  
      if (!userEntry) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
  
      // Filter dailyExercises within the last 7 days
      const filteredExercises = userEntry.dailyExercises.filter((de) => {
        const exerciseDate = new Date(de.date);
        return exerciseDate >= sevenDaysAgo;
      });
  
      res.json({ success: true, data: filteredExercises });
    } catch (error) {
      console.error("Error fetching user exercises:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
  
  