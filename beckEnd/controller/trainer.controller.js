import TrainerApplication from "../models/trainer.model.js";

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