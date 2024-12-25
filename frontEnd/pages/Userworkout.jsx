import React, { useState, useEffect } from "react";
import { Layout, Button, Spin, message } from "antd";
import { DeleteOutlined,InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { List, Typography } from 'antd';

const { Content } = Layout;

const UserWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchWorkoutsAndCategories = async () => {
      try {
        setLoading(true);
        const email = localStorage.getItem("email");
        if (!email) throw new Error("User not authenticated. Please log in again.");

        const workoutResponse = await axios.get(`${BASE_URL}/api/workout/userworkout`, {
          params: { userEmail: email },
        });
        console.log('Workout Response:', workoutResponse.data);

        const { success: workoutSuccess, data: workoutsData } = workoutResponse.data;
        if (!workoutSuccess) throw new Error("Failed to fetch workouts.");

        const workoutNames = workoutsData.map((workout) => workout.name);
        console.log('Workout Names:', workoutNames);

        const categoryResponse = await axios.post(`${BASE_URL}/api/categories/match`, {
          userEmail: email,
          workouts: workoutNames,
        });
        console.log('Category Response:', categoryResponse.data);

        const { success: categorySuccess, data: categoriesData } = categoryResponse.data;
        if (!categorySuccess) throw new Error("Failed to fetch categories.");

        const matchedWorkouts = workoutsData.map((workout) => {
          const matchedCategory = categoriesData.find(
            (category) => category.category.toLowerCase() === workout.name.toLowerCase()
          );
          console.log('Matching workout:', workout.name, 'with category:', matchedCategory?.category);
          const combined = {
            ...workout,
            categoryDetails: matchedCategory || {},
          };
          console.log('Combined workout data:', combined);
          return combined;
        });

        console.log('Final matched workouts:', matchedWorkouts);
        setWorkouts(matchedWorkouts);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutsAndCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/workout/${id}`);
      message.success("Workout deleted successfully.");
      setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout._id !== id));
    } catch (error) {
      console.error("Error deleting workout:", error);
      message.error("Failed to delete workout. Please try again later.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", padding: "24px", backgroundColor: "#f0f2f5" ,width: "100%",maxWidth: "100%"}}>
      <Content
        style={{
        
          maxWidth: "5000px",
          margin: "0 auto",
          padding: "24px",
          background: "#fff",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: "22px",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "30px", fontWeight: "700", color: "#333" }}>
          My Workouts
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "16px" }}>
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
              gap: "24px",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            {workouts.map((workout) => (
              <div
                key={workout._id}
                style={{
                  width: "620px",
                  background: "#fff",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    flex: "1",
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                 
                  {workout.categoryDetails.category && (
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ marginBottom: "8px", color: "#555" }}>
                        Category: {workout.categoryDetails.category}
                      </h4>
                      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
                        {workout.categoryDetails.description}
                      </p>
                      <h5 style={{ color: "#444", fontSize: "16px", marginBottom: "8px" }}>
                        Exercises:
                      </h5>
                      <List
  header={<div>Exercises</div>}
  footer={<div>End of Exercises</div>}
  bordered
  dataSource={workout.categoryDetails.exercise} // Assuming `exercise` is an array
  renderItem={(exercise) => (
    <List.Item>
      <Typography.Text mark> <div style={{
        
          color:"white",
          padding: "10px",
          background: "#2E8B57",
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
          borderRadius: "12px",}}>{exercise.name} </div>  </Typography.Text>
      <p style={{ color: "#6b7280", fontSize: "14px", margin: "12px 0 0px 30px",  }}>
      <InfoCircleOutlined style={{ marginRight: '8px' }} />
        { exercise.description}
      </p>
    </List.Item>
  )}
/>
                    </div>
                  )}
                </div>

                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    borderRadius: "10%",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    padding: "10px",
                    transition: "background-color 0.3s ease",
                  }}
                  onClick={() => handleDelete(workout._id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>No workouts found.</p>
          </div>
        )}
      </Content>

      <div
        style={{
          marginTop: "40px",
          padding: "16px",
          backgroundColor: "#f0f2f5",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#6b7280" }}>© 2024 My Fitness App. All rights reserved.</p>
      </div>
    </Layout>
  );
};

export default UserWorkouts;
