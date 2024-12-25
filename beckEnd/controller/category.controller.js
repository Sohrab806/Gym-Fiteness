// controllers/categoryController.js
import Category from "../models/category.js";


// Fetch categories based on user's email and workout names
export const getCate = async (req, res) => {
  try {
    const { userEmail, workouts: workoutNames } = req.body;

    console.log('body :',req.body)
    console.log('userEmail :',userEmail)
    console.log('cate :',workoutNames)

    if (!userEmail || !Array.isArray(workoutNames)) {
      return res.status(400).json({
        success: false,
        message: "User email and workout names are required.",
      });
    }

    // Find categories that match the user's email and workout names
    const categories = await Category.find({
    
      category: { $in: workoutNames },
    });
       console.log('category :',categories)

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories.",
    });
  }
};

