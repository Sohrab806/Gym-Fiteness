
// Import CORS
import cors from "cors"
import express from "express";
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import multer from "multer";
 // Set the number of salt rounds for hashing


const app=express(); 
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./route/product.route.js";
import auth from "./models/signin.model.js";
import workoutRoute from "./route/excercise.route.js"
import signinRoute from "./route/signin.route.js"
import Category from "./models/category.js";
import path from "path";
import cateroute from "./route/category.route.js"
import trainerroute from './route/trainer.route.js'


app.use(express.json())


app.use(cors({
    origin: 'http://localhost:5173', // Only allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow cookies and authorization headers
}));

app.use("/uploads", express.static("beckend/uploads"));


//dotenv to read the mongo_uri
dotenv.config();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "beckend/uploads/"); // Ensure this path exists
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);
      if (extname && mimeType) {
        cb(null, true);
      } else {
        cb(new Error("Only images are allowed"));
      }
    },
  });
  
  app.post("/api/category", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log
    console.log("Uploaded file:", req.file); // Debug log for file

    const { category, description, exercise } = req.body;

    // Parse and validate exercises
    const parsedExercises = JSON.parse(exercise).map((ex) => ({
      name: ex.name, // Ensure "name" is correctly mapped
      description: ex.description,
    }));

    // Create new category
    const newCategory = new Category({
      category,
      description,
      exercise: parsedExercises, // Use the correct schema field name
    });

    // Save image path if provided
    if (req.file) {
      newCategory.image = `beckend/uploads/${req.file.filename}`;
    }

    // Save to database
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully!",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category", error });
  }
});

  
app.get('/',(req,res)=>{
    res.send('server is ready it running here')
})
app.use(express.json())

app.use('/api/product',productRoutes)
console.log(process.env.MONGO_URI)

app.use('/api/signup',signinRoute );

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await auth.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare the password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const payload = {
        userId: user._id,
        email: user.email,
        usertype: user.usertype,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send token back as response
      res.json({ token });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/verify-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from header
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ success: true, user: decoded });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });
  app.use("/api/workout",workoutRoute );
  app.use("/api/categories", cateroute);
  app.use("/api/trainers",trainerroute)
//   app.use('/api/exercise',)




const PORT=process.env.PORT
app.listen(PORT,()=>{
    connectDB();
    console.log('server is running at http://localhost:5000')
});
