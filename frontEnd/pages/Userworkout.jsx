import React, { useState, useEffect } from "react";
import { Layout, Button, Spin, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Content } = Layout;

const UserWorkouts = () => {
  const [workouts, setWorkouts] = useState([]); // State to store workouts
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch workouts from the database
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const email = localStorage.getItem("email"); // Get email from localStorage
        
        if (!email) {
          throw new Error("User not authenticated. Please log in again.");
        }

        const response = await axios.get(
          `http://localhost:5000/api/workout/userworkout`,{
            params: { userEmail: email }, 
          }
        );
        const { success, data } = response.data;
    

        if (success && Array.isArray(data)) {
          setWorkouts(data);
        } else {
          throw new Error("Failed to fetch workouts. Invalid response.");
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to fetch workouts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Delete a workout
  const handleDelete = async (id) => {
    try {
        
      await axios.delete(`http://localhost:5000/api/workout/${id}`);
      message.success("Workout deleted successfully.");
      setWorkouts((prevWorkouts) =>
        prevWorkouts.filter((workout) => workout._id !== id)
      );
    } catch (error) {
      console.error("Error deleting workout:", error);
      message.error("Failed to delete workout. Please try again later.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: "24px", backgroundColor: "#f0f2f5" }}>
      <Content
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          background: "#fff",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}>
          My Workouts
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          Manage your planned workouts below:
        </p>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", marginTop: "24px", color: "red" }}>
            {error}
          </div>
        ) : workouts.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            {workouts.map((workout) => (
              <div
                key={workout._id}
                style={{
                  width: "300px",
                  padding: "16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                <h3 style={{ marginBottom: "8px", fontWeight: "bold" }}>
                  {workout.name || "Untitled Workout"}
                </h3>
                <p style={{ color: "#6b7280" }}>
                  {workout.description || "No description available."}
                </p>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  style={{ position: "absolute", top: "16px", right: "16px" }}
                  onClick={() => handleDelete(workout._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <p>No workouts found.</p>
          </div>
        )}
      </Content>

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

export default UserWorkouts;
