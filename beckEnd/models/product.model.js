import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    // _id: {
    //     type: String, // or any other type you prefer
    //     default: () => new mongoose.Types.ObjectId().toString()
    // },
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required: true
    },
    image:{
        type:String,
        required:true
    }
},{
    timestamps :true
}
);

const product=mongoose.model('product',productSchema);

export default product;