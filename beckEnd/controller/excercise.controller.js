import mongoose from "mongoose";
import Exercise from "../models/exercise.model.js"

import auth from '../models/signin.model.js'

export const getworkout= async (req, res) => {
    try {
      const workouts = await Exercise.find();
      res.status(200).json({success:true,data:workouts})
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workouts" });
    }
  }
  export const userworkout= async (req, res) => {
    const {userEmail}=req.query;
    console.log("useremail:",userEmail)
    try {
        
        
      const workouts = await auth.findOne({email:userEmail});
      console.log('workout:',workouts)
      res.status(200).json({success:true,data:workouts.workout})
    } catch (error) {
        console.log('error a:',error)
      res.status(500).json({ error: "Failed to fetch workouts" });
    }
  }

  export const createWorkout= async (req, res) => {
    const workout=req.body
    if(!workout.name || !workout.description){

      return res.status(404).json({success:false,message:"provide all field"})
    }
    const newWorkout=  Exercise(workout)
    
    try {
        await newWorkout.save();
        
        res.status(201).json({success :true,data :newWorkout})
    } catch (error) {
        console.log( `error is : ${error.message}`) 
    
        res.status(500).json({success :false, message:"server error"});
    }
  }



  export const addworkoutuser = async (req, res) => {
    const { name, description, userEmail } = req.body;
  
    // Validate the request body
    if (!name || !description || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, description, and userEmail are mandatory.",
      });
    }
  
    try {
      // Find the user by email
      const user = await auth.findOne({ email: userEmail });
  
      // If user not found, return error
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with email '${userEmail}' not found.`,
        });
      }
  
      // Initialize workout field if not present
      if (!user.workout) {
        user.workout = [];
      }
  
      // Check for duplicate workout
      const duplicateWorkout = user.workout.find(workout => workout.name.toLowerCase() === name.toLowerCase());
  
      if (duplicateWorkout) {
        return res.status(409).json({
          success: false,
          message: `Duplicate workout '${name}' detected for user ${userEmail}.`,
        });
      }
  
      // Add new workout
      user.workout.push({ name, description });
      await user.save();
  
      // Return success response
      return res.status(201).json({
        success: true,
        message: `Workout '${name}' added successfully.`,
        data: user.workout,
      });
    } catch (error) {
      console.error("Error adding workout:", error.message);
      return res.status(500).json({
        success: false,
        message: "An internal server error occurred.",
      });
    }
  };

  export const deletexcercise=async(req,res)=>{
    const{id} =req.params;
    console.log('id',id);
    

    
    try {
        const user = await auth.findOneAndUpdate(
            { "workout._id": id }, // Match the workout by its _id
            { $pull: { workout: { _id: id } } }, // Remove the matching workout
            { new: true } // Return the updated user document
          );

        res.status(200).json({success:true,message :'product deleted'})
    } catch (error) {
        console.error( `error is : ${error.message}`) 

    res.status(404).json({success :false, message:"product to found"});
    }
} ;
  
  
  

  
