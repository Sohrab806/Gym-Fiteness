import mongoose from "mongoose";

const Excercise= new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required: true
    },

},{
    timestamps :true
}
);

const workout=mongoose.model('exercise',Excercise);

export default workout;