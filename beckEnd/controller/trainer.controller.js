import TrainerApplication from "../models/trainer.model.js";
import auth from "../models/signin.model.js"

export const trainerform= async (req, res) => {
    const {
        name,
        email,
        phone,
        dob,
        certifications,
        experience,
        trainingAreas,
        startDate,
        coverLetter,
      } = req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !dob ||
        !certifications ||
        !experience ||
        !trainingAreas ||
        !startDate ||
        !coverLetter
      ) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
    try {
     
        const newApplication = new TrainerApplication({
        name,
        email,
        phone,
        dob,
        certifications,
        experience,
        trainingAreas,
        startDate,
        coverLetter,
      });
  
      // Save the application to the database
      await newApplication.save();
  
      return res.status(200).json({ success: true, message: "Application submitted successfully!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Failed to submit application." });
    }
  }

  export const getapplications= async (req, res) => {
    try {
      const applications = await TrainerApplication.find({ role: "pending" });
      res.json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch applications." });
    }
  }

  import mongoose from "mongoose";

export const accept = async (req, res) => {
  const { email } = req.body;
  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Begin transaction

  try {
    const updatedUser = await auth.findOneAndUpdate(
      { email },
      { trainer: "yes" },
      { new: true, session } // Associate with transaction
    );

    if (!updatedUser) {
      throw new Error("User not found in auth collection.");
    }

    const updatedTrainer = await TrainerApplication.findOneAndUpdate(
      { email },
      { role: "trainer" },
      { new: true, session } // Associate with transaction
    );

    if (!updatedTrainer) {
      throw new Error("Application not found in TrainerApplication collection.");
    }

    await session.commitTransaction(); // Commit transaction
    session.endSession(); // End session

    res.json({ success: true, message: "Application accepted." });
  } catch (error) {
    await session.abortTransaction(); // Rollback transaction on error
    session.endSession(); // End session

    res.status(500).json({
      success: false,
      message: "Failed to accept application.",
      error: error.message,
    });
  }
};


  export const reject= async (req, res) => {
    const { email } = req.body;
    try {
      const deletedTrainer = await TrainerApplication.findOneAndDelete({ email });
      if (deletedTrainer) {
        res.json({ success: true, message: "Application rejected." });
      } else {
        res.status(404).json({ success: false, message: "Application not found." });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to reject application." });
    }
  }