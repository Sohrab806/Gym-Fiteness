import Course from "../models/course.model.js";

export const create=async (req, res) => {
    const { title, description, trainerEmail, duration, price, category } = req.body;
  
    try {
      if (!trainerEmail) {
        return res.status(400).json({ success: false, message: "Trainer email is required." });
      }
  
      const newCourse = new Course({
        title,
        description,
        trainerEmail, // Use trainer's email instead of ID
        duration,
        price,
        category,
      });
  
      await newCourse.save();
  
      res.status(201).json({ success: true, message: "Course created successfully.", course: newCourse });
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ success: false, message: "Error creating course." });
    }
  }
