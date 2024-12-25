import mongoose from "mongoose";

const auth= new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures that each email is unique
        lowercase: true,  // Converts email to lowercase before saving
        trim: true,  // Removes extra spaces from the email
        match: [/.+\@.+\..+/, 'Please provide a valid email address'], 
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required: true
    },
    workout: {
        type: [
          {
            name: { type: String, required: true }, // Each workout requires a name
            description: { type: String, required: true }, // Each workout requires a description
          },
        ],
        default: [], // Initializes workout as an empty array
      },
      usertype:{
        type:String,
        default:"user",
      }
    
},{
    timestamps :true
}
);

const signup=mongoose.model('signup',auth);

export default signup;