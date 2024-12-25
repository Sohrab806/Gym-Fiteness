import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { DatePicker } from "antd";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Register from "../auth/Regsiter";
import Login from "../auth/Login";
import Home from "../pages/Home";
import WorklogPage from "../pages/WorklogPage";
import ViewPage from "../pages/ViewPage";
import PlanedWorkout from "../pages/PlanedWorkout";
import UserWorkout from "../pages/Userworkout";
import UsersPage from "../pages/Allusers"
import Setexcercise from "../pages/Setexcercise"
import TrainerApplications from "../pages/Applications";


function App() {
  return (
    <>
    
    <Routes>
        <Route path="/register" element={<Register />} />
        {/* Default route (Register Page) */}
        <Route path="/" element={<Login />} /> {/* Login Page Route */}


        <Route path="/home" element={<Home/>}/>
        {/* <Route path="/viewpage" element={<ViewPage/>}/> */}
        {/* <Route path="/worklogPage" element={<WorklogPage/>}/> */}
        {/* <Route path="/planedworkout" element={<PlanedWorkout/>}/> */}
        <Route path="/workout" element={<PlanedWorkout />} />
        <Route path="/userworkout" element={<UserWorkout/>} />
        <Route path="/Allusers" element={<UsersPage/>} />
        <Route path="/setexcercise" element={<Setexcercise/>} />
        <Route path="/applications" element={<TrainerApplications/>} />
       
        
    
      </Routes>
    
      
    </>
  );
}

export default App;
