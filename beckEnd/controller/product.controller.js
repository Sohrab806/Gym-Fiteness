import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const getProducts= async(req,res)=>{
    try {
        const products= await Product.find({});
        res.status(200).json({sucess:true,data:products})
    } catch (error) {
        console.log(`the error is : ${error}`)
        res.status(404).json({success:false,message:"serevr error"})
    }
}

export const creatProducts= async(req,res)=>{ 
    const product= req.body;
    if(!product.name || !product.price ||   !product.image){
        return  res.status(404).json({ sucess: false,message: "please provide all fields"});
    }
    const newProduct= Product (product)
    
    try {
        await newProduct.save();
        
        res.status(201).json({success :true,data :newProduct})
        
    
    
    } catch (error) {
        console.log( `error is : ${error.message}`) 
    
        res.status(500).json({success :false, message:"server error"});
    }
    
    } 

    export const deleteProduct=async(req,res)=>{
        const{id} =req.params;
        console.log('id',id);
    
        
        try {
            console.log('the id is ',id)
            await Product.findByIdAndDelete(id);
    
            res.status(200).json({success:true,message :'product deleted'})
        } catch (error) {
            console.error( `error is : ${error.message}`) 
    
        res.status(404).json({success :false, message:"product to found"});
        }
    } 

    export const updateProduct= async(req,res)=>{
        const {id}=req.params;
        const product= req.body;
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(404).json({success:false,message:'inavlid id'})
        }
    
        try {
            const updatedProduct=await Product.findByIdAndUpdate(id,product,{new:true}) // new:true =will send the updated 
            res.status(200).json({success:true,data:updatedProduct})
        } catch (error) {
            res.status(404).json({success:false,message:"server error"})
        }
    
    }

