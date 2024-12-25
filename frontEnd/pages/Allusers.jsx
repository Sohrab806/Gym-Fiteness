import { Layout, Table, Button, Spin, message } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";

const { Content } = Layout;

const UsersPage = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState(null); // State to handle any errors

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null); // Reset any previous errors

        const response = await axios.get("http://localhost:5000/api/signup");
        const { data } = response;

        if (data.success || data.sucess) {
          setUsers(data.data || []); // Default to empty array if no data is found
        } else {
          throw new Error("API response indicates failure.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Current Workout",
      dataIndex: "workout",
      key: "workout",
      render: (workouts) => {
        // Check if the workout array is not empty and display workout names
        if (workouts && Array.isArray(workouts) && workouts.length > 0) {
          return workouts.map((workout, index) => (
            <div key={index}>
              <strong>{workout.name}:</strong> {workout.description}
            </div>
          ));
        }
        return "No current workout";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => message.info(`More info about ${record.name}`)}
        >
          More Info
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      <div
        style={{
          height: "40vh",
          backgroundImage: "url('/src/assets/Gym.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

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
          User List
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", marginTop: "24px", color: "red" }}>
            {error}
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={users}
            rowKey="email"
            pagination={{ pageSize: 5 }}
          />
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

export default UsersPage;
