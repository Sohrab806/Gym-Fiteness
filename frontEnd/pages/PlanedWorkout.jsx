import { Layout, Spin, Button, Modal, Input, Form, message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const PlanedWorkout = () => {
    const navigate = useNavigate(); 
  const [workoutItems, setWorkoutItems] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading spinner
  const [error, setError] = useState(null); // State to handle errors
  const [selectedWorkout, setSelectedWorkout] = useState(null); // State for selected workout

  // Fetch data from the API
  useEffect(() => {
   
    const fetchWorkoutItems = async () => {
        
      try {
        setLoading(true);
        setError(null); // Reset any previous error
        const response = await axios.get("http://localhost:5000/api/workout");

        const { success, data } = response.data;

        if (success && Array.isArray(data)) {
          setWorkoutItems(data);
        } else {
          throw new Error("Invalid data format. Expected 'data' to be an array.");
        }
      } catch (error) {
        console.error("Error fetching workout items:", error);
        
        setError("Failed to fetch workouts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutItems();
  }, []);

  // Handle Add workout to database with selected workout and username
  const handleAddWorkout = async (workout) => {
  
    const email = localStorage.getItem("email"); // Retrieve email from localStorage
    if (!email) {
      alert("User not authenticated. Please log in again.");
      return;

    }
    console.log('this is email in planed:',email)
   
    try {
      const response = await axios.put("http://localhost:5000/api/workout", {
        name: workout.name,
        description: workout.description,
        userEmail: email , // Replace with actual username
      });

      message.success("Added to your Workout")
    } catch (error) {
    //   console.error("Error adding workout:", error);

    //   setError("Failed to add workout. Please try again later.");
       message.warning("Workout already exists. Redirecting to your workouts...");
      
       navigate('/home'); 
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      {/* Header Section */}
      <div
        style={{
          height: "40vh",
          backgroundImage: "url('/src/assets/Gym.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Main Content */}
      <Content
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          background: "#fff",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          marginTop: "-40px",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
          My Workouts
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          Below are your planned workouts:
        </p>

        {/* Content Rendering */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", marginTop: "24px", color: "red" }}>
            {error}
          </div>
        ) : workoutItems.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            {workoutItems.map((item) => (
              <div
                key={item._id}
                style={{
                  flex: "1 1 calc(33.33% - 16px)",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  minWidth: "250px",
                }}
              >
                <h3 style={{ marginBottom: "8px" }}>{item.name || "Untitled"}</h3>
                <p>{item.description || "No description available."}</p>

                {/* Add Button (+) */}
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlusOutlined />}
                  size="small"
                  style={{
                    marginTop: "12px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  onClick={() => handleAddWorkout(item)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <p>No workouts found.</p>
          </div>
        )}
      </Content>

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          backgroundColor: "#f0f2f5",
          textAlign: "center",
        }}
      >
        <p>© 2024 My Fitness App. All rights reserved.</p>
      </div>
    </Layout>
  );
};

export default PlanedWorkout;
