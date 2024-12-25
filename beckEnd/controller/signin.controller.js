import auth from '../models/signin.model.js'
import bcrypt from 'bcrypt'; 
const saltRounds = 10;

export const signin= async (req, res) => {
    const signup = req.body;
console.log('singup value :',signup)
    // Validate input
    if (!signup.name || !signup.password || !signup.email) {
        return res.status(404).json({ success: false, message: "Please provide all required information" });
    }

    // Hash the password before saving it
    try {

        const hashedPassword = await bcrypt.hash(signup.password, saltRounds); // Hash the password

        // Create a new signup object with the hashed password
        const newSignup = new auth({
            name: signup.name,
            email: signup.email,
            password: hashedPassword, // Save the hashed password
        });

        // Save the new user to the database
        console.log('values :',newSignup)
        await newSignup.save();
        res.status(200).json({ success: true, data: newSignup });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ success: false, message: "Server error" });
    }
}
export const getusers= async(req,res)=>{
    try {
        const users= await auth.find({});
    
        res.status(200).json({sucess:true,data:users})
        
    } catch (error) {
        console.log(`the error is : ${error}`)
        res.status(404).json({success:false,message:"serevr error"})
    }
}