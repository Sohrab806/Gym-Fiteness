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


  export const pending= async (req, res) => {
    try {
      const courses = await Course.find({ approval: "pending" });
      return res.status(200).json({ success: true, data: courses });
    } catch (error) {
      console.error("Error fetching pending courses:", error);
      return res.status(500).json({ success: false, message: "Server error while fetching courses." });
    }
  }
  export const approve= async (req, res) => {
    const { courseId } = req.body;
  
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required." });
    }
  
    try {
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found." });
      }
  
      course.approval = "approved";
      await course.save();
  
      return res.status(200).json({ success: true, message: "Course approved successfully." });
    } catch (error) {
      console.error("Error approving course:", error);
      return res.status(500).json({ success: false, message: "Server error while approving course." });
    }
  }
  export const reject=async (req, res) => {
    const { courseId } = req.body;
  
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required." });
    }
  
    try {
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found." });
      }
  
      course.approval = "rejected";
      await course.save();
  
      return res.status(200).json({ success: true, message: "Course rejected successfully." });
    } catch (error) {
      console.error("Error rejecting course:", error);
      return res.status(500).json({ success: false, message: "Server error while rejecting course." });
    }
  }

  export const allcourse=async (req, res) => {
    try {
      const courses = await Course.find({ approval: "approved" });
      res.status(200).json({ success: true, data: courses });
    } catch (error) {
      console.error("Error fetching approved courses:", error);
      res.status(500).json({ success: false, message: "Server error while fetching courses." });
    }
  }