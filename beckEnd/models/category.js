import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Exercise name
    description: { type: String, required: true }, // Exercise description
  },
  {
    _id: false, // Avoid creating unnecessary _id for each exercise
  }
);

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    exercise: {
      type: [exerciseSchema],
      default: [],
    },
    image: { type: String }, // Image file path
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
  }
);

// Correcting model name to plural (optional)
const Category = mongoose.model('Category', categorySchema);

export default Category;
